# Tâches - Lot 1 (Fondation du projet)

## ✅ Tâches accomplies

- [x] Initialisation Git et création de la branche develop
- [x] Création du projet Next.js avec TypeScript et Tailwind CSS
- [x] Installation et configuration de shadcn/ui
- [x] Application du thème de la charte graphique (bordeaux, crème, noir)
- [x] Configuration des polices (Montserrat et Poppins)
- [x] Création des clients Supabase (browser, server, service)
- [x] Configuration des variables d'environnement (.env.local)
- [x] Création de la structure de dossiers (app, components, lib)
- [x] Création de la page d'accueil avec branding
- [x] Commit initial avec message structuré
- [x] Instructions pour appliquer les migrations Supabase
- [x] Migrations Supabase appliquées avec succès
- [x] Création du dépôt GitHub
- [x] Push des branches main et develop sur GitHub
- [x] Configuration Netlify
- [x] Déploiement Netlify réussi
- [x] Installation de @react-pdf/renderer
- [x] Création du test de génération PDF
- [x] API endpoint /api/test-pdf créée

## ⏳ Tâches en cours

### 1. Essai de génération PDF
**Objectif** : Vérifier que la génération PDF fonctionne, surtout sur Netlify (limites de durée des fonctions serverless)

**Tâches** :
- Installer @react-pdf/renderer
- Créer un test de génération PDF avec les polices Montserrat et Poppins
- Tester localement
- Tester sur Netlify pour vérifier la durée limite

## ⏳ Tâches restantes

### 2. Configuration Netlify
- Créer un compte Netlify
- Connecter le dépôt GitHub
- Configurer les variables d'environnement
- Activer le déploiement automatique

### 3. Essai de génération PDF
- Installer @react-pdf/renderer
- Créer un test de génération PDF avec les polices
- Tester sur Netlify pour vérifier la durée limite des fonctions

### 4. Commit et push vers GitHub
- Committer les changements
- Pusher la branche develop vers GitHub
- Créer une PR pour review

## 📋 Validation du Lot 1

Une fois toutes les tâches ci-dessus complétées, vérifier :
- [ ] Les migrations Supabase sont appliquées sans erreur
- [ ] Les tables et fonctions sont visibles dans le dashboard Supabase
- [ ] Le projet Netlify est configuré
- [ ] La génération PDF fonctionne sur Netlify
- [ ] Le code est commité et pushé sur GitHub

## 🚀 Prochaine étape

Une fois le Lot 1 validé, passer au **Lot 2 - Base de données et sécurité** :
- Appliquer les migrations sur le projet de développement
- Vérifier pgcrypto
- Activer pg_cron
- Régénérer les types TypeScript
- Porter les 50 vérifications en tests pgTAP
- Renseigner les réglages (coordonnées)
- Créer le premier super-administrateur
- Configurer les buckets

Voir `docs/06-plan-implementation.md` § 4 pour le détail.
