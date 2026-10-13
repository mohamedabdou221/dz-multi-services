# Dz Multi-Services

Plateforme de services (devis et commandes) pour clients locaux et diaspora.

## Documentation

La documentation complète se trouve dans le dossier `docs/` :

- [PRD — Document d'exigences produit](docs/01-PRD.md)
- [TRD — Document d'exigences techniques](docs/02-TRD.md)
- [App Flow — Parcours de l'application](docs/03-app-flow.md)
- [Design Brief — Charte graphique](docs/04-design-brief.md)
- [Schéma de données](docs/05-schema-donnees.md)
- [Plan d'implémentation](docs/06-plan-implementation.md)

**Ordre de lecture conseillé** : PRD, App Flow, Design Brief, TRD, Schéma, Plan.

## Structure du projet

```
Saas diazos/
├── app/                     Application Next.js (App Router)
├── components/              Composants React
├── lib/                     Utilitaires et configurations
├── docs/                    Documentation complète
├── supabase/                Migrations et tests de la base de données
├── public/brand/            Éléments graphiques (logos, icônes, motifs, cachet)
├── assets/                  Fichiers de production (charte, photos, maquettes)
├── decision-notes/          Notes de décisions (Lot 0)
├── AGENTS.md                Consignes pour l'assistant de développement
└── README.md                Ce fichier
```

## Stack technique

- **Framework** : Next.js (App Router), TypeScript strict
- **Interface** : Tailwind CSS, shadcn/ui
- **Données** : Supabase (PostgreSQL, Auth, Storage)
- **Formulaires** : React Hook Form + Zod
- **PDF** : @react-pdf/renderer
- **Hébergement** : Netlify
- **Code** : GitHub

## Développement

### Installation des dépendances

```bash
npm install
```

### Démarrer le serveur de développement

```bash
npm run dev
```

### Lancer les tests

```bash
npm test
```

### Linter

```bash
npm run lint
```

## Plan d'implémentation

Le projet suit le plan d'implémentation détaillé dans `docs/06-plan-implementation.md`.

Pour travailler avec l'assistant de développement, référez-vous à `AGENTS.md`.

## Sécurité

- RLS activé sur toutes les tables
- Aucun secret dans le dépôt
- Double authentification pour les administrateurs
- Calculs financiers par la base uniquement

## Licence

Propriété de Dz Multi-Services.
