-- Script pour vérifier les extensions PostgreSQL activées
-- Exécuter ce script dans le dashboard Supabase : Database > SQL Editor

-- Vérifier si pgcrypto est activé
SELECT
    extname as extension_name,
    CASE
        WHEN extname = 'pgcrypto' THEN '✓ pgcrypto est activé (nécessaire pour le chiffrement)'
        WHEN extname = 'pg_cron' THEN '✓ pg_cron est activé (nécessaire pour les tâches planifiées)'
        ELSE '- Extension disponible mais non critique'
    END as status
FROM pg_extension
WHERE extname IN ('pgcrypto', 'pg_cron')
ORDER BY extname;

-- Si pg_cron n'est pas dans les résultats, l'activer avec :
-- CREATE EXTENSION IF NOT EXISTS pg_cron;
