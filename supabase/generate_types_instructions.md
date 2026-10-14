# Instructions pour générer les types TypeScript

## Méthode 1 : Via le Dashboard Supabase (recommandée)

1. Allez sur [app.supabase.com](https://app.supabase.com)
2. Sélectionnez votre projet "dz-multi-services-dev"
3. Dans le menu de gauche, cliquez sur **Settings**
4. Cliquez sur **API**
5. Faites défiler jusqu'à la section **TypeScript**
6. Cliquez sur le bouton **Copy** pour copier les types générés
7. Créez le fichier `lib/supabase/types.ts` dans votre projet
8. Collez les types générés

## Méthode 2 : Via le CLI Supabase

Si vous avez le CLI Supabase installé :

```bash
# Générer les types depuis le schéma
supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/types.ts
```

## Après génération

Une fois les types générés, mettez à jour les fichiers d'importation dans :
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/supabase/service.ts`

Ajoutez l'import : `import { Database } from './types'`
