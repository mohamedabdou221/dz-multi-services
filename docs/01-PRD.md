# PRD — Document d'exigences produit

**Dz Multi-Services** · Version 1.0 · 8 octobre 2026
Documents liés : cahier des charges v2.2, [TRD](02-TRD.md), [App Flow](03-app-flow.md), [Design Brief](04-design-brief.md), [Schéma de données](05-schema-donnees.md), [Plan d'implémentation](06-plan-implementation.md).

---

## 1. Résumé

Dz Multi-Services est une agence multiservice qui réalise des prestations physiques sur place : filmage de mariage, séance photo, spot publicitaire, imprimerie, et des services à la demande (transfert d'argent, Canal+, électricité STS, crédit HURI / YAS, Holo).

Le produit est une **application web** qui relie deux publics : les clients sur place et les clients de la **diaspora**, qui commandent pour un proche. Elle remplace les échanges dispersés (WhatsApp, appels, fiches papier) par un circuit unique : **demande, devis, paiement, prestation**, avec des documents PDF portant le cachet de l'agence.

**Proposition de valeur**
- Pour le client : commander à distance sans être sur place, savoir où en est sa demande, recevoir un devis clair et le valider en ligne.
- Pour l'agence : ne plus perdre de demandes, traiter chaque dossier au même endroit, suivre les paiements et les revenus réels, produire des documents propres.

## 2. Problème à résoudre

| Problème actuel | Conséquence | Réponse du produit |
|---|---|---|
| Demandes reçues par WhatsApp, téléphone, papier | Informations incomplètes, oublis, ressaisies | Formulaires guidés, référence unique, historique |
| Le client de la diaspora ne peut pas suivre sa commande | Appels répétés, perte de confiance | Lien de suivi personnel, statuts en français |
| Devis et reçus faits à la main | Erreurs, aspect peu professionnel | Devis et reçus PDF avec en-tête et cachet |
| Revenus mélangés avec l'argent à reverser | Chiffre d'affaires faussé | Distinction sommes de passage / revenu de l'agence |
| Aucune trace de qui a fait quoi | Litiges difficiles à régler | Journal d'activité, permissions par rôle |

## 3. Objectifs et indicateurs

Les cibles sont des **hypothèses de départ**, à valider avec l'agence et à mesurer trois mois après la mise en ligne.

| Objectif | Indicateur | Cible initiale |
|---|---|---|
| Centraliser les demandes | Part des nouvelles demandes arrivant par le site | ≥ 50 % |
| Réagir vite | Délai médian de première réponse | < 4 h ouvrées |
| Dossiers complets | Demandes exploitables sans rappel du client | ≥ 85 % |
| Devis rapides | Devis envoyés sous 48 h | ≥ 90 % |
| Bon formulaire | Abandon du formulaire de mariage | ≤ 40 % |
| Chiffres fiables | Écart entre encaissements affichés et réels | 0 |

## 4. Utilisateurs

| Profil | Contexte | Besoins principaux |
|---|---|---|
| **Client local** | Sur place, surtout sur téléphone, connexion variable, utilise WhatsApp | Demander un devis ou commander simplement, être contacté vite |
| **Client diaspora** | À l'étranger, commande pour un proche, paie à distance | Renseigner le bénéficiaire, suivre la demande, accepter le devis en ligne |
| **Bénéficiaire** | Proche du client, reçoit le service | Pas de compte ; ses coordonnées servent à la réalisation |
| **Agent** | Traite les demandes au quotidien | Voir ses dossiers, préparer les devis, enregistrer des paiements |
| **Administrateur** | Responsable de l'agence | Envoyer les devis, confirmer les paiements, suivre la finance, gérer les contenus |
| **Super-administrateur** | Propriétaire | Gérer les comptes et les rôles, le cachet, consulter le journal |

## 5. Périmètre

### Version 1 (mise en ligne pilote)
Site public, quatre formulaires dédiés, formulaire générique des services à la demande, commande pour un proche, téléversement de fichiers, suivi par lien, devis avec acceptation en ligne, fiche de prestation et devis en PDF avec cachet, enregistrement et confirmation des paiements, tableau de bord simple, journal d'activité, gestion des services et des réglages, messages de contact, administration à trois rôles.

### Version 2
Dépenses, finance et rapports, clients et bénéficiaires complets, calendrier et réservations, galerie, témoignages et FAQ gérés depuis l'administration, notifications automatiques vers le client.

### Version 3
Paiement en ligne par un prestataire officiel, comptes clients, interface multilingue, envoi automatique par l'API WhatsApp Business.

### Hors périmètre
Application mobile native, facturation fiscale et comptabilité légale (à confirmer, voir § 11), exécution automatique des transferts d'argent et des recharges, boutique en ligne.

## 6. Exigences fonctionnelles

Priorités : **O** obligatoire, **I** important, **S** souhaitable.

### 6.1 Site public
| ID | Exigence | Prio | Version |
|---|---|---|---|
| RF-01 | Pages : accueil, à propos, services, page de service, comment ça marche, galerie, FAQ, contact, pages légales | O | V1 |
| RF-02 | Les services et contenus affichés viennent de la base ; aucun prix n'est affiché | O | V1 |
| RF-03 | Section diaspora et bouton « Commander pour un proche » en accueil | O | V1 |
| RF-04 | Bouton WhatsApp visible partout ; téléphones et e-mail de l'agence lus dans les réglages | O | V1 |
| RF-05 | Référencement : métadonnées par service, plan du site, image de partage | I | V1 |
| RF-06 | Mobile d'abord, utilisable sur connexion lente | O | V1 |

### 6.2 Formulaires
| ID | Exigence | Prio | Version |
|---|---|---|---|
| RF-10 | Question « Pour qui ? » au début de toute demande ; bénéficiaire obligatoire si « pour un proche » | O | V1 |
| RF-11 | **Mariage** : client, mariés, Boina Harus, Bibi Harus, lieu, dates, prestations connues (Grand Mariage, Karam, Mdhwahirisho, Pao, Mambizo) plus prestations libres, programme par prestation avec jours et heures, séance photo (numéros 1 à 30), fichiers | O | V1 |
| RF-12 | Le programme accepte plusieurs journées et une heure de fin le lendemain | O | V1 |
| RF-13 | **Séance photo**, **spot publicitaire**, **imprimerie** : formulaires dédiés | O | V1 |
| RF-14 | **Services à la demande** : formulaire générique piloté par la base, champs propres à chaque service | O | V1 |
| RF-15 | Téléversement de fichiers avec contrôle du type et de la taille | O | V1 |
| RF-16 | Récapitulatif avant envoi, consentement explicite, anti-spam | O | V1 |
| RF-17 | Brouillon du formulaire de mariage conservé sur l'appareil | S | V1 |
| RF-18 | Formulaire de contact avec statuts de traitement | O | V1 |

### 6.3 Suivi par le client
| ID | Exigence | Prio | Version |
|---|---|---|---|
| RF-20 | Référence unique (`DZ-AAAA-NNNNNN`) affichée à l'envoi et par e-mail | O | V1 |
| RF-21 | Page de suivi accessible par un lien personnel : statut, historique visible, devis | O | V1 |
| RF-22 | Page de devis : consulter, accepter (nom saisi), demander une modification, refuser | O | V1 |
| RF-23 | La référence seule ne donne jamais accès à une demande | O | V1 |

### 6.4 Administration
| ID | Exigence | Prio | Version |
|---|---|---|---|
| RF-30 | Connexion sécurisée, trois rôles, double authentification pour ADMIN et SUPER_ADMIN | O | V1 |
| RF-31 | Liste des demandes avec filtres (service, statut, date, local ou diaspora, agent) | O | V1 |
| RF-32 | Fiche demande : client, bénéficiaire, prestation, programme, fichiers, devis, paiements, notes internes, historique | O | V1 |
| RF-33 | Changement de statut selon des transitions autorisées, assignation à un agent | O | V1 |
| RF-34 | Création manuelle d'une demande (reçue par WhatsApp ou téléphone) | O | V1 |
| RF-35 | Devis : lignes, totaux calculés, versions, envoi, annulation, lignes « somme de passage » | O | V1 |
| RF-36 | Devis simplifié pour les services à la demande | O | V1 |
| RF-37 | Paiements : enregistrer (agent), confirmer (administrateur), justificatif, remboursement | O | V1 |
| RF-38 | État de règlement de la demande calculé automatiquement | O | V1 |
| RF-39 | Gestion des services, des réglages, des utilisateurs, des messages de contact | O | V1 |
| RF-40 | Tableau de bord : demandes du jour, devis en attente, prestations à venir, encaissements | I | V1 |
| RF-41 | Journal d'activité en lecture seule pour le super-administrateur | O | V1 |
| RF-42 | Dépenses, finance, rapports, graphiques | I | V2 |
| RF-43 | Calendrier des prestations avec détection des conflits | I | V2 |
| RF-44 | Gestion de la galerie, des témoignages, de la FAQ | I | V2 |

### 6.5 Documents
| ID | Exigence | Prio | Version |
|---|---|---|---|
| RF-50 | PDF de devis : en-tête (logo, téléphones, e-mail, adresse), lignes, total, validité, « Bon pour accord », cachet | O | V1 |
| RF-51 | PDF « fiche de prestation de mariage » reprenant la fiche papier, avec signatures client et agence | O | V1 |
| RF-52 | PDF de reçu de paiement | I | V1 |
| RF-53 | Le cachet est apposé automatiquement sur les documents émis, jamais sur un brouillon ; l'image reste privée | O | V1 |
| RF-54 | Un document émis est archivé et figé ; une correction crée un nouveau document | O | V1 |

### 6.6 Notifications
| ID | Exigence | Prio | Version |
|---|---|---|---|
| RF-60 | Notifications internes : nouvelle demande, nouveau contact, devis accepté, paiement confirmé | O | V1 |
| RF-61 | E-mails au client : demande reçue, devis disponible, paiement confirmé, prestation terminée | I | V1 |
| RF-62 | Message WhatsApp prérempli, envoyé d'un clic par l'agent | I | V1 |
| RF-63 | Expiration automatique des devis, rappels de prestations | I | V1 / V2 |

## 7. Règles de gestion

Reprises du cahier des charges (§ 4), sous forme abrégée :

1. Aucun tarif public.
2. Devis créé et envoyé par l'administration, valable 15 jours par défaut, versionné, accepté par lien avec trace.
3. Service à la demande : montant communiqué par devis simplifié que le client accepte avant de payer.
4. Acompte puis solde pour les prestations ; rien n'est exécuté avant confirmation du paiement pour les services financiers.
5. Sommes de passage distinguées du revenu de l'agence.
6. Numérotation par séquences : demande `DZ-AAAA-NNNNNN`, devis `DV-AAAA-NNNNN`, reçu `RC-AAAA-NNNNN`.
7. Une devise de référence, chaque montant porte sa devise.
8. Aucun paiement, devis envoyé ou entrée du journal ne se supprime.
9. Bénéficiaire obligatoire si commande pour un proche.
10. L'application enregistre les opérations financières ; elle ne détient aucun fonds.

## 8. Exigences non fonctionnelles

| Domaine | Exigence |
|---|---|
| Performance | Pages publiques : chargement principal ≤ 2,5 s sur mobile en 4G simulée ; formulaires réactifs |
| Disponibilité | Hébergement avec sauvegardes automatiques, restauration testée avant la production |
| Sécurité | RLS sur toutes les tables, validation côté serveur, jetons aléatoires, secrets côté serveur, double authentification administrateur |
| Confidentialité | Consentement, mentions légales, durée de conservation, suppression sur demande, cachet privé |
| Accessibilité | Contrastes conformes (voir Design Brief), navigation clavier, libellés explicites, taille de texte ≥ 16 px |
| Compatibilité | Navigateurs récents sur Android et iOS, ordinateurs |
| Langue | Interface en français ; autres langues en V3 |
| Maintenabilité | Migrations versionnées, tests automatisés, documentation à jour |

## 9. Critères d'acceptation de la V1

1. Un visiteur anonyme ne peut lire aucune donnée de demande, client, devis, paiement ou fichier.
2. Un agent ne peut ni envoyer un devis, ni confirmer un paiement, ni accéder à la finance.
3. Le montant d'un paiement confirmé ne peut pas être modifié, même par requête falsifiée.
4. Une demande de mariage sur deux jours, avec un événement finissant après minuit, est enregistrée et affichée correctement.
5. Une commande pour un proche crée le bénéficiaire et le relie au client.
6. Un devis a des totaux exacts, un PDF cacheté, une acceptation tracée et une version suivante en cas de modification.
7. Un paiement partiel donne l'état « partiel » et le bon reste à encaisser ; les sommes de passage sont exclues du chiffre d'affaires.
8. Le parcours complet est utilisable sur petit écran et connexion lente.
9. Une sauvegarde est restaurée avec succès.

## 10. Risques et hypothèses

| Risque ou hypothèse | Effet | Parade |
|---|---|---|
| Cadre légal des opérations financières non vérifié | Blocage de la mise en ligne de ces services | Vérification avant ouverture, ces services peuvent être lancés plus tard |
| Pays et devise non tranchés | Rework sur paiements et formats | Devise paramétrable, question à trancher au lot 0 |
| Paiement de la diaspora non défini | Parcours incomplet | Paiement manuel avec justificatif en V1, en ligne en V3 |
| Spam sur les formulaires | Boîte de réception polluée | Anti-spam, limitation de débit |
| Un seul développeur | Retards, dépendance | Documentation, tests, découpage en lots |
| Images et logos en basse définition | Rendu dégradé | Obtenir les fichiers vectoriels auprès du designer |

## 11. Points ouverts

1. Pays d'activité et devise de référence (franc CFA ou franc comorien).
2. Mode de paiement de la diaspora, et paiement manuel en V1.
3. Statut légal de l'agence pour transfert, dépôt et retrait, crédit.
4. Signification des numéros 1 à 30 de la séance photo.
5. Taux d'acompte, conditions d'annulation et de remboursement.
6. Qui peut envoyer un devis (agents ou administrateurs seulement).
7. Nombre d'administrateurs et d'agents.
8. Canal préféré pour prévenir les clients.
9. Langues du site.
10. Volume de demandes attendu par mois.
11. Listes : types de séances, formats et finitions d'impression.
12. Fichier du cachet, numéros de téléphone, e-mail, adresse, nom de domaine.
13. Besoin de factures fiscales en plus des devis et reçus.
