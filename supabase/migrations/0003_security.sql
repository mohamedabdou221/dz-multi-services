-- 0003_security.sql : RLS, droits, stockage
-- Principe : tout est refusé par défaut ; chaque table a ses politiques explicites.

-- ---------- RLS sur toutes les tables ----------
do $$
declare t text;
begin
  for t in select tablename from pg_tables where schemaname = 'public' loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

-- ---------- Droits (défense en profondeur, en plus de RLS) ----------
revoke all on all tables    in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;
revoke all on all functions in schema public from public, anon, authenticated;

grant usage on schema public to anon, authenticated, service_role;
grant all on all tables    in schema public to service_role;
grant all on all sequences in schema public to service_role;
grant select, insert, update, delete on all tables in schema public to authenticated;
revoke insert, update, delete on public.audit_logs from authenticated;
revoke all on public.doc_counters from authenticated;
grant select on
  public.service_categories, public.services, public.service_form_fields, public.ceremony_types,
  public.gallery_items, public.testimonials, public.faqs, public.site_settings
to anon;
grant select on public.v_request_amounts, public.v_monthly_finance to authenticated;

grant execute on function public.staff_role(), public.is_staff(), public.is_admin(), public.is_super()
  to anon, authenticated, service_role;
grant execute on function
  public.submit_request(jsonb), public.submit_contact(jsonb), public.get_request_public(text), public.get_quote_public(text),
  public.accept_quote(text, text), public.reject_quote(text, text), public.request_quote_change(text, text),
  public.expire_quotes()
to service_role;

-- ---------- Profils ----------
create policy profiles_select on public.profiles for select to authenticated
  using (public.is_staff() or id = auth.uid());
create policy profiles_super_all on public.profiles for all to authenticated
  using (public.is_super()) with check (public.is_super());
create policy profiles_self_update on public.profiles for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid() and role = public.staff_role() and is_active);

-- ---------- Catalogue (lecture publique des éléments actifs) ----------
create policy cat_public_read on public.service_categories for select to anon, authenticated using (is_active);
create policy cat_staff_read  on public.service_categories for select to authenticated using (public.is_staff());
create policy cat_admin_write on public.service_categories for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy svc_public_read on public.services for select to anon, authenticated using (is_active);
create policy svc_staff_read  on public.services for select to authenticated using (public.is_staff());
create policy svc_admin_write on public.services for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy sff_public_read on public.service_form_fields for select to anon, authenticated
  using (exists (select 1 from public.services s where s.id = service_id and s.is_active));
create policy sff_staff_read  on public.service_form_fields for select to authenticated using (public.is_staff());
create policy sff_admin_write on public.service_form_fields for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy cer_public_read on public.ceremony_types for select to anon, authenticated using (is_active);
create policy cer_staff_read  on public.ceremony_types for select to authenticated using (public.is_staff());
create policy cer_admin_write on public.ceremony_types for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- Contenus ----------
create policy gal_public_read on public.gallery_items for select to anon, authenticated using (is_published);
create policy gal_staff_read  on public.gallery_items for select to authenticated using (public.is_staff());
create policy gal_admin_write on public.gallery_items for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy tes_public_read on public.testimonials for select to anon, authenticated using (is_published);
create policy tes_staff_read  on public.testimonials for select to authenticated using (public.is_staff());
create policy tes_admin_write on public.testimonials for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy faq_public_read on public.faqs for select to anon, authenticated using (is_published);
create policy faq_staff_read  on public.faqs for select to authenticated using (public.is_staff());
create policy faq_admin_write on public.faqs for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy set_public_read on public.site_settings for select to anon, authenticated using (is_public);
create policy set_admin_all   on public.site_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- Données métier : personnel uniquement ----------
do $$
declare t text;
begin
  foreach t in array array['customers','beneficiaries','requests','request_events','request_files',
                           'wedding_details','wedding_events','photo_sessions','advertising_requests',
                           'printing_requests','service_request_details','quotes','quote_items',
                           'payments','bookings','generated_documents','contact_messages']
  loop
    execute format('create policy %1$s_staff_select on public.%1$I for select to authenticated using (public.is_staff())', t);
    execute format('create policy %1$s_staff_insert on public.%1$I for insert to authenticated with check (public.is_staff())', t);
  end loop;
  -- mise à jour : tout sauf journaux immuables
  foreach t in array array['customers','beneficiaries','requests','wedding_details','wedding_events','photo_sessions',
                           'advertising_requests','printing_requests','service_request_details','quotes','quote_items',
                           'payments','bookings','contact_messages','request_files']
  loop
    execute format('create policy %1$s_staff_update on public.%1$I for update to authenticated using (public.is_staff()) with check (public.is_staff())', t);
  end loop;
end $$;

-- Suppressions : uniquement les brouillons de devis et leurs lignes ; jamais de paiement.
create policy quotes_delete_draft on public.quotes for delete to authenticated
  using (public.is_staff() and status = 'DRAFT');
create policy quote_items_delete_draft on public.quote_items for delete to authenticated
  using (public.is_staff() and exists (select 1 from public.quotes q where q.id = quote_id and q.status = 'DRAFT'));
create policy bookings_staff_delete on public.bookings for delete to authenticated using (public.is_staff());

-- ---------- Finance : administrateurs ----------
create policy expcat_admin_all on public.expense_categories for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy exp_admin_all    on public.expenses for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- Notifications et journal ----------
create policy notif_own_select on public.notifications for select to authenticated using (user_id = auth.uid());
create policy notif_own_update on public.notifications for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy audit_super_select on public.audit_logs for select to authenticated using (public.is_super());
-- doc_counters : RLS activé, aucune politique (accès réservé aux fonctions).

-- ---------- Stockage ----------
insert into storage.buckets (id, name, public) values
  ('site-assets',   'site-assets',   true),
  ('gallery',       'gallery',       true),
  ('request-files', 'request-files', false),
  ('documents',     'documents',     false),
  ('agency-assets', 'agency-assets', false),   -- cachet : aucune politique, accès service_role uniquement
  ('avatars',       'avatars',       false)
on conflict (id) do nothing;

create policy storage_staff_read on storage.objects for select to authenticated
  using (bucket_id in ('request-files','documents','avatars') and public.is_staff());
create policy storage_staff_write_documents on storage.objects for insert to authenticated
  with check (bucket_id = 'documents' and public.is_staff());
create policy storage_admin_public_buckets on storage.objects for all to authenticated
  using (bucket_id in ('site-assets','gallery') and public.is_admin())
  with check (bucket_id in ('site-assets','gallery') and public.is_admin());
