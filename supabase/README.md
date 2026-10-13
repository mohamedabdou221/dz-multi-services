# Supabase Migrations

Ce dossier contient les migrations et tests de la base de données Supabase.

## Structure

- `migrations/` - Fichiers de migration SQL
- `tests/` - Tests de la base de données

## Migrations

Les migrations sont numérotées et doivent être appliquées dans l'ordre :

1. `0001_schema.sql` - Types, tables, contraintes, index
2. `0002_functions_triggers.sql` - Rôles, numérotation, déclencheurs, vues, fonctions RPC
3. `0003_security.sql` - RLS, droits, stockage
4. `0004_seed.sql` - Données de départ

**Règle importante** : Toute évolution du schéma passe par une **nouvelle migration** (0005, 0006, etc.). Ne jamais modifier une migration déjà appliquée.

## Application des migrations

```bash
# Sur un projet Supabase local
supabase db reset

# Sur un projet Supabase distant
supabase db push
```

## Tests

Les tests de la base de données doivent être écrits en pgTAP et placés dans `tests/`.

Un premier jeu de 50 vérifications a été réalisé sur un PostgreSQL local (voir `docs/05-schema-donnees.md` § 10). Ces tests doivent être portés en pgTAP dans ce dossier.

## Référence

Voir `docs/05-schema-donnees.md` pour la documentation complète du schéma.
