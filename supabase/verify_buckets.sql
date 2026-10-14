-- Script pour vérifier que les buckets Storage sont créés
-- Exécuter ce script dans le dashboard Supabase : Database > SQL Editor

-- Vérifier les buckets créés
SELECT
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
ORDER BY id;

-- Note sur les buckets :
-- site-assets: public - pour les fichiers statiques du site (logos, icônes)
-- gallery: public - pour les images de la galerie
-- request-files: privé - pour les fichiers uploadés par les clients
-- documents: privé - pour les PDF générés (devis, reçus, fiches)
-- agency-assets: privé - pour le cachet de l'agence (accès service_role uniquement)
-- avatars: privé - pour les avatars des utilisateurs
