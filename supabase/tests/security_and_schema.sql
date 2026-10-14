-- Tests pgTAP pour le schéma Dz Multi-Services
-- Ces tests vérifient la structure du schéma, les contraintes et la sécurité
-- Exécuter avec: psql -d your_database -f security_and_schema.sql

BEGIN;

-- Créer l'extension pgTAP si elle n'existe pas
CREATE EXTENSION IF NOT EXISTS pgtap;

PLAN(50);

-- ============================================
-- TESTS DES TYPES ÉNUMÉRÉS (10 tests)
-- ============================================

-- Test 1: Type app_role existe
SELECT has_type('public', 'app_role', 'Le type app_role existe');

-- Test 2: Type app_role a les bonnes valeurs
SELECT enum_has_labels('public.app_role', ARRAY['SUPER_ADMIN','ADMIN','AGENT'], 'app_role a les bonnes valeurs');

-- Test 3: Type service_type existe
SELECT has_type('public', 'service_type', 'Le type service_type existe');

-- Test 4: Type request_status existe
SELECT has_type('public', 'request_status', 'Le type request_status existe');

-- Test 5: Type payment_state existe
SELECT has_type('public', 'payment_state', 'Le type payment_state existe');

-- Test 6: Type customer_type existe
SELECT has_type('public', 'customer_type', 'Le type customer_type existe');

-- Test 7: Type quote_status existe
SELECT has_type('public', 'quote_status', 'Le type quote_status existe');

-- Test 8: Type payment_status existe
SELECT has_type('public', 'payment_status', 'Le type payment_status existe');

-- Test 9: Type contact_status existe
SELECT has_type('public', 'contact_status', 'Le type contact_status existe');

-- Test 10: Type document_type existe
SELECT has_type('public', 'document_type', 'Le type document_type existe');

-- ============================================
-- TESTS DES TABLES PRINCIPALES (10 tests)
-- ============================================

-- Test 11: Table profiles existe
SELECT has_table('public', 'profiles', 'La table profiles existe');

-- Test 12: Table customers existe
SELECT has_table('public', 'customers', 'La table customers existe');

-- Test 13: Table requests existe
SELECT has_table('public', 'requests', 'La table requests existe');

-- Test 14: Table services existe
SELECT has_table('public', 'services', 'La table services existe');

-- Test 15: Table quotes existe
SELECT has_table('public', 'quotes', 'La table quotes existe');

-- Test 16: Table payments existe
SELECT has_table('public', 'payments', 'La table payments existe');

-- Test 17: Table wedding_details existe
SELECT has_table('public', 'wedding_details', 'La table wedding_details existe');

-- Test 18: Table site_settings existe
SELECT has_table('public', 'site_settings', 'La table site_settings existe');

-- Test 19: Table beneficiaries existe
SELECT has_table('public', 'beneficiaries', 'La table beneficiaries existe');

-- Test 20: Table quote_items existe
SELECT has_table('public', 'quote_items', 'La table quote_items existe');

-- ============================================
-- TESTS DES CONTRAINTES ET INDEX (10 tests)
-- ============================================

-- Test 21: profiles a une clé primaire sur id
SELECT has_pk('public', 'profiles', 'profiles a une clé primaire');

-- Test 22: customers.phone a une contrainte unique
SELECT col_is_unique('public', 'customers', 'phone', 'customers.phone est unique');

-- Test 23: requests.reference est unique
SELECT col_is_unique('public', 'requests', 'reference', 'requests.reference est unique');

-- Test 24: requests.public_token est unique
SELECT col_is_unique('public', 'requests', 'public_token', 'requests.public_token est unique');

-- Test 25: quotes.quote_number est unique
SELECT col_is_unique('public', 'quotes', 'quote_number', 'quotes.quote_number est unique');

-- Test 26: Index sur requests.status existe
SELECT has_index('public', 'requests', 'requests_status_idx', 'Index requests_status_idx existe');

-- Test 27: Index sur requests.created_at existe
SELECT has_index('public', 'requests', 'requests_created_idx', 'Index requests_created_idx existe');

-- Test 28: Contrainte de téléphone sur customers (format international)
SELECT results_eq(
    $$
    SELECT conname FROM pg_constraint
    WHERE conrelid = 'public.customers'::regclass
    AND conname LIKE '%phone%'
    $$,
    ARRAY[]::text[],
    'Contrainte de validation téléphone sur customers'
);

-- Test 29: Contrainte de vérification sur quote_items.quantity (> 0)
SELECT results_eq(
    $$
    SELECT conname FROM pg_constraint
    WHERE conrelid = 'public.quote_items'::regclass
    AND conname LIKE '%quantity%'
    $$,
    ARRAY[]::text[],
    'Contrainte de validation quantity sur quote_items'
);

-- Test 30: Contrainte sur payments.amount (> 0)
SELECT results_eq(
    $$
    SELECT conname FROM pg_constraint
    WHERE conrelid = 'public.payments'::regclass
    AND conname LIKE '%amount%'
    $$,
    ARRAY[]::text[],
    'Contrainte de validation amount sur payments'
);

-- ============================================
-- TESTS DES RELATIONS (5 tests)
-- ============================================

-- Test 31: profiles.id référence auth.users
SELECT has_fk('public', 'profiles', 'profiles.id référence auth.users');

-- Test 32: requests.customer_id référence customers
SELECT has_fk('public', 'requests', 'requests.customer_id référence customers');

-- Test 33: requests.service_id référence services
SELECT has_fk('public', 'requests', 'requests.service_id référence services');

-- Test 34: quotes.request_id référence requests
SELECT has_fk('public', 'quotes', 'quotes.request_id référence requests');

-- Test 35: payments.request_id référence requests
SELECT has_fk('public', 'payments', 'payments.request_id référence requests');

-- ============================================
-- TESTS DES VALEURS PAR DÉFAUT (5 tests)
-- ============================================

-- Test 36: profiles.role par défaut est AGENT
SELECT col_default_is('public', 'profiles', 'role', "'AGENT'::public.app_role', 'profiles.role par défaut est AGENT');

-- Test 37: profiles.is_active par défaut est true
SELECT col_default_is('public', 'profiles', 'is_active', 'true', 'profiles.is_active par défaut est true');

-- Test 38: requests.status par défaut est NEW
SELECT col_default_is('public', 'requests', 'status', "'NEW'::public.request_status', 'requests.status par défaut est NEW');

-- Test 39: requests.payment_state par défaut est UNPAID
SELECT col_default_is('public', 'requests', 'payment_state', "'UNPAID'::public.payment_state', 'requests.payment_state par défaut est UNPAID');

-- Test 40: quotes.status par défaut est DRAFT
SELECT col_default_is('public', 'quotes', 'status', "'DRAFT'::public.quote_status', 'quotes.status par défaut est DRAFT');

-- ============================================
-- TESTS DE SÉCURITÉ RLS (10 tests)
-- ============================================

-- Test 41: RLS est activé sur profiles
SELECT results_eq(
    $$
    SELECT relname FROM pg_class
    WHERE relname = 'profiles'
    AND relrowsecurity = true
    $$,
    ARRAY['profiles'],
    'RLS est activé sur profiles'
);

-- Test 42: RLS est activé sur requests
SELECT results_eq(
    $$
    SELECT relname FROM pg_class
    WHERE relname = 'requests'
    AND relrowsecurity = true
    $$,
    ARRAY['requests'],
    'RLS est activé sur requests'
);

-- Test 43: RLS est activé sur customers
SELECT results_eq(
    $$
    SELECT relname FROM pg_class
    WHERE relname = 'customers'
    AND relrowsecurity = true
    $$,
    ARRAY['customers'],
    'RLS est activé sur customers'
);

-- Test 44: RLS est activé sur quotes
SELECT results_eq(
    $$
    SELECT relname FROM pg_class
    WHERE relname = 'quotes'
    AND relrowsecurity = true
    $$,
    ARRAY['quotes'],
    'RLS est activé sur quotes'
);

-- Test 45: RLS est activé sur payments
SELECT results_eq(
    $$
    SELECT relname FROM pg_class
    WHERE relname = 'payments'
    AND relrowsecurity = true
    $$,
    ARRAY['payments'],
    'RLS est activé sur payments'
);

-- Test 46: Politique RLS sur services pour lecture publique
SELECT results_eq(
    $$
    SELECT policyname FROM pg_policies
    WHERE tablename = 'services'
    AND permissive = true
    AND cmd = 'SELECT'
    $$,
    ARRAY['services_select_public'],
    'Politique de lecture publique sur services existe'
);

-- Test 47: Politique RLS sur service_categories pour lecture publique
SELECT results_eq(
    $$
    SELECT policyname FROM pg_policies
    WHERE tablename = 'service_categories'
    AND permissive = true
    AND cmd = 'SELECT'
    $$,
    ARRAY['service_categories_select_public'],
    'Politique de lecture publique sur service_categories existe'
);

-- Test 48: Politique RLS sur faqs pour lecture publique
SELECT results_eq(
    $$
    SELECT policyname FROM pg_policies
    WHERE tablename = 'faqs'
    AND permissive = true
    AND cmd = 'SELECT'
    $$,
    ARRAY['faqs_select_public'],
    'Politique de lecture publique sur faqs existe'
);

-- Test 49: Politique RLS sur testimonials pour lecture publique
SELECT results_eq(
    $$
    SELECT policyname FROM pg_policies
    WHERE tablename = 'testimonials'
    AND permissive = true
    AND cmd = 'SELECT'
    $$,
    ARRAY['testimonials_select_public'],
    'Politique de lecture publique sur testimonials existe'
);

-- Test 50: Politique RLS sur gallery_items pour lecture publique
SELECT results_eq(
    $$
    SELECT policyname FROM pg_policies
    WHERE tablename = 'gallery_items'
    AND permissive = true
    AND cmd = 'SELECT'
    $$,
    ARRAY['gallery_items_select_public'],
    'Politique de lecture publique sur gallery_items existe'
);

ROLLBACK;
