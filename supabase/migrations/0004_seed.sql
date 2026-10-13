-- 0004_seed.sql : données de départ (modifiables ensuite depuis l'administration)

insert into public.ceremony_types(code, label, sort_order) values
  ('GRAND_MARIAGE','Grand Mariage',1), ('KARAM','Karam',2), ('MDHWAHIRISHO','Mdhwahirisho',3),
  ('PAO','Pao',4), ('MAMBIZO','Mambizo',5);

insert into public.service_categories(name, slug, description, sort_order) values
  ('Prestations', 'prestations', 'Prestations réalisées sur devis', 1),
  ('Services à la demande', 'services-a-la-demande', 'Services traités sur demande, montant communiqué par l''agence', 2);

insert into public.services(category_id, name, slug, short_description, service_type, form_key, icon, requires_schedule, sort_order)
select c.id, v.name, v.slug, v.short_description, v.service_type::public.service_type, v.form_key, v.icon, v.requires_schedule, v.sort_order
from (values
  ('prestations','Filmage de mariage','filmage-mariage','Captation de votre mariage, du Pao au Grand Mariage.','QUOTE','wedding','filmage',true,1),
  ('prestations','Séance photo','seance-photo','Séance photo en studio ou en extérieur.','QUOTE','photo','photo',true,2),
  ('prestations','Spot publicitaire','spot-publicitaire','Un spot pour faire connaître votre activité.','QUOTE','advertising','spot',true,3),
  ('prestations','Imprimerie','imprimerie','Impression de vos documents et supports.','QUOTE','printing','imprimerie',false,4),
  ('services-a-la-demande','Transfert d''argent international','transfert-argent-international','Envoyez de l''argent à vos proches.','REQUEST','generic','transfert',false,5),
  ('services-a-la-demande','Réabonnement Canal+','reabonnement-canal-plus','Réabonnez un abonné Canal+.','REQUEST','generic','tv',false,6),
  ('services-a-la-demande','Recharge d''électricité (compteur STS)','recharge-electricite-sts','Rechargez un compteur prépayé.','REQUEST','generic','electricite',false,7),
  ('services-a-la-demande','Crédit HURI / YAS','credit-huri-yas','Crédit téléphonique pour vos proches.','REQUEST','generic','telephone',false,8),
  ('services-a-la-demande','Dépôt et retrait via Holo','depot-retrait-holo','Dépôt et retrait sur Holo.','REQUEST','generic','depot-retrait',false,9)
) as v(cat, name, slug, short_description, service_type, form_key, icon, requires_schedule, sort_order)
join public.service_categories c on c.slug = v.cat;

insert into public.expense_categories(name) values
  ('Transport'),('Matériel'),('Impression'),('Communication'),('Internet'),('Salaires'),('Location'),('Maintenance'),('Autres');

insert into public.site_settings(key, value, is_public) values
  ('business_name',   '"Dz Multi-Services"', true),
  ('slogan',          '"Plus qu''un service, une solution."', true),
  ('agency_phones',   '[]', true),
  ('agency_email',    '""', true),
  ('agency_address',  '""', true),
  ('whatsapp',        '""', true),
  ('social_links',    '{"instagram":"","tiktok":"","facebook":"","linkedin":"","youtube":""}', true),
  ('opening_hours',   '""', true),
  ('payment_methods', '["Espèces","Wave","Orange Money","Holo","Virement","Autre"]', false),
  ('quote_validity_days', '15', false),
  ('deposit_rate_percent', '30', false),
  ('upload_max_mb',   '25', false),
  ('agency_stamp_path', '""', false);   -- chemin du cachet dans le bucket agency-assets (jamais public)

-- Tâche planifiée (à activer avec pg_cron, chaque nuit) :
--   select cron.schedule('expire-quotes', '5 0 * * *', $$select public.expire_quotes()$$);
