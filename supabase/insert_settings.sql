-- Script pour insérer les réglages de l'agence dans site_settings
-- Exécuter ce script dans le dashboard Supabase : Database > SQL Editor

-- Réglages publics (visibles sur le site)
INSERT INTO public.site_settings (key, value, is_public) VALUES
('agency_name', '"Dz Multi-Services"', true),
('agency_phone', '"+269 349 68 47"', true),
('agency_whatsapp', '"+269 446 75 90"', true),
('agency_email', '"dzmultiservices43@gmail.com"', true),
('agency_address', '"OUZIO-MITSAMIOULI, Comores"', true),
('agency_country', '"Comores"', true),
('agency_city', '"OUZIO-MITSAMIOULI"', true),

-- Réglages financiers (privés)
('default_currency', '"XOF"', false),
('deposit_percentage', '50', false),
('quote_validity_hours', '24', false),
('cancellation_fee_percentage', '10', false),

-- Réglages des modes de paiement (privés)
('payment_methods', '["cash", "ria", "mobile_money"]', false),
('diaspora_payment_methods', '["ria", "mobile_money", "western_union"]', false),

-- Réglages légaux (privés)
('tax_id', '""', false),
('tax_rate', '0', false),
('legal_status', '"SARL"', false),

-- Réglages système (privés)
('max_file_size_mb', '25', false),
('allowed_file_types', '["image/jpeg", "image/png", "application/pdf"]', false)
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  is_public = EXCLUDED.is_public,
  updated_at = now();
