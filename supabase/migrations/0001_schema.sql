-- 0001_schema.sql : types, tables, contraintes, index
-- Dz Multi-Services, schéma v1.0. Les migrations sont appliquées dans l'ordre 0001 -> 0004.

create extension if not exists pgcrypto with schema extensions;

-- ---------- Types ----------
create type public.app_role       as enum ('SUPER_ADMIN','ADMIN','AGENT');
create type public.service_type   as enum ('QUOTE','REQUEST');
create type public.request_type   as enum ('QUOTE','SERVICE_REQUEST');
create type public.request_status as enum ('NEW','IN_REVIEW','QUOTE_SENT','ACCEPTED','IN_PROGRESS','COMPLETED','REJECTED','CANCELLED','EXPIRED');
create type public.payment_state  as enum ('UNPAID','PARTIAL','PAID','REFUNDED');
create type public.request_source as enum ('SITE','WHATSAPP','PHONE','MANUAL');
create type public.customer_type  as enum ('LOCAL','DIASPORA');
create type public.quote_status   as enum ('DRAFT','SENT','VIEWED','ACCEPTED','REJECTED','EXPIRED','CANCELLED');
create type public.payment_status as enum ('PENDING','CONFIRMED','FAILED','CANCELLED','REFUNDED');
create type public.contact_status as enum ('NEW','READ','IN_PROGRESS','RESOLVED','ARCHIVED');
create type public.document_type  as enum ('QUOTE','SERVICE_SHEET','RECEIPT');

-- ---------- Accès ----------
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  first_name  text not null,
  last_name   text not null,
  phone       text,
  email       text,
  avatar_url  text,
  role        public.app_role not null default 'AGENT',
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------- Catalogue ----------
create table public.service_categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  icon        text,
  image_url   text,
  is_active   boolean not null default true,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.services (
  id                uuid primary key default gen_random_uuid(),
  category_id       uuid references public.service_categories(id) on delete set null,
  name              text not null,
  slug              text not null unique,
  short_description text,
  description       text,
  service_type      public.service_type not null,
  form_key          text not null default 'generic'
                    check (form_key in ('wedding','photo','advertising','printing','generic')),
  icon              text,
  image_url         text,
  is_active         boolean not null default true,
  is_featured       boolean not null default false,
  requires_schedule boolean not null default false,
  sort_order        int not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create table public.service_form_fields (
  id          uuid primary key default gen_random_uuid(),
  service_id  uuid not null references public.services(id) on delete cascade,
  field_key   text not null,
  label       text not null,
  field_type  text not null check (field_type in ('text','textarea','number','select','phone','date','file')),
  is_required boolean not null default false,
  options     jsonb,
  sort_order  int not null default 0,
  unique (service_id, field_key)
);

create table public.ceremony_types (
  id         uuid primary key default gen_random_uuid(),
  code       text not null unique,
  label      text not null,
  is_active  boolean not null default true,
  sort_order int not null default 0
);

-- ---------- Personnes ----------
create table public.customers (
  id            uuid primary key default gen_random_uuid(),
  first_name    text not null,
  last_name     text not null,
  email         text,
  phone         text not null check (phone ~ '^\+[1-9][0-9]{6,14}$'),
  whatsapp      text check (whatsapp ~ '^\+[1-9][0-9]{6,14}$'),
  country       text,
  city          text,
  region        text,
  address       text,
  customer_type public.customer_type not null default 'LOCAL',
  notes         text,
  consent_at    timestamptz,
  deleted_at    timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create unique index customers_phone_uq on public.customers(phone) where deleted_at is null;

create table public.beneficiaries (
  id           uuid primary key default gen_random_uuid(),
  customer_id  uuid not null references public.customers(id) on delete restrict,
  first_name   text not null,
  last_name    text not null,
  phone        text check (phone ~ '^\+[1-9][0-9]{6,14}$'),
  whatsapp     text check (whatsapp ~ '^\+[1-9][0-9]{6,14}$'),
  country      text,
  city         text,
  region       text,
  address      text,
  relationship text,
  notes        text,
  deleted_at   timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (id, customer_id)
);
create index beneficiaries_customer_idx on public.beneficiaries(customer_id);

-- ---------- Demandes ----------
create table public.requests (
  id                uuid primary key default gen_random_uuid(),
  reference         text not null unique,
  public_token      text not null unique default encode(extensions.gen_random_bytes(24), 'hex'),
  customer_id       uuid not null references public.customers(id) on delete restrict,
  beneficiary_id    uuid,
  service_id        uuid not null references public.services(id) on delete restrict,
  parent_request_id uuid references public.requests(id) on delete set null,
  request_type      public.request_type not null,
  status            public.request_status not null default 'NEW',
  payment_state     public.payment_state not null default 'UNPAID',
  source            public.request_source not null default 'SITE',
  assigned_to       uuid references public.profiles(id) on delete set null,
  preferred_date    date,
  preferred_time    time,
  description       text,
  internal_notes    text,
  currency          text not null default 'XOF' check (currency ~ '^[A-Z]{3}$'), -- à confirmer : XOF ou KMF
  cancelled_reason  text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint requests_beneficiary_fk foreign key (beneficiary_id, customer_id)
    references public.beneficiaries(id, customer_id),
  constraint requests_cancel_reason check (status <> 'CANCELLED' or cancelled_reason is not null)
);
create index requests_status_idx    on public.requests(status);
create index requests_created_idx   on public.requests(created_at desc);
create index requests_customer_idx  on public.requests(customer_id);
create index requests_service_idx   on public.requests(service_id);
create index requests_assigned_idx  on public.requests(assigned_to);

create table public.request_events (
  id                uuid primary key default gen_random_uuid(),
  request_id        uuid not null references public.requests(id) on delete cascade,
  event_type        text not null,
  from_status       public.request_status,
  to_status         public.request_status,
  message           text,
  visible_to_client boolean not null default false,
  created_by        uuid references public.profiles(id) on delete set null,
  created_at        timestamptz not null default now()
);
create index request_events_request_idx on public.request_events(request_id, created_at);

create table public.request_files (
  id          uuid primary key default gen_random_uuid(),
  request_id  uuid not null references public.requests(id) on delete cascade,
  file_name   text not null,
  file_path   text not null unique,
  mime_type   text,
  file_size   bigint check (file_size is null or file_size between 0 and 26214400),
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at  timestamptz not null default now()
);
create index request_files_request_idx on public.request_files(request_id);

-- ---------- Détails métier ----------
create table public.wedding_details (
  id               uuid primary key default gen_random_uuid(),
  request_id       uuid not null unique references public.requests(id) on delete cascade,
  requester_role   text check (requester_role in ('MARIE','MARIEE','PARENT','FAMILLE','PROCHE','ORGANISATEUR','AUTRE')),
  groom_name       text,
  bride_name       text,
  boina_harus_name text,
  bibi_harus_name  text,
  venue            text,
  city             text,
  region           text,
  start_date       date,
  end_date         date,
  additional_notes text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  check (end_date is null or start_date is null or end_date >= start_date)
);

create table public.wedding_events (
  id                uuid primary key default gen_random_uuid(),
  wedding_detail_id uuid not null references public.wedding_details(id) on delete cascade,
  ceremony_type_id  uuid references public.ceremony_types(id) on delete restrict,
  custom_label      text,
  event_date        date not null,
  start_time        time not null,
  end_time          time,
  ends_next_day     boolean not null default false,
  venue             text,
  city              text,
  notes             text,
  sort_order        int not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  check (ceremony_type_id is not null or nullif(btrim(custom_label), '') is not null)
);
create index wedding_events_detail_idx on public.wedding_events(wedding_detail_id, event_date);

create table public.photo_sessions (
  id                uuid primary key default gen_random_uuid(),
  request_id        uuid not null references public.requests(id) on delete cascade,
  wedding_detail_id uuid references public.wedding_details(id) on delete set null,
  session_type      text,
  session_date      date,
  start_time        time,
  end_time          time,
  location          text,
  participants_count int check (participants_count is null or participants_count > 0),
  photo_numbers     int[] not null default '{}'
                    check (photo_numbers <@ '{1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30}'::int[]),
  notes             text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index photo_sessions_request_idx on public.photo_sessions(request_id);

create table public.advertising_requests (
  id                    uuid primary key default gen_random_uuid(),
  request_id            uuid not null unique references public.requests(id) on delete cascade,
  company_name          text not null,
  activity              text,
  contact_person        text,
  campaign_objective    text,
  product_service       text,
  shooting_location     text,
  preferred_date        date,
  duration              text,
  distribution_channels text[] not null default '{}',
  has_script            boolean not null default false,
  needs_script          boolean not null default false,
  needs_actors          boolean not null default false,
  needs_voiceover       boolean not null default false,
  needs_music           boolean not null default false,
  other_needs           text,
  notes                 text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create table public.printing_requests (
  id            uuid primary key default gen_random_uuid(),
  request_id    uuid not null unique references public.requests(id) on delete cascade,
  document_type text not null,
  format        text,
  quantity      int check (quantity is null or quantity > 0),
  color_mode    text,
  duplex        boolean,
  paper_type    text,
  finishing     text,
  deadline      date,
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table public.service_request_details (
  id         uuid primary key default gen_random_uuid(),
  request_id uuid not null unique references public.requests(id) on delete cascade,
  details    jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- Commercial et finance ----------
create table public.quotes (
  id               uuid primary key default gen_random_uuid(),
  request_id       uuid not null references public.requests(id) on delete restrict,
  quote_number     text not null unique,
  version          int not null default 1,
  parent_quote_id  uuid references public.quotes(id) on delete set null,
  status           public.quote_status not null default 'DRAFT',
  subtotal         numeric(14,2) not null default 0 check (subtotal >= 0),
  discount         numeric(14,2) not null default 0 check (discount >= 0),
  tax              numeric(14,2) not null default 0 check (tax >= 0),
  total            numeric(14,2) not null default 0 check (total >= 0),
  deposit_amount   numeric(14,2) check (deposit_amount is null or deposit_amount >= 0),
  currency         text not null default 'XOF' check (currency ~ '^[A-Z]{3}$'),
  valid_until      date,
  terms            text,
  notes            text,
  public_token     text not null unique default encode(extensions.gen_random_bytes(24), 'hex'),
  sent_at          timestamptz,
  viewed_at        timestamptz,
  accepted_at      timestamptz,
  accepted_by_name text,
  created_by       uuid references public.profiles(id) on delete set null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (request_id, version)
);
create unique index quotes_one_accepted_uq on public.quotes(request_id) where status = 'ACCEPTED';
create index quotes_status_idx on public.quotes(status, valid_until);

create table public.quote_items (
  id              uuid primary key default gen_random_uuid(),
  quote_id        uuid not null references public.quotes(id) on delete cascade,
  description     text not null,
  quantity        numeric(10,2) not null default 1 check (quantity > 0),
  unit_price      numeric(14,2) not null check (unit_price >= 0),
  total           numeric(14,2) generated always as (round(quantity * unit_price, 2)) stored,
  is_pass_through boolean not null default false,
  sort_order      int not null default 0
);
create index quote_items_quote_idx on public.quote_items(quote_id, sort_order);

create table public.payments (
  id              uuid primary key default gen_random_uuid(),
  request_id      uuid not null references public.requests(id) on delete restrict,
  quote_id        uuid references public.quotes(id) on delete restrict,
  customer_id     uuid not null references public.customers(id) on delete restrict,
  amount          numeric(14,2) not null check (amount > 0),
  currency        text not null default 'XOF' check (currency ~ '^[A-Z]{3}$'),
  payment_method  text not null check (btrim(payment_method) <> ''),
  reference       text,
  status          public.payment_status not null default 'PENDING',
  paid_at         timestamptz,
  proof_file_path text,
  confirmed_by    uuid references public.profiles(id) on delete set null,
  confirmed_at    timestamptz,
  notes           text,
  created_by      uuid references public.profiles(id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  check (status <> 'CONFIRMED' or paid_at is not null)
);
create index payments_request_idx on public.payments(request_id);
create index payments_status_idx  on public.payments(status, paid_at);

create table public.expense_categories (
  id        uuid primary key default gen_random_uuid(),
  name      text not null unique,
  is_active boolean not null default true
);

create table public.expenses (
  id             uuid primary key default gen_random_uuid(),
  request_id     uuid references public.requests(id) on delete set null,
  category_id    uuid not null references public.expense_categories(id) on delete restrict,
  description    text not null,
  supplier       text,
  amount         numeric(14,2) not null check (amount > 0),
  currency       text not null default 'XOF' check (currency ~ '^[A-Z]{3}$'),
  expense_date   date not null default current_date,
  payment_method text,
  receipt_path   text,
  created_by     uuid references public.profiles(id) on delete set null,
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index expenses_date_idx on public.expenses(expense_date);

create table public.bookings ( -- V2 : calendrier
  id          uuid primary key default gen_random_uuid(),
  request_id  uuid not null references public.requests(id) on delete cascade,
  label       text not null,
  starts_on   date not null,
  start_time  time,
  ends_on     date not null,
  end_time    time,
  venue       text,
  assigned_to uuid references public.profiles(id) on delete set null,
  status      text not null default 'PLANNED' check (status in ('PLANNED','DONE','CANCELLED')),
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  check (ends_on >= starts_on)
);
create index bookings_dates_idx on public.bookings(starts_on, ends_on);

create table public.generated_documents (
  id              uuid primary key default gen_random_uuid(),
  request_id      uuid not null references public.requests(id) on delete restrict,
  quote_id        uuid references public.quotes(id) on delete restrict,
  document_type   public.document_type not null,
  document_number text not null,
  revision        int not null default 1,
  file_path       text not null unique,
  is_stamped      boolean not null default false,
  generated_by    uuid references public.profiles(id) on delete set null,
  created_at      timestamptz not null default now(),
  unique (document_number, revision)
);

-- ---------- Contenus ----------
create table public.gallery_items (
  id           uuid primary key default gen_random_uuid(),
  category     text not null check (category in ('MARIAGE','PHOTO','PUBLICITE','IMPRIMERIE','EVENEMENT','AUTRE')),
  title        text,
  image_path   text not null,
  sort_order   int not null default 0,
  is_published boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table public.testimonials (
  id             uuid primary key default gen_random_uuid(),
  author_name    text not null,
  author_context text,
  content        text not null,
  is_published   boolean not null default false,
  sort_order     int not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table public.faqs (
  id           uuid primary key default gen_random_uuid(),
  service_id   uuid references public.services(id) on delete cascade,
  question     text not null,
  answer       text not null,
  sort_order   int not null default 0,
  is_published boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table public.site_settings (
  id         uuid primary key default gen_random_uuid(),
  key        text not null unique,
  value      jsonb not null,
  is_public  boolean not null default false,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  phone      text,
  email      text,
  subject    text,
  message    text not null,
  status     public.contact_status not null default 'NEW',
  handled_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index contact_messages_status_idx on public.contact_messages(status, created_at desc);

-- ---------- Système ----------
create table public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  request_id uuid references public.requests(id) on delete cascade,
  title      text not null,
  message    text,
  type       text not null,
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);
create index notifications_user_idx on public.notifications(user_id, is_read, created_at desc);

create table public.audit_logs (
  id          bigint generated always as identity primary key,
  user_id     uuid,
  action      text not null,
  entity_type text not null,
  entity_id   text,
  old_data    jsonb,
  new_data    jsonb,
  ip_address  text,
  created_at  timestamptz not null default now()
);
create index audit_logs_entity_idx on public.audit_logs(entity_type, entity_id, created_at desc);

create table public.doc_counters (
  doc_type   text not null,
  year       int  not null,
  last_value int  not null default 0,
  primary key (doc_type, year)
);
