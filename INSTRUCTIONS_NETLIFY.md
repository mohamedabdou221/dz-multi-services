# Instructions pour configurer Netlify

## 1. Créer un compte Netlify

1. Allez sur [https://app.netlify.com](https://app.netlify.com)
2. Cliquez sur "Sign up"
3. Inscrivez-vous avec GitHub (recommandé) ou avec e-mail
4. Vérifiez votre e-mail si nécessaire

## 2. Connecter le dépôt GitHub

1. Une fois connecté, cliquez sur "Add new site" → "Import an existing project"
2. Vous verrez la liste de vos dépôts GitHub
3. Si le dépôt n'apparaît pas, cliquez sur "Configure the Netlify app on GitHub"
4. Autorisez Netlify à accéder à votre compte GitHub
5. Le dépôt "Saas diazos" devrait apparaître
6. Cliquez sur le dépôt pour le sélectionner

## 3. Configurer les paramètres de build

Dans la section "Build settings" :

- **Build command** : `npm run build`
- **Publish directory** : `.` (à la racine du projet)
- **Branch to deploy** : `develop`

Cliquez sur "Deploy site"

## 4. Configurer les variables d'environnement

Une fois le site créé :

1. Allez dans **Site settings** → **Environment variables**
2. Cliquez sur "Add variable"
3. Ajoutez les variables suivantes (depuis votre fichier `.env.local`) :

```
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=votre-clé-publique
SUPABASE_SERVICE_ROLE_KEY=votre-clé-service-role
APP_URL=https://votre-site.netlify.app
```

**Note** : Pour `APP_URL`, utilisez l'URL de votre site Netlify une fois déployé.

## 5. Activer le déploiement automatique

Dans les paramètres du site :

1. Allez dans **Site settings** → **Build & deploy**
2. Sous "Continuous Deployment", assurez-vous que "Deploy on push" est activé
3. Sélectionnez la branche `develop` comme branche de production ou de préversion

## 6. Vérifier le déploiement

1. Netlify va automatiquement déployer votre site
2. Attendez que le déploiement soit terminé (quelques minutes)
3. Cliquez sur l'URL du site pour vérifier qu'il fonctionne
4. Vous devriez voir la page d'accueil avec "Dz Multi-Services"

## 7. Configurer les branches (optionnel)

Pour avoir des préversions par branche :

1. Allez dans **Site settings** → **Branches**
2. Ajoutez la branche `develop` comme branche principale
3. Vous pouvez créer des branches `feature/*` pour avoir des préversions séparées

## ✅ Vérification

Une fois configuré, vérifiez :
- [ ] Le site est accessible via l'URL Netlify
- [ ] Les variables d'environnement sont correctement configurées
- [ ] Le déploiement automatique fonctionne (push sur develop = nouveau déploiement)
