-- Script pour créer le premier super-administrateur
-- Exécuter ce script dans le dashboard Supabase : Database > SQL Editor

-- IMPORTANT: Remplacez les valeurs ci-dessous avec les vraies informations du super-admin

-- Variables à modifier
DO $$
DECLARE
  admin_email TEXT := 'msahazi269@gmail.com';  -- CHANGEZ CET EMAIL
  admin_password TEXT := '123Passer';              -- CHANGEZ CE MOT DE PASSE
  admin_first_name TEXT := 'Admin';                   -- CHANGEZ LE PRÉNOM
  admin_last_name TEXT := 'Principal';                -- CHANGEZ LE NOM
  admin_phone TEXT := '+221 77 668 35 43';               -- CHANGEZ LE TÉLÉPHONE
BEGIN
  -- Créer l'utilisateur dans auth.users
  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    raw_app_meta_data
  ) VALUES (
    gen_random_uuid(),
    admin_email,
    crypt(admin_password, gen_salt('bf')),
    now(),
    ('{"name": "' || admin_first_name || ' ' || admin_last_name || '"}')::jsonb,
    ('{"provider": "email", "role": "SUPER_ADMIN"}')::jsonb
  );

  -- Créer le profil dans public.profiles
  INSERT INTO public.profiles (
    id,
    first_name,
    last_name,
    email,
    phone,
    role,
    is_active
  ) VALUES (
    (SELECT id FROM auth.users WHERE email = admin_email),
    admin_first_name,
    admin_last_name,
    admin_email,
    admin_phone,
    'SUPER_ADMIN',
    true
  );

  RAISE NOTICE 'Super-administrateur créé avec succès. Email: %', admin_email;
  RAISE NOTICE 'IMPORTANT: Changez le mot de passe dès la première connexion !';
END $$;

-- Vérification
SELECT
  p.id,
  p.email,
  p.first_name,
  p.last_name,
  p.role,
  p.is_active,
  au.email_confirmed_at
FROM public.profiles p
JOIN auth.users au ON p.id = au.id
WHERE p.role = 'SUPER_ADMIN';
