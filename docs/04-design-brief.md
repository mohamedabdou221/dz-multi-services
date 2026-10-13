# Design Brief

**Dz Multi-Services** · Version 1.0 · 8 octobre 2026
Source : charte graphique « dz Multi-Services » (12 pages, dossier `charte-graphique/`). Liens : [PRD](01-PRD.md) · [App Flow](03-app-flow.md) · [TRD](02-TRD.md)

Les valeurs de la charte sont reprises telles quelles. Ce qui est **ajouté** pour l'application est signalé « ajout » et reste à valider.

---

## 1. Marque

| Élément | Valeur |
|---|---|
| Nom | Dz Multi-Services (dans un texte) ; le logo vient toujours d'un fichier |
| Signature | « Plus qu'un service, une solution. » |
| Accroche | « Des services pour aujourd'hui, des solutions pour demain. » |
| Réseaux | @dzmultiservices (Instagram, TikTok, Facebook, LinkedIn, YouTube) |
| Personnalité | Sérieuse, chaleureuse, proche des familles, fiable. Moderne sans être froide |

## 2. Objectifs de design

1. **Rassurer** : un client à l'étranger confie une commande pour un proche ; l'interface doit inspirer confiance (cachet, références, statuts clairs).
2. **Simplifier** : un formulaire long (mariage) doit rester facile sur téléphone.
3. **Montrer** : photos et vidéos des réalisations mises en valeur, sans prix affichés.
4. **Être lisible partout** : contrastes élevés, texte généreux, connexion lente.

## 3. Principes d'interface

- Mobile d'abord ; une idée par écran dans les formulaires.
- Un seul bouton principal par écran.
- Vocabulaire du client, pas de jargon ; aucun mot anglais dans l'interface.
- Un statut n'est jamais indiqué par la seule couleur : libellé, icône, couleur.
- Peu d'effets : la charte interdit ombres et contours sur le logo ; on reste sobre partout.

## 4. Logo

| Variante | Emploi |
|---|---|
| Couleur (fond clair) | En-tête du site, PDF, e-mails |
| Inversée (fond foncé) | Bandeau d'accueil, pied de page, barre latérale de l'administration, image de partage |
| Monochrome (noir) | Impression en noir et blanc, reçus |
| Grise (fond clair) | Usages discrets, filigrane |
| Monogramme « dz » seul | Favicon, icône d'application, avatar |

Règles de la charte : respecter proportions et espace de protection, choisir la version selon le fond, préserver lisibilité et netteté, ne pas déformer, recolorer, ajouter d'effets, utiliser sur fond peu lisible, ni modifier l'espacement ou la typographie. Espace de protection de travail : au moins la hauteur du « d » du monogramme (**ajout**). Hauteur minimale en en-tête mobile : 32 px (**ajout**).

## 5. Couleurs

| Nom | Valeur | Emploi |
|---|---|---|
| Bordeaux | `#8C0028` | Logotype, titres, boutons principaux, liens, icônes principales, élément actif |
| Noir | `#101010` | Texte, fonds sombres, éléments principaux |
| Crème | `#F5F3EC` | Fond de page, espaces, texte sur fonds sombres et sur bordeaux |
| Gris foncé | `#2B2B2B` | Textes secondaires, icônes, bordures |
| Rouge de la variante inversée | `#BD023B` (mesuré sur la charte) | Logo inversé et icônes sur fond sombre |
| Blanc (ajout) | `#FFFFFF` | Champs, cartes et tableaux posés sur la crème |
| Vert (ajout) | `#2F6B3F` | Succès uniquement |
| Ambre (ajout) | `#8A5200` | Avertissement uniquement |

**Contrastes (méthode WCAG, seuil 4,5:1 pour le texte courant)**

| Texte | Fond | Rapport | Emploi |
|---|---|---|---|
| Noir | Crème | 17,1:1 | Texte courant |
| Gris foncé | Crème | 12,7:1 | Texte secondaire |
| Bordeaux | Crème | 8,8:1 | Titres, liens |
| Crème | Bordeaux | 8,8:1 | Texte des boutons principaux |
| Crème | Noir | 17,1:1 | Texte sur fonds sombres |
| Bordeaux | Noir | 1,9:1 | **Interdit pour du texte** |

Les rapports sont calculés ; à recontrôler avec un outil pendant la recette.

## 6. Typographie

| Police | Emploi | Graisses |
|---|---|---|
| **Montserrat** | Titres et sous-titres, étiquettes de section | Semi-gras 600, gras 700, extra-gras 800 |
| **Poppins** | Textes et éléments d'interface | Régulier 400, moyen 500, semi-gras 600 |

Polices hébergées avec le site (sous-ensemble latin avec accents). Repli : `system-ui, sans-serif`.

| Niveau | Mobile | Bureau | Police |
|---|---|---|---|
| Titre d'accueil | 32 / 40 | 56 / 64 | Montserrat 700 |
| Titre 1 | 28 / 36 | 40 / 48 | Montserrat 700 |
| Titre 2 | 22 / 30 | 30 / 38 | Montserrat 600 |
| Titre 3 | 18 / 26 | 22 / 30 | Montserrat 600 |
| Texte | 16 / 26 | 17 / 28 | Poppins 400 |
| Texte secondaire | 14 / 22 | 15 / 24 | Poppins 400 |
| Étiquette | 12 / 16, majuscules, espacement 0,14 em | idem | Montserrat 600 |

Champs de formulaire à **16 px au minimum** (évite le zoom automatique des téléphones).

## 7. Grille, espacements, formes

- Unité de base : 4 px ; échelle 4, 8, 12, 16, 24, 32, 48, 64, 96.
- Conteneur : 1200 px au maximum ; marges 16 px (mobile), 32 px (tablette), 48 px (bureau).
- Points de rupture : 360, 768, 1024, 1280.
- Formes : carrés arrondis de la charte. Rayon de travail (**ajout**) : 12 px pour boutons et champs, 16 à 24 px pour cartes.
- Bordures : 1 px, `#E2DDD0` sur crème ; peu d'ombres, jamais sur le logo.

## 8. Iconographie

Pictogrammes linéaires de la charte : trait fin et régulier, angles arrondis, une seule couleur (bordeaux sur fond clair, crème ou rouge inversé sur fond foncé). Fichiers PNG fournis en quatre couleurs ; à vectoriser en SVG (viewBox 24×24, trait en `currentColor`) avant la production.

| Usage | Icône |
|---|---|
| Filmage de mariage | `filmage` |
| Séance photo | `photo` |
| Spot publicitaire | `spot` |
| Imprimerie | `imprimerie` |
| Transfert d'argent international | `transfert` |
| Réabonnement Canal+ | `tv` |
| Recharge d'électricité | `electricite` |
| Crédit HURI / YAS | `telephone` |
| Dépôt et retrait Holo | `depot-retrait` |
| Commander pour un proche | `proche` |
| Diaspora | `diaspora` |
| Devis | `devis` |
| Suivi de demande | `suivi` |
| Paiement | `paiement` |

L'icône « Séance photo » de la charte ressemble à un engrenage : à redessiner en appareil photo si la confusion avec « Services » se confirme. Les actions courantes de l'interface (menu, fermer, flèches, coche) utilisent un jeu d'icônes linéaires standard au même trait.

## 9. Fonds et motifs

| Élément | Emploi | Format |
|---|---|---|
| Fond d'accueil (bannière) | Bandeau d'accueil, pages de service | 1920 × 800 px, WebP ou AVIF |
| Image réseaux sociaux | Partage, Open Graph | 1200 × 630 px, avec espace central pour le logo |
| Séparateur de sections | Transition entre sections | 1920 × 120 px |
| Texture de fond (tuile) | Pied de page, fonds sombres | 800 × 800 px, répétable sans couture |
| Carrés arrondis | Conteneurs d'icônes | CSS |

Texte toujours en crème sur ces fonds. Le motif ne doit jamais gêner la lecture.

## 10. Composants

| Composant | Spécification |
|---|---|
| **Bouton principal** | Fond bordeaux, texte crème, Poppins 600, hauteur 48 px, rayon 12 px ; survol : bordeaux assombri ; désactivé : opacité réduite avec libellé conservé |
| **Bouton secondaire** | Contour noir ou gris foncé, texte noir |
| **Bouton texte** | Texte bordeaux souligné au survol |
| **Champ** | Fond blanc, bordure 1 px, hauteur 48 px, étiquette au-dessus, aide en dessous, erreur en bordeaux avec icône et texte |
| **Sélecteur d'indicatif et téléphone** | Champ unique avec indicatif du pays |
| **Cases et boutons radio** | Zone tactile ≥ 44 px, libellé cliquable |
| **Sélecteur de numéros 1 à 30** | Grille de pastilles (6 par ligne sur mobile), sélection multiple, état sélectionné en bordeaux avec coche |
| **Planning du mariage** | Une carte par ligne : prestation, date (jour de la semaine affiché), début, fin, case « finit le lendemain », bouton supprimer ; bouton « Ajouter une journée » |
| **Zone de fichiers** | Cadre en pointillés, types et taille indiqués, liste des fichiers avec suppression |
| **Indicateur d'étapes** | Barre de progression et « Étape 3 sur 9 » |
| **Carte de service** | Fond blanc, icône dans un carré arrondi bordeaux, titre Montserrat, description courte, bouton |
| **Pastille de statut** | Libellé + icône + couleur (voir § 11) |
| **Tableau d'administration** | Fond blanc, filets gris, en-tête gris clair, ligne cliquable, tri, pagination |
| **Barre latérale** | Fond noir, logo inversé, texte crème, élément actif en bordeaux |
| **Fenêtre de confirmation** | Titre, conséquence expliquée, deux boutons ; obligatoire pour annuler, confirmer un paiement, envoyer un devis |
| **Messages** | Succès (vert), avertissement (ambre), erreur (bordeaux) avec icône et texte |
| **États vides** | Illustration légère, phrase utile, action |
| **Chargement** | Squelettes plutôt que cercles tournants |

## 11. Statuts

| Style | Statuts |
|---|---|
| Gris foncé, en contour | Demande reçue, En traitement |
| Bordeaux | Devis envoyé, Acceptée, En cours |
| Vert | Terminée, paiement confirmé |
| Gris, icône barrée | Refusée, Annulée, Expirée |
| Ambre | Devis proche de l'échéance, paiement en attente |

## 12. Écrans clés (schémas)

### 12.1 Accueil, mobile

```text
┌────────────────────────────┐
│ [logo]                  ☰  │  fond crème
├────────────────────────────┤
│▓▓▓▓▓ fond d'accueil ▓▓▓▓▓▓▓│  fond sombre, motif
│  Vos besoins sur place,    │
│  même quand vous êtes loin.│
│  Dz Multi-Services vous    │
│  accompagne...             │
│  [Découvrir nos services]  │
│  [Commander pour un proche]│
├────────────────────────────┤
│  Même loin, restez présent │  section diaspora
│  pour les vôtres.          │
│  ① Commande ② Dz ③ Local ④ │
├────────────────────────────┤
│  Nos services              │
│  [◻ icône] Filmage      →  │
│  [◻ icône] Séance photo →  │
│  ...                       │
├────────────────────────────┤
│  pied de page sombre       │
│  téléphones · e-mail · ◎   │
└────────────────────────────┘
        (●) WhatsApp
```

### 12.2 Formulaire de mariage, étape « Programme »

```text
┌────────────────────────────┐
│ ← Retour     Étape 6 sur 9 │
│ ▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░        │
│ Programme de la prestation │
│ ┌────────────────────────┐ │
│ │ Pao                    │ │
│ │ Date  [ 20/11/2026 ]   │ │
│ │ Vendredi               │ │
│ │ Début [18:00] Fin [23:00]│
│ │ ☐ Finit le lendemain   │ │
│ │                  🗑     │ │
│ └────────────────────────┘ │
│ ┌────────────────────────┐ │
│ │ Grand Mariage ...      │ │
│ └────────────────────────┘ │
│ [ + Ajouter une journée ]  │
│ [        Suivant         ] │
└────────────────────────────┘
```

### 12.3 Fiche demande, bureau

```text
┌───────────┬──────────────────────────────────────────────┐
│ [logo]    │ DZ-2026-000125   Filmage de mariage          │
│ Tableau   │ [Devis envoyé]  Règlement : Partiel          │
│ Demandes ◀│ Agent : …   [Changer le statut ▾] [Actions ▾]│
│ Devis     ├──────────────────────────────────────────────┤
│ Paiements │ Client | Bénéficiaire | Prestation | Programme│
│ Clients   │ Fichiers | Devis | Paiements | Notes | Histo. │
│ Services  │ ────────────────────────────────────────────│
│ Messages  │  contenu de l'onglet                         │
│ Réglages  │                                              │
└───────────┴──────────────────────────────────────────────┘
```

### 12.4 Devis PDF (A4)

```text
┌──────────────────────────────────────────┐
│ [logo]            Dz Multi-Services      │
│                   tél · e-mail · adresse │
│ ──────────────────────────────────────── │
│ DEVIS DV-2026-00025            Date : …  │
│ Client : …    Prestation : …             │
│ ┌──────────────────────┬──────┬────────┐ │
│ │ Description (en-tête bordeaux, crème)│ │
│ │ Captation vidéo      │  1   │  XXX   │ │
│ │ ...                                   │ │
│ └──────────────────────┴──────┴────────┘ │
│                         TOTAL    XXX     │
│ Validité : 15 jours  Conditions : …      │
│ Bon pour accord (client)      [CACHET]   │
│ ──────────────────────────────────────── │
│ Plus qu'un service, une solution.        │
└──────────────────────────────────────────┘
```

La **fiche de prestation de mariage** reprend la mise en page de la fiche papier : client, mariés, Boina Harus, Bibi Harus, lieu, dates, prestations cochées, programme, séance photo (numéros), signatures client et agence, cachet.

## 13. Ton rédactionnel

- Vouvoiement, phrases courtes, mots simples, ton chaleureux et précis.
- Pas de promesse chiffrée ni de prix.
- Les erreurs expliquent quoi faire : « Le numéro de téléphone doit commencer par l'indicatif du pays, par exemple +221. »

| Situation | Texte type |
|---|---|
| Envoi réussi | « Votre demande a bien été enregistrée. Votre référence est DZ-2026-000125. » |
| Devis disponible | « Votre devis est prêt. Vous pouvez le consulter, l'accepter ou demander une modification. » |
| Devis expiré | « Ce devis n'est plus valable. Contactez-nous pour en recevoir un nouveau. » |
| Lien invalide | « Ce lien est invalide ou a expiré. » |
| Champ obligatoire | « Ce champ est obligatoire. » |
| Confirmation d'un paiement | « Confirmer ce paiement de … ? Cette action ne pourra plus être modifiée. » |

## 14. Images et médias

- Photos réelles des prestations (mariages, imprimerie, tournages), sobres, bien cadrées, ratios constants.
- Texte alternatif pour chaque image ; vidéos en lien plutôt qu'en fichier lourd.
- Les images de la charte (cartes de visite, casquette, vêtements, enseigne, téléphones) sont des **illustrations de référence** : à régénérer en haute définition pour un usage public.

## 15. Accessibilité

Contrastes du § 5, navigation au clavier complète, anneau de focus visible (noir ou crème selon le fond), libellés associés aux champs, messages d'erreur annoncés, zones tactiles ≥ 44 px, pas d'animation indispensable, respect de la préférence « réduire les animations ».

## 16. Jetons de design (extrait)

```css
:root {
  --bordeaux: #8C0028;
  --noir:     #101010;
  --creme:    #F5F3EC;
  --gris:     #2B2B2B;
  --rouge-inverse: #BD023B;
  --blanc:    #FFFFFF;   /* ajout */
  --succes:   #2F6B3F;   /* ajout */
  --alerte:   #8A5200;   /* ajout */

  --background: var(--creme);
  --foreground: var(--noir);
  --primary: var(--bordeaux);
  --primary-foreground: var(--creme);
  --muted-foreground: var(--gris);
  --card: var(--blanc);
  --border: #E2DDD0;
  --radius: 12px;

  --font-titre: Montserrat, system-ui, sans-serif;
  --font-texte: Poppins, system-ui, sans-serif;
}
```

À convertir dans le format attendu par la version de shadcn/ui utilisée.

## 17. Livrables de design

| Livrable | État |
|---|---|
| Charte graphique en 12 pages | Fait |
| Logos en PNG (quatre couleurs), monogramme, icônes, motifs, signature | Fait (archive d'éléments) |
| Logos et icônes en SVG | **À faire** (vectorisation ou designer) |
| Maquettes de l'accueil, du formulaire de mariage, de la fiche demande, du devis | À faire (à partir des schémas du § 12) |
| Photos des prestations | À fournir par l'agence |
| Modèles PDF (devis, fiche de prestation, reçu) | À faire au lot 8 |
