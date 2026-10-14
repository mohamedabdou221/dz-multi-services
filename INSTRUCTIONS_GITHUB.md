# Instructions pour créer le dépôt GitHub et pousser le code

## 1. Créer le dépôt sur GitHub

1. Allez sur [https://github.com/new](https://github.com/new)
2. Remplissez le formulaire :
   - **Repository name** : `dz-multi-services` (ou un autre nom de votre choix)
   - **Description** : Plateforme de services (devis et commandes) pour clients locaux et diaspora aux Comores
   - **Public/Private** : Private (recommandé pour un projet commercial)
3. **Ne cochez pas** "Initialize this repository with a README" (nous avons déjà un README)
4. Cliquez sur "Create repository"

## 2. Pousser le code vers GitHub

Exécutez ces commandes dans votre terminal (dans le dossier du projet) :

```bash
git remote add origin https://github.com/mohamedabdou221/dz-multi-services.git
git branch -M main
git push -u origin main
```

**Pour la branche develop :**

```bash
git push -u origin develop
```

## 3. Vérifier

1. Allez sur votre dépôt GitHub
2. Vous devriez voir tous les fichiers :
   - app/
   - components/
   - lib/
   - docs/
   - supabase/
   - assets/
   - public/
   - decision-notes/
   - README.md
   - etc.

## 4. Ensuite : Connecter Netlify

Une fois le code poussé sur GitHub :
1. Allez sur Netlify
2. Cliquez sur "Add new site" → "Import an existing project"
3. Le dépôt GitHub apparaîtra dans la liste
4. Sélectionnez-le et suivez les instructions de `INSTRUCTIONS_NETLIFY.md`
