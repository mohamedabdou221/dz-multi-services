-- 0002_functions_triggers.sql : fonctions utilitaires, déclencheurs, vues, fonctions d'appel (RPC)

-- ---------- Rôles du personnel ----------
create or replace function public.staff_role() returns public.app_role
language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid() and is_active
$$;
create or replace function public.is_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select public.staff_role() is not null
$$;
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(public.staff_role() in ('ADMIN','SUPER_ADMIN'), false)
$$;
create or replace function public.is_super() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(public.staff_role() = 'SUPER_ADMIN', false)
$$;

-- ---------- Numérotation ----------
create or replace function public.next_doc_number(p_type text, p_prefix text, p_pad int)
returns text language plpgsql security definer set search_path = public as $$
declare v_year int := extract(year from now())::int; v_n int;
begin
  insert into public.doc_counters(doc_type, year, last_value) values (p_type, v_year, 1)
  on conflict (doc_type, year) do update set last_value = public.doc_counters.last_value + 1
  returning last_value into v_n;
  return p_prefix || '-' || v_year || '-' || lpad(v_n::text, p_pad, '0');
end $$;

-- ---------- updated_at ----------
create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end $$;

do $$
declare t text;
begin
  for t in
    select c.table_name from information_schema.columns c
    join information_schema.tables x on x.table_schema = c.table_schema and x.table_name = c.table_name
    where c.table_schema = 'public' and c.column_name = 'updated_at' and x.table_type = 'BASE TABLE'
  loop
    execute format('create trigger trg_%s_updated_at before update on public.%I for each row execute function public.set_updated_at()', t, t);
  end loop;
end $$;

-- ---------- Références ----------
create or replace function public.trg_set_request_reference() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.reference is null then new.reference := public.next_doc_number('REQUEST', 'DZ', 6); end if;
  return new;
end $$;
create trigger trg_requests_reference before insert on public.requests
for each row execute function public.trg_set_request_reference();

create or replace function public.trg_set_quote_number() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.quote_number is null then new.quote_number := public.next_doc_number('QUOTE', 'DV', 5); end if;
  return new;
end $$;
create trigger trg_quotes_number before insert on public.quotes
for each row execute function public.trg_set_quote_number();

create or replace function public.trg_set_document_number() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.document_number is null then
    if new.document_type = 'RECEIPT' then new.document_number := public.next_doc_number('RECEIPT', 'RC', 5);
    elsif new.document_type = 'SERVICE_SHEET' then new.document_number := public.next_doc_number('SERVICE_SHEET', 'FP', 6);
    else raise exception 'document_number requis pour un devis'; end if;
  end if;
  return new;
end $$;
create trigger trg_documents_number before insert on public.generated_documents
for each row execute function public.trg_set_document_number();

-- ---------- Demandes : transitions et historique ----------
create or replace function public.trg_request_transition_guard() returns trigger language plpgsql as $$
begin
  if new.status = old.status then return new; end if;
  if not ((old.status::text, new.status::text) in (
    ('NEW','IN_REVIEW'),('NEW','CANCELLED'),
    ('IN_REVIEW','QUOTE_SENT'),('IN_REVIEW','CANCELLED'),
    ('QUOTE_SENT','ACCEPTED'),('QUOTE_SENT','REJECTED'),('QUOTE_SENT','EXPIRED'),
    ('QUOTE_SENT','IN_REVIEW'),('QUOTE_SENT','CANCELLED'),
    ('ACCEPTED','IN_PROGRESS'),('ACCEPTED','CANCELLED'),
    ('IN_PROGRESS','COMPLETED'),('IN_PROGRESS','CANCELLED'),
    ('REJECTED','IN_REVIEW'),('EXPIRED','IN_REVIEW'))) then
    raise exception 'Transition de statut interdite : % -> %', old.status, new.status using errcode = '23514';
  end if;
  return new;
end $$;
create trigger trg_requests_transition before update of status on public.requests
for each row execute function public.trg_request_transition_guard();

create or replace function public.trg_request_events() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    insert into public.request_events(request_id, event_type, to_status, message, visible_to_client, created_by)
    values (new.id, 'CREATED', new.status, 'Demande enregistrée', true, auth.uid());
  elsif new.status is distinct from old.status then
    insert into public.request_events(request_id, event_type, from_status, to_status, visible_to_client, created_by)
    values (new.id, 'STATUS_CHANGED', old.status, new.status, true, auth.uid());
  end if;
  return null;
end $$;
create trigger trg_requests_events after insert or update of status on public.requests
for each row execute function public.trg_request_events();

-- ---------- Devis ----------
create or replace function public.trg_quote_guard() returns trigger language plpgsql as $$
begin
  if tg_op = 'UPDATE' then
    if old.status <> 'DRAFT' and
       (new.request_id, new.quote_number, new.version, new.subtotal, new.discount, new.tax, new.total, new.deposit_amount, new.currency)
       is distinct from
       (old.request_id, old.quote_number, old.version, old.subtotal, old.discount, old.tax, old.total, old.deposit_amount, old.currency) then
      raise exception 'Devis déjà envoyé : montants non modifiables' using errcode = '23514';
    end if;
    if new.status is distinct from old.status then
      if not ((old.status::text, new.status::text) in (
        ('DRAFT','SENT'),('DRAFT','CANCELLED'),
        ('SENT','VIEWED'),('SENT','ACCEPTED'),('SENT','REJECTED'),('SENT','EXPIRED'),('SENT','CANCELLED'),
        ('VIEWED','ACCEPTED'),('VIEWED','REJECTED'),('VIEWED','EXPIRED'),('VIEWED','CANCELLED'))) then
        raise exception 'Transition de devis interdite : % -> %', old.status, new.status using errcode = '23514';
      end if;
      if new.status = 'SENT' then
        if auth.uid() is not null and not public.is_admin() then
          raise exception 'Seul un administrateur peut envoyer un devis' using errcode = '42501';
        end if;
        new.sent_at := coalesce(new.sent_at, now());
      end if;
    end if;
  end if;
  return new;
end $$;
create trigger trg_quotes_guard before update on public.quotes
for each row execute function public.trg_quote_guard();

create or replace function public.trg_quote_items_totals() returns trigger
language plpgsql security definer set search_path = public as $$
declare v_quote uuid := coalesce(new.quote_id, old.quote_id); v_status public.quote_status; v_sub numeric(14,2);
begin
  select status into v_status from public.quotes where id = v_quote;
  if v_status is null then return null; end if;
  if v_status <> 'DRAFT' then
    raise exception 'Lignes non modifiables : devis déjà envoyé' using errcode = '23514';
  end if;
  select coalesce(sum(total), 0) into v_sub from public.quote_items where quote_id = v_quote;
  update public.quotes set subtotal = v_sub, total = greatest(v_sub - discount + tax, 0) where id = v_quote;
  return null;
end $$;
create trigger trg_quote_items_totals after insert or update or delete on public.quote_items
for each row execute function public.trg_quote_items_totals();

create or replace function public.refresh_payment_state(p_request uuid) returns void
language plpgsql security definer set search_path = public as $$
declare v_total numeric; v_paid numeric; v_refunded numeric; v_state public.payment_state;
begin
  select total into v_total from public.quotes where request_id = p_request and status = 'ACCEPTED';
  select coalesce(sum(amount) filter (where status = 'CONFIRMED'), 0),
         coalesce(sum(amount) filter (where status = 'REFUNDED'), 0)
    into v_paid, v_refunded from public.payments where request_id = p_request;
  v_state := case
    when v_paid = 0 and v_refunded > 0 then 'REFUNDED'::public.payment_state
    when v_paid = 0 then 'UNPAID'::public.payment_state
    when v_total is not null and v_paid >= v_total then 'PAID'::public.payment_state
    else 'PARTIAL'::public.payment_state end;
  update public.requests set payment_state = v_state where id = p_request and payment_state is distinct from v_state;
end $$;

create or replace function public.trg_quote_sync_request() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    update public.requests set status = 'IN_REVIEW' where id = new.request_id and status = 'NEW';
    return null;
  end if;
  if new.status is not distinct from old.status then return null; end if;
  if new.status = 'SENT' then
    update public.quotes set status = 'CANCELLED'
      where request_id = new.request_id and id <> new.id and status in ('SENT','VIEWED');
    update public.requests set status = 'QUOTE_SENT' where id = new.request_id and status = 'IN_REVIEW';
  elsif new.status = 'ACCEPTED' then
    update public.requests set status = 'ACCEPTED' where id = new.request_id and status = 'QUOTE_SENT';
    perform public.refresh_payment_state(new.request_id);
  elsif new.status = 'REJECTED' then
    update public.requests set status = 'REJECTED' where id = new.request_id and status = 'QUOTE_SENT';
  elsif new.status = 'EXPIRED' then
    update public.requests set status = 'EXPIRED' where id = new.request_id and status = 'QUOTE_SENT';
  end if;
  return null;
end $$;
create trigger trg_quotes_sync after insert or update of status on public.quotes
for each row execute function public.trg_quote_sync_request();

-- ---------- Paiements ----------
create or replace function public.trg_payment_guard() returns trigger
language plpgsql security definer set search_path = public as $$
declare v_customer uuid;
begin
  select customer_id into v_customer from public.requests where id = new.request_id;
  if v_customer is null then raise exception 'Demande introuvable'; end if;
  new.customer_id := v_customer;
  if new.quote_id is not null and not exists (select 1 from public.quotes where id = new.quote_id and request_id = new.request_id) then
    raise exception 'Le devis ne correspond pas à la demande' using errcode = '23514';
  end if;

  if tg_op = 'INSERT' then
    new.created_by := coalesce(new.created_by, auth.uid());
    if auth.uid() is not null and not public.is_admin() and (new.status <> 'PENDING') then
      raise exception 'Un agent ne peut enregistrer qu''un paiement en attente' using errcode = '42501';
    end if;
  else
    if old.status in ('CONFIRMED','REFUNDED') and
       (new.request_id, new.quote_id, new.amount, new.currency, new.paid_at)
       is distinct from (old.request_id, old.quote_id, old.amount, old.currency, old.paid_at) then
      raise exception 'Paiement confirmé : montant et rattachement non modifiables' using errcode = '23514';
    end if;
    if new.status is distinct from old.status and auth.uid() is not null and not public.is_admin() then
      raise exception 'Seul un administrateur peut changer le statut d''un paiement' using errcode = '42501';
    end if;
  end if;

  if new.status = 'CONFIRMED' and (tg_op = 'INSERT' or old.status <> 'CONFIRMED') then
    new.confirmed_by := coalesce(new.confirmed_by, auth.uid());
    new.confirmed_at := coalesce(new.confirmed_at, now());
    new.paid_at := coalesce(new.paid_at, now());
  end if;
  return new;
end $$;
create trigger trg_payments_guard before insert or update on public.payments
for each row execute function public.trg_payment_guard();

create or replace function public.trg_payment_refresh() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  perform public.refresh_payment_state(coalesce(new.request_id, old.request_id));
  return null;
end $$;
create trigger trg_payments_refresh after insert or update or delete on public.payments
for each row execute function public.trg_payment_refresh();

-- ---------- Notifications internes ----------
create or replace function public.notify_staff(p_request uuid, p_title text, p_message text, p_type text)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.notifications(user_id, request_id, title, message, type)
  select id, p_request, p_title, p_message, p_type from public.profiles where is_active;
end $$;

create or replace function public.trg_notify_request() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  perform public.notify_staff(new.id, 'Nouvelle demande', 'Demande ' || new.reference, 'NEW_REQUEST');
  return null;
end $$;
create trigger trg_requests_notify after insert on public.requests
for each row execute function public.trg_notify_request();

create or replace function public.trg_notify_quote() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.status = 'ACCEPTED' and old.status <> 'ACCEPTED' then
    perform public.notify_staff(new.request_id, 'Devis accepté', 'Devis ' || new.quote_number, 'QUOTE_ACCEPTED');
  end if;
  return null;
end $$;
create trigger trg_quotes_notify after update of status on public.quotes
for each row execute function public.trg_notify_quote();

create or replace function public.trg_notify_payment() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.status = 'CONFIRMED' and (tg_op = 'INSERT' or old.status <> 'CONFIRMED') then
    perform public.notify_staff(new.request_id, 'Paiement confirmé', 'Montant : ' || new.amount || ' ' || new.currency, 'PAYMENT_CONFIRMED');
  end if;
  return null;
end $$;
create trigger trg_payments_notify after insert or update of status on public.payments
for each row execute function public.trg_notify_payment();

create or replace function public.trg_notify_contact() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  perform public.notify_staff(null, 'Nouveau message de contact', new.name, 'NEW_CONTACT');
  return null;
end $$;
create trigger trg_contact_notify after insert on public.contact_messages
for each row execute function public.trg_notify_contact();

-- ---------- Journal d'activité ----------
create or replace function public.trg_audit() returns trigger
language plpgsql security definer set search_path = public as $$
declare v_ip text; v_row jsonb;
begin
  begin
    v_ip := nullif(split_part(coalesce(current_setting('request.headers', true)::json ->> 'x-forwarded-for', ''), ',', 1), '');
  exception when others then v_ip := null;
  end;
  v_row := case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end;
  insert into public.audit_logs(user_id, action, entity_type, entity_id, old_data, new_data, ip_address)
  values (auth.uid(), tg_op, tg_table_name, v_row ->> 'id',
          case when tg_op in ('UPDATE','DELETE') then to_jsonb(old) end,
          case when tg_op in ('INSERT','UPDATE') then to_jsonb(new) end, v_ip);
  return null;
end $$;

do $$
declare t text;
begin
  foreach t in array array['profiles','services','customers','beneficiaries','requests','quotes','quote_items',
                           'payments','expenses','generated_documents','site_settings']
  loop
    execute format('create trigger trg_%s_audit after insert or update or delete on public.%I for each row execute function public.trg_audit()', t, t);
  end loop;
end $$;

-- ---------- Vues financières ----------
create or replace view public.v_request_amounts with (security_invoker = true) as
select r.id as request_id, r.reference, r.currency,
       q.id as quote_id,
       coalesce(q.total, 0) as total,
       coalesce(pt.pass_through, 0) as pass_through,
       coalesce(q.total, 0) - coalesce(pt.pass_through, 0) as agency_revenue,
       coalesce(pay.paid, 0) as paid,
       greatest(coalesce(q.total, 0) - coalesce(pay.paid, 0), 0) as remaining
from public.requests r
left join public.quotes q on q.request_id = r.id and q.status = 'ACCEPTED'
left join lateral (select sum(i.total) as pass_through from public.quote_items i
                   where i.quote_id = q.id and i.is_pass_through) pt on true
left join lateral (select sum(p.amount) as paid from public.payments p
                   where p.request_id = r.id and p.status = 'CONFIRMED') pay on true;

create or replace view public.v_monthly_finance with (security_invoker = true) as
with inc as (
  select date_trunc('month', p.paid_at)::date as month, p.currency,
         sum(p.amount) as cash_in,
         round(sum(p.amount * case when a.total > 0 then a.agency_revenue / a.total else 0 end), 2) as agency_income
  from public.payments p join public.v_request_amounts a on a.request_id = p.request_id
  where p.status = 'CONFIRMED' group by 1, 2
), exp as (
  select date_trunc('month', expense_date)::date as month, currency, sum(amount) as expenses
  from public.expenses group by 1, 2
)
select coalesce(inc.month, exp.month) as month, coalesce(inc.currency, exp.currency) as currency,
       coalesce(inc.cash_in, 0) as cash_in, coalesce(inc.agency_income, 0) as agency_income,
       coalesce(exp.expenses, 0) as expenses,
       coalesce(inc.agency_income, 0) - coalesce(exp.expenses, 0) as result
from inc full join exp on inc.month = exp.month and inc.currency = exp.currency;

-- ---------- Fonctions d'appel (RPC), réservées au serveur (service_role) ----------
create or replace function public.submit_request(p jsonb) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_service public.services%rowtype; v_req public.requests%rowtype;
  v_cust uuid; v_ben uuid; v_wd uuid; ev jsonb;
  c jsonb := p -> 'customer'; b jsonb := p -> 'beneficiary';
  d jsonb := coalesce(p -> 'details', '{}'::jsonb);
begin
  if coalesce((p ->> 'consent')::boolean, false) is not true then
    raise exception 'Consentement requis' using errcode = '22023';
  end if;
  select * into v_service from public.services where slug = p ->> 'service_slug' and is_active;
  if not found then raise exception 'Service introuvable' using errcode = 'P0002'; end if;

  -- Client existant : rattachement sans écrasement des données (réconciliation par le personnel).
  select id into v_cust from public.customers where phone = c ->> 'phone' and deleted_at is null;
  if v_cust is null then
    insert into public.customers(first_name, last_name, email, phone, whatsapp, country, city, region, address, customer_type, consent_at)
    values (c ->> 'first_name', c ->> 'last_name', nullif(c ->> 'email', ''), c ->> 'phone', nullif(c ->> 'whatsapp', ''),
            nullif(c ->> 'country', ''), nullif(c ->> 'city', ''), nullif(c ->> 'region', ''), nullif(c ->> 'address', ''),
            coalesce(nullif(c ->> 'customer_type', '')::public.customer_type, 'LOCAL'), now())
    returning id into v_cust;
  end if;

  if b is not null and jsonb_typeof(b) = 'object' then
    insert into public.beneficiaries(customer_id, first_name, last_name, phone, whatsapp, country, city, region, address, relationship)
    values (v_cust, b ->> 'first_name', b ->> 'last_name', nullif(b ->> 'phone', ''), nullif(b ->> 'whatsapp', ''),
            nullif(b ->> 'country', ''), nullif(b ->> 'city', ''), nullif(b ->> 'region', ''), nullif(b ->> 'address', ''),
            nullif(b ->> 'relationship', ''))
    returning id into v_ben;
  end if;

  insert into public.requests(customer_id, beneficiary_id, service_id, request_type, source, description, preferred_date, preferred_time)
  values (v_cust, v_ben, v_service.id,
          case when v_service.service_type = 'QUOTE' then 'QUOTE'::public.request_type else 'SERVICE_REQUEST'::public.request_type end,
          'SITE', nullif(p ->> 'description', ''), nullif(p ->> 'preferred_date', '')::date, nullif(p ->> 'preferred_time', '')::time)
  returning * into v_req;

  case v_service.form_key
    when 'wedding' then
      insert into public.wedding_details(request_id, requester_role, groom_name, bride_name, boina_harus_name, bibi_harus_name,
                                         venue, city, region, start_date, end_date, additional_notes)
      values (v_req.id, nullif(d ->> 'requester_role', ''), d ->> 'groom_name', d ->> 'bride_name', d ->> 'boina_harus_name',
              d ->> 'bibi_harus_name', d ->> 'venue', nullif(d ->> 'city', ''), nullif(d ->> 'region', ''),
              nullif(d ->> 'start_date', '')::date, nullif(d ->> 'end_date', '')::date, nullif(d ->> 'additional_notes', ''))
      returning id into v_wd;
      for ev in select * from jsonb_array_elements(coalesce(d -> 'events', '[]'::jsonb)) loop
        insert into public.wedding_events(wedding_detail_id, ceremony_type_id, custom_label, event_date, start_time, end_time,
                                          ends_next_day, venue, notes, sort_order)
        values (v_wd, (select id from public.ceremony_types where code = ev ->> 'ceremony_code' and is_active),
                nullif(ev ->> 'custom_label', ''), (ev ->> 'event_date')::date, (ev ->> 'start_time')::time,
                nullif(ev ->> 'end_time', '')::time, coalesce((ev ->> 'ends_next_day')::boolean, false),
                nullif(ev ->> 'venue', ''), nullif(ev ->> 'notes', ''), coalesce((ev ->> 'sort_order')::int, 0));
      end loop;
      if jsonb_typeof(d -> 'photo_numbers') = 'array' and jsonb_array_length(d -> 'photo_numbers') > 0 then
        insert into public.photo_sessions(request_id, wedding_detail_id, photo_numbers)
        values (v_req.id, v_wd, array(select jsonb_array_elements_text(d -> 'photo_numbers')::int));
      end if;
    when 'photo' then
      insert into public.photo_sessions(request_id, session_type, session_date, start_time, end_time, location, participants_count, photo_numbers, notes)
      values (v_req.id, nullif(d ->> 'session_type', ''), nullif(d ->> 'session_date', '')::date, nullif(d ->> 'start_time', '')::time,
              nullif(d ->> 'end_time', '')::time, nullif(d ->> 'location', ''), nullif(d ->> 'participants_count', '')::int,
              coalesce(array(select jsonb_array_elements_text(d -> 'photo_numbers')::int), '{}'), nullif(d ->> 'notes', ''));
    when 'advertising' then
      insert into public.advertising_requests(request_id, company_name, activity, contact_person, campaign_objective, product_service,
                                              shooting_location, preferred_date, duration, distribution_channels, has_script, needs_script,
                                              needs_actors, needs_voiceover, needs_music, other_needs, notes)
      values (v_req.id, d ->> 'company_name', nullif(d ->> 'activity', ''), nullif(d ->> 'contact_person', ''),
              nullif(d ->> 'campaign_objective', ''), nullif(d ->> 'product_service', ''), nullif(d ->> 'shooting_location', ''),
              nullif(d ->> 'preferred_date', '')::date, nullif(d ->> 'duration', ''),
              coalesce(array(select jsonb_array_elements_text(d -> 'distribution_channels')), '{}'),
              coalesce((d ->> 'has_script')::boolean, false), coalesce((d ->> 'needs_script')::boolean, false),
              coalesce((d ->> 'needs_actors')::boolean, false), coalesce((d ->> 'needs_voiceover')::boolean, false),
              coalesce((d ->> 'needs_music')::boolean, false), nullif(d ->> 'other_needs', ''), nullif(d ->> 'notes', ''));
    when 'printing' then
      insert into public.printing_requests(request_id, document_type, format, quantity, color_mode, duplex, paper_type, finishing, deadline, notes)
      values (v_req.id, d ->> 'document_type', nullif(d ->> 'format', ''), nullif(d ->> 'quantity', '')::int, nullif(d ->> 'color_mode', ''),
              (d ->> 'duplex')::boolean, nullif(d ->> 'paper_type', ''), nullif(d ->> 'finishing', ''),
              nullif(d ->> 'deadline', '')::date, nullif(d ->> 'notes', ''));
    else
      insert into public.service_request_details(request_id, details) values (v_req.id, d);
  end case;

  insert into public.request_files(request_id, file_name, file_path, mime_type, file_size)
  select v_req.id, f ->> 'file_name', f ->> 'file_path', f ->> 'mime_type', (f ->> 'file_size')::bigint
  from jsonb_array_elements(coalesce(p -> 'files', '[]'::jsonb)) f
  where (f ->> 'file_path') like 'incoming/%';

  return jsonb_build_object('reference', v_req.reference, 'public_token', v_req.public_token);
end $$;

create or replace function public.submit_contact(p jsonb) returns void
language plpgsql security definer set search_path = public as $$
begin
  insert into public.contact_messages(name, phone, email, subject, message)
  values (p ->> 'name', nullif(p ->> 'phone', ''), nullif(p ->> 'email', ''), nullif(p ->> 'subject', ''), p ->> 'message');
end $$;

create or replace function public.get_request_public(p_token text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_req public.requests%rowtype; v_out jsonb;
begin
  select * into v_req from public.requests where public_token = p_token;
  if not found then return null; end if;
  select jsonb_build_object(
    'reference', v_req.reference, 'status', v_req.status, 'payment_state', v_req.payment_state,
    'created_at', v_req.created_at,
    'service', (select name from public.services where id = v_req.service_id),
    'events', coalesce((select jsonb_agg(jsonb_build_object('event_type', e.event_type, 'to_status', e.to_status,
                         'message', e.message, 'created_at', e.created_at) order by e.created_at)
                        from public.request_events e where e.request_id = v_req.id and e.visible_to_client), '[]'::jsonb),
    'quotes', coalesce((select jsonb_agg(jsonb_build_object('quote_number', q.quote_number, 'status', q.status, 'total', q.total,
                         'currency', q.currency, 'valid_until', q.valid_until, 'token', q.public_token) order by q.version)
                        from public.quotes q where q.request_id = v_req.id and q.status in ('SENT','VIEWED','ACCEPTED')), '[]'::jsonb)
  ) into v_out;
  return v_out;
end $$;

create or replace function public.get_quote_public(p_token text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_q public.quotes%rowtype;
begin
  select * into v_q from public.quotes where public_token = p_token and status <> 'DRAFT';
  if not found then return null; end if;
  if v_q.status = 'SENT' then
    update public.quotes set status = 'VIEWED', viewed_at = now() where id = v_q.id returning * into v_q;
  end if;
  return jsonb_build_object(
    'quote_number', v_q.quote_number, 'version', v_q.version, 'status', v_q.status,
    'currency', v_q.currency, 'subtotal', v_q.subtotal, 'discount', v_q.discount, 'tax', v_q.tax, 'total', v_q.total,
    'deposit_amount', v_q.deposit_amount, 'valid_until', v_q.valid_until, 'terms', v_q.terms,
    'accepted_at', v_q.accepted_at, 'accepted_by_name', v_q.accepted_by_name,
    'request_reference', (select reference from public.requests where id = v_q.request_id),
    'service', (select s.name from public.requests r join public.services s on s.id = r.service_id where r.id = v_q.request_id),
    'customer_first_name', (select c.first_name from public.requests r join public.customers c on c.id = r.customer_id where r.id = v_q.request_id),
    'items', coalesce((select jsonb_agg(jsonb_build_object('description', i.description, 'quantity', i.quantity,
                       'unit_price', i.unit_price, 'total', i.total) order by i.sort_order)
                       from public.quote_items i where i.quote_id = v_q.id), '[]'::jsonb));
end $$;

create or replace function public.accept_quote(p_token text, p_name text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_q public.quotes%rowtype;
begin
  if p_name is null or btrim(p_name) = '' then raise exception 'Nom requis' using errcode = '22023'; end if;
  select * into v_q from public.quotes where public_token = p_token for update;
  if not found or v_q.status not in ('SENT','VIEWED') then raise exception 'Devis non acceptable' using errcode = '23514'; end if;
  if v_q.valid_until is not null and v_q.valid_until < current_date then raise exception 'Devis expiré' using errcode = '23514'; end if;
  update public.quotes set status = 'ACCEPTED', accepted_at = now(), accepted_by_name = btrim(p_name) where id = v_q.id;
  return jsonb_build_object('quote_number', v_q.quote_number, 'status', 'ACCEPTED');
end $$;

create or replace function public.reject_quote(p_token text, p_reason text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_q public.quotes%rowtype;
begin
  select * into v_q from public.quotes where public_token = p_token for update;
  if not found or v_q.status not in ('SENT','VIEWED') then raise exception 'Devis non refusable' using errcode = '23514'; end if;
  update public.quotes set status = 'REJECTED' where id = v_q.id;
  insert into public.request_events(request_id, event_type, message, visible_to_client)
  values (v_q.request_id, 'QUOTE_REJECTED', nullif(btrim(p_reason), ''), false);
  return jsonb_build_object('quote_number', v_q.quote_number, 'status', 'REJECTED');
end $$;

create or replace function public.request_quote_change(p_token text, p_message text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_q public.quotes%rowtype;
begin
  select * into v_q from public.quotes where public_token = p_token for update;
  if not found or v_q.status not in ('SENT','VIEWED') then raise exception 'Devis non modifiable' using errcode = '23514'; end if;
  insert into public.request_events(request_id, event_type, message, visible_to_client)
  values (v_q.request_id, 'QUOTE_CHANGE_REQUESTED', nullif(btrim(p_message), ''), true);
  update public.requests set status = 'IN_REVIEW' where id = v_q.request_id and status = 'QUOTE_SENT';
  return jsonb_build_object('quote_number', v_q.quote_number, 'status', v_q.status);
end $$;

create or replace function public.expire_quotes() returns int
language plpgsql security definer set search_path = public as $$
declare n int;
begin
  update public.quotes set status = 'EXPIRED' where status in ('SENT','VIEWED') and valid_until < current_date;
  get diagnostics n = row_count;
  return n;
end $$;
