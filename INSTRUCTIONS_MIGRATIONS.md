# Instructions pour appliquer les migrations Supabase

## 📍 Accès au projet

Allez sur : https://supabase.com/dashboard/project/sfpiifgzyzgdolldixum/sql

## 📋 Ordre d'application

Appliquez les migrations dans cet ordre précis :

1. **0001_schema.sql** - Schema (types, tables, contraintes)
2. **0002_functions_triggers.sql** - Functions & Triggers
3. **0003_security.sql** - Security (RLS, droits)
4. **0004_seed.sql** - Seed data (données de départ)

## 📝 Comment appliquer chaque migration

Pour chaque fichier :

1. Allez sur https://supabase.com/dashboard/project/sfpiifgzyzgdolldixum/sql
2. Cliquez sur "New Query"
3. Ouvrez le fichier de migration correspondant dans votre dossier `supabase/migrations/`
4. Copiez tout le contenu du fichier
5. Collez-le dans l'éditeur SQL
6. Cliquez sur "Run" (ou "Run query")
7. Attendez que l'exécution se termine (vérifiez qu'il n'y a pas d'erreurs)
8. Passez à la migration suivante

## ⚠️ Important

- **N'appliquez pas une migration si la précédente a échoué**
- Les migrations doivent être appliquées dans l'ordre exact
- Ne modifiez jamais une migration déjà appliquée
- Si une erreur survient, notez-la et arrêtez-vous

## ✅ Vérification

Une fois toutes les migrations appliquées, vous pouvez vérifier :

1. Allez dans **Database** → **Tables**
2. Vous devriez voir toutes les tables créées (profiles, services, requests, quotes, etc.)
3. Allez dans **Database** → **Functions**
4. Vous devriez voir les fonctions RPC (submit_request, accept_quote, etc.)

## 🆘 En cas d'erreur

Si une migration échoue :

1. Notez le message d'erreur exact
2. Vérifiez que la migration précédente a bien été appliquée
3. Assurez-vous que vous n'avez pas modifié le fichier de migration
4. Contactez-moi avec le message d'erreur

## 📄 Fichiers de migration

Les fichiers se trouvent dans le dossier `supabase/migrations/` :

- `0001_schema.sql` (21 KB)
- `0002_functions_triggers.sql` (30 KB)
- `0003_security.sql` (8.9 KB)
- `0004_seed.sql` (3.5 KB)
