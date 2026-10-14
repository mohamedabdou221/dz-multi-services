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
- [x] Correction TypeScript pour la génération PDF (toBlob au lieu de toBuffer)
- [x] Build réussi avec génération PDF en ~90ms
- [x] Déploiement Netlify avec endpoint PDF fonctionnel

## ⏳ Tâches en cours

### Lot 2 - Base de données et sécurité
**Objectif** : Appliquer les migrations sur le projet de développement, configurer la sécurité et créer le super-administrateur

**Tâches** :
- Appliquer les migrations 0001 à 0004 sur le projet de développement Supabase
- Vérifier pgcrypto
- Activer pg_cron
- Régénérer les types TypeScript
- Porter les 50 vérifications en tests pgTAP
- Renseigner les réglages (coordonnées)
- Créer le premier super-administrateur
- Configurer les buckets

## ⏳ Tâches restantes

### Lot 3 - Authentification et rôles
- @supabase/ssr (clients navigateur, serveur, service)
- Page de connexion
- Déconnexion
- Session persistante
- Garde des routes /admin
- Lecture du rôle
- Double authentification pour ADMIN et SUPER_ADMIN
- Gestion des utilisateurs par le super-administrateur

### Lot 4 - Site public et catalogue
- En-tête et pied de page (coordonnées lues des réglages)
- Accueil (bandeau, section diaspora)
- Liste et pages de service alimentées par la base
- Comment ça marche
- À propos
- FAQ
- Contact (affichage)
- Pages légales
- Bouton WhatsApp
- Métadonnées
- Plan du site
- Revalidation à la demande

## 📋 Validation du Lot 1

Une fois toutes les tâches ci-dessus complétées, vérifier :
- [x] Les migrations Supabase sont appliquées sans erreur
- [x] Les tables et fonctions sont visibles dans le dashboard Supabase
- [x] Le projet Netlify est configuré
- [x] La génération PDF fonctionne sur Netlify
- [x] Le code est commité et pushé sur GitHub

## ✅ Lot 1 Terminé

Le Lot 1 (Fondation du projet) est maintenant terminé et validé.

## 🚀 Prochaine étape : Lot 2 - Base de données et sécurité

Passer au **Lot 2 - Base de données et sécurité** :
- Appliquer les migrations sur le projet de développement
- Vérifier pgcrypto
- Activer pg_cron
- Régénérer les types TypeScript
- Porter les 50 vérifications en tests pgTAP
- Renseigner les réglages (coordonnées)
- Créer le premier super-administrateur
- Configurer les buckets

Voir `docs/06-plan-implementation.md` § 4 pour le détail.
