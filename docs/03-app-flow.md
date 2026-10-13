# App Flow — Parcours de l'application

**Dz Multi-Services** · Version 1.0 · 8 octobre 2026
Liens : [PRD](01-PRD.md) · [TRD](02-TRD.md) · [Design Brief](04-design-brief.md)

Ce document décrit ce que l'utilisateur voit et fait, écran par écran, et comment une demande avance. Les libellés sont ceux de l'interface.

---

## 1. Plan de l'application

```mermaid
flowchart TD
  A["Site public"] --> A1["Accueil"]
  A --> A2["Services"]
  A2 --> A3["Page d'un service"]
  A3 --> F["Formulaire de demande"]
  F --> C["Confirmation avec référence"]
  A --> A4["Comment ça marche"]
  A --> A5["Galerie"]
  A --> A6["FAQ"]
  A --> A7["Contact"]
  C -. "e-mail avec lien" .-> T["Suivi de la demande"]
  T --> Q["Devis : consulter, accepter, modifier, refuser"]
  B["Administration"] --> B0["Connexion"]
  B0 --> B1["Tableau de bord"]
  B1 --> B2["Demandes"]
  B2 --> B3["Fiche demande"]
  B3 --> B4["Devis"]
  B3 --> B5["Paiements"]
  B3 --> B6["Documents PDF"]
  B1 --> B7["Clients"]
  B1 --> B8["Services et réglages"]
  B1 --> B9["Messages"]
  B1 --> B10["Utilisateurs et journal"]
```

## 2. Parcours du client

### 2.1 Demander un devis (prestation)

```mermaid
flowchart TD
  S1["Le visiteur arrive sur le site"] --> S2["Choisit une prestation"]
  S2 --> S3["Page du service, bouton Demander un devis"]
  S3 --> S4["Pour qui ? Pour moi ou pour un proche"]
  S4 --> S5["Étapes du formulaire du service"]
  S5 --> S6["Récapitulatif, consentement, anti-spam"]
  S6 --> S7{"Données valides ?"}
  S7 -- "Non" --> S5
  S7 -- "Oui" --> S8["Envoi : la demande est enregistrée"]
  S8 --> S9["Écran de confirmation : référence DZ-AAAA-NNNNNN"]
  S9 --> S10["E-mail avec lien de suivi"]
  S10 --> S11["Statut Demande reçue"]
```

### 2.2 Commander un service à la demande

```mermaid
flowchart TD
  R1["Choisit le service, bouton Commander le service"] --> R2["Pour moi ou pour un proche"]
  R2 --> R3["Décrit le besoin : numéro, montant souhaité, localisation"]
  R3 --> R4["Envoi et confirmation avec référence"]
  R4 --> R5["L'agence vérifie la demande"]
  R5 --> R6["L'agence envoie un devis simplifié : montant, frais, délai"]
  R6 --> R7{"Le client accepte ?"}
  R7 -- "Oui" --> R8["Paiement et envoi du justificatif"]
  R7 -- "Modifier" --> R5
  R7 -- "Non" --> R9["Demande refusée"]
  R8 --> R10["L'agence confirme le paiement"]
  R10 --> R11["Le service est réalisé"]
  R11 --> R12["Confirmation au client, statut Terminée"]
```

### 2.3 Commander pour un proche (diaspora)
1. Le client choisit « Pour un proche ».
2. Il renseigne **ses** coordonnées (nom, prénom, pays, téléphone, WhatsApp, e-mail).
3. Il renseigne le **bénéficiaire** (nom, prénom, téléphone, ville, région, adresse, relation).
4. Le reste du formulaire est celui du service choisi.
5. Un client déjà connu (même téléphone) est reconnu sans que ses données soient affichées ni modifiées.

### 2.4 Formulaire de mariage, étape par étape

```mermaid
flowchart LR
  M1["1. Client et type de demandeur"] --> M2["2. Pour qui ?"]
  M2 --> M3["3. Mariés, Boina Harus, Bibi Harus"]
  M3 --> M4["4. Lieu et dates"]
  M4 --> M5["5. Prestations à cocher<br/>et prestations libres"]
  M5 --> M6["6. Programme : jours et heures<br/>par prestation"]
  M6 --> M7["7. Séance photo, numéros 1 à 30<br/>facultatif"]
  M7 --> M8["8. Remarques et fichiers"]
  M8 --> M9["9. Récapitulatif et envoi"]
```

Règles de l'écran « Programme » : une ligne par prestation et par journée ; la date doit être dans la période du mariage ; le jour de la semaine est affiché automatiquement ; une case « finit le lendemain » gère les heures après minuit ; le bouton « Ajouter une journée » ajoute une ligne.

### 2.5 Suivre sa demande et accepter un devis

```mermaid
flowchart TD
  U1["Lien de suivi reçu par e-mail ou WhatsApp"] --> U2["Page de suivi : statut, historique"]
  U2 --> U3{"Un devis est disponible ?"}
  U3 -- "Non" --> U2
  U3 -- "Oui" --> U4["Page du devis : lignes, total, validité"]
  U4 --> U5{"Décision"}
  U5 -- "Accepter" --> U6["Saisie du nom, confirmation"]
  U5 -- "Demander une modification" --> U7["Message à l'agence, retour en traitement"]
  U5 -- "Refuser" --> U8["Motif facultatif, demande refusée"]
  U6 --> U9["Devis accepté, consigne de paiement affichée"]
```

## 3. Parcours de l'administration

### 3.1 Traiter une demande

```mermaid
flowchart TD
  A1["Notification : nouvelle demande"] --> A2["Liste des demandes"]
  A2 --> A3["Fiche demande"]
  A3 --> A4["Prendre le dossier : statut En traitement, agent assigné"]
  A4 --> A5{"Information manquante ?"}
  A5 -- "Oui" --> A6["Contacter le client par WhatsApp, noter dans l'historique"]
  A6 --> A4
  A5 -- "Non" --> A7["Créer le devis : lignes, sommes de passage, acompte, validité"]
  A7 --> A8["Un administrateur envoie le devis : PDF cacheté, e-mail, lien"]
  A8 --> A9{"Réponse du client"}
  A9 -- "Accepté" --> A10["Enregistrer et confirmer l'acompte"]
  A9 -- "Modification" --> A4
  A9 -- "Refus ou expiration" --> A11["Clôture ou réouverture"]
  A10 --> A12["Statut En cours : réaliser la prestation"]
  A12 --> A13["Confirmer le solde, émettre le reçu"]
  A13 --> A14["Statut Terminée, message au client"]
```

### 3.2 Paiement
1. Le client paie selon la consigne (espèces, Wave, Orange Money, Holo, virement, autre) et envoie un justificatif.
2. Un agent ou un administrateur **enregistre** le paiement (statut En attente) avec référence et justificatif.
3. Un **administrateur** le **confirme** : date et auteur sont enregistrés, l'état de règlement de la demande est recalculé.
4. Un reçu PDF peut être émis.
5. Un paiement confirmé ne se modifie pas ; en cas d'erreur, on le rembourse ou on l'annule par un nouvel enregistrement.

## 4. États et transitions

### 4.1 Demande

```mermaid
stateDiagram-v2
  [*] --> NEW
  NEW --> IN_REVIEW
  NEW --> CANCELLED
  IN_REVIEW --> QUOTE_SENT
  IN_REVIEW --> CANCELLED
  QUOTE_SENT --> ACCEPTED
  QUOTE_SENT --> REJECTED
  QUOTE_SENT --> EXPIRED
  QUOTE_SENT --> IN_REVIEW : modification demandée
  QUOTE_SENT --> CANCELLED
  ACCEPTED --> IN_PROGRESS
  ACCEPTED --> CANCELLED
  IN_PROGRESS --> COMPLETED
  IN_PROGRESS --> CANCELLED
  REJECTED --> IN_REVIEW : réouverture
  EXPIRED --> IN_REVIEW : réouverture
  COMPLETED --> [*]
```

| Statut | Libellé affiché | Qui le provoque |
|---|---|---|
| NEW | Demande reçue | Envoi du formulaire |
| IN_REVIEW | En traitement | Agent ou administrateur ; automatique à la création d'un devis |
| QUOTE_SENT | Devis envoyé | Automatique à l'envoi du devis |
| ACCEPTED | Acceptée | Automatique à l'acceptation du devis |
| IN_PROGRESS | En cours | Agent ou administrateur |
| COMPLETED | Terminée | Agent ou administrateur |
| REJECTED | Refusée | Refus du devis par le client |
| EXPIRED | Expirée | Automatique à l'échéance du devis |
| CANCELLED | Annulée | Agent ou administrateur, **motif obligatoire** |

### 4.2 Devis

```mermaid
stateDiagram-v2
  [*] --> DRAFT
  DRAFT --> SENT : administrateur
  DRAFT --> CANCELLED
  SENT --> VIEWED : ouverture du lien
  SENT --> ACCEPTED
  VIEWED --> ACCEPTED
  SENT --> REJECTED
  VIEWED --> REJECTED
  SENT --> EXPIRED
  VIEWED --> EXPIRED
  SENT --> CANCELLED : nouvelle version envoyée
  VIEWED --> CANCELLED
```

Après l'envoi, les lignes et les montants ne changent plus : on crée une **nouvelle version**.

### 4.3 Paiement et règlement

```mermaid
stateDiagram-v2
  [*] --> PENDING
  PENDING --> CONFIRMED : administrateur
  PENDING --> FAILED
  PENDING --> CANCELLED
  CONFIRMED --> REFUNDED : administrateur
```

État de règlement de la demande, calculé : **UNPAID** (aucun paiement confirmé), **PARTIAL** (confirmé inférieur au devis accepté), **PAID** (confirmé supérieur ou égal), **REFUNDED** (tout remboursé).

## 5. Écrans

Convention d'états : chaque écran prévoit un état **chargement** (squelette), **vide** (message et action), **erreur** (message clair, bouton réessayer).

### 5.1 Site public

| Écran | Contenu | Actions | Particularités |
|---|---|---|---|
| Accueil | Bandeau, section diaspora, services, comment ça marche, à propos, galerie, témoignages, FAQ, contact | Découvrir nos services, Commander pour un proche | Texte du bandeau et diaspora conformes au cahier des charges |
| Services | Cartes : icône, nom, description, bouton | Ouvrir un service | Services actifs seulement |
| Page de service | Image, description, prestations incluses, galerie, FAQ | Demander un devis ou Commander | Aucun prix |
| Formulaire | Barre de progression, champs de l'étape, boutons Précédent et Suivant | Suivant, Précédent, Envoyer | Erreurs en français ; brouillon local (mariage) |
| Confirmation | Référence, message, lien de suivi, bouton WhatsApp | Copier la référence, Suivre ma demande | Référence jamais seule porteuse d'accès |
| Suivi | Statut, historique, devis | Ouvrir le devis | `noindex` ; jeton invalide : message neutre |
| Devis | En-tête agence, lignes, total, acompte, validité | Accepter, Demander une modification, Refuser | Devis expiré : lecture seule |
| Contact | Formulaire, coordonnées de l'agence | Envoyer | Anti-spam |
| Pages légales | Mentions, conditions, confidentialité | | |

### 5.2 Administration

| Écran | Contenu | Actions |
|---|---|---|
| Connexion | E-mail, mot de passe, code de double authentification | Se connecter |
| Tableau de bord | Demandes du jour, devis en attente, prestations à venir, clients, encaissements du mois | Ouvrir une liste |
| Liste des demandes | Tableau filtrable (service, statut, date, local ou diaspora, agent) | Ouvrir, créer une demande, assigner |
| Fiche demande | Onglets : client, bénéficiaire, prestation, programme, fichiers, devis, paiements, notes internes, historique | Changer de statut, créer un devis, enregistrer un paiement, générer la fiche de prestation, message WhatsApp prérempli |
| Éditeur de devis | Lignes, case « somme de passage », remise, acompte, validité, conditions, aperçu PDF | Enregistrer, envoyer (administrateur), annuler, créer une version |
| Paiements | Liste avec filtres, justificatifs | Confirmer, rembourser (administrateur) |
| Clients | Fiches, bénéficiaires, historique | Rechercher, modifier, fusionner les doublons (V2) |
| Services | Catégories, services, ordre, publication, champs génériques | Modifier |
| Messages | Messages de contact et statuts | Marquer lu, en cours, résolu, archivé |
| Réglages | Coordonnées, logo, **cachet**, réseaux, horaires, validité des devis, taux d'acompte, modes de paiement | Enregistrer (cachet : super-administrateur) |
| Utilisateurs | Comptes, rôles, activation | Créer, désactiver (super-administrateur) |
| Journal | Actions, auteur, anciennes et nouvelles valeurs | Rechercher (super-administrateur) |

## 6. Notifications et messages

| Événement | Destinataire | Canal | Contenu |
|---|---|---|---|
| Demande enregistrée | Client | E-mail | Référence, lien de suivi |
| Nouvelle demande | Personnel | Interne | « Demande DZ-… » |
| Nouveau contact | Personnel | Interne | Nom de l'expéditeur |
| Devis envoyé | Client | E-mail, lien WhatsApp | Lien du devis, validité |
| Devis accepté | Personnel | Interne | Numéro du devis |
| Paiement confirmé | Personnel, client | Interne, e-mail | Montant, reçu |
| Prestation terminée | Client | E-mail | Remerciement |
| Devis proche de l'échéance | Personnel | Interne (V2) | Liste des devis |
| Prestation à venir | Personnel | Interne (V2) | J-7 et J-1 |

## 7. Cas limites

| Cas | Comportement |
|---|---|
| Jeton de suivi ou de devis invalide | Message neutre « Lien invalide ou expiré », sans indice |
| Double envoi du formulaire | Une seule demande créée |
| Téléphone déjà connu | Rattachement au client existant, données non écrasées, réconciliation par le personnel |
| Devis accepté deux fois | Refusé ; la première acceptation fait foi |
| Devis expiré | Lecture seule ; l'agence peut créer une nouvelle version |
| Fichier trop lourd ou type interdit | Refus avant l'envoi, avec message explicite |
| Paiement saisi sur un mauvais devis | Refusé par la base (le devis doit appartenir à la demande) |
| Agent tentant une action réservée | Refus clair ; l'action n'est pas proposée dans l'interface |
| Coupure de connexion pendant le formulaire | Brouillon conservé sur l'appareil |
