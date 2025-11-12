# 🎯 Gestion des Catégories Juridiques LegalTech

## 📋 Vue d'ensemble

Ce système permet de gérer professionnellement toutes les catégories juridiques et leurs démarches associées pour la page LegalTech du site Axe Legal.

## 🚀 Mise en place initiale

### 1. Déployer les règles Firestore

Les règles Firestore ont déjà été mises à jour pour permettre la gestion des catégories juridiques.

```bash
cd axe_legal
firebase deploy --only firestore:rules
```

### 2. Initialiser les données (Seed)

Pour ajouter les 9 catégories juridiques initiales dans Firebase :

```bash
node scripts/seed-legal-categories-auth.mjs
```

Le script vous demandera :
- Email admin (exemple : admin@axe-legal.com)
- Mot de passe admin

**Note** : Vous devez vous connecter avec un compte admin Firebase Auth valide.

## 🎨 Structure des catégories

Chaque catégorie juridique comprend :

### Informations de base
- **categoryId** : Identifiant unique (ex: `family`, `real-estate`)
- **title** : Titre affiché (ex: "Droit de la Famille")
- **description** : Description courte pour la carte
- **iconName** : Nom de l'icône (Heart, Home, Briefcase, etc.)
- **color** : Dégradé de couleur (ex: `from-pink-500/10 to-pink-600/10`)
- **borderColor** : Couleur de la bordure au survol
- **order** : Ordre d'affichage (1, 2, 3...)
- **isActive** : Active/Inactive (visible ou non sur le site)

### Guide détaillé
- **guidanceTitle** : Titre du guide complet
- **steps** : Array d'étapes avec titre et description
- **documents** : Array de documents nécessaires
- **timeline** : Délai estimé (ex: "6 à 18 mois")
- **cost** : Coût indicatif
- **warning** : Point d'attention important

## 🔧 Gestion dans l'interface Admin

### Accès
1. Connectez-vous à l'interface admin : https://axe-legal.vercel.app/admin
2. Allez dans **Settings** (menu latéral)

### Fonctionnalités disponibles

#### 📊 Vue d'ensemble
- Nombre total de catégories
- Catégories actives/inactives
- Recherche par titre, description ou ID

#### ➕ Ajouter une catégorie
1. Cliquez sur "Ajouter une catégorie"
2. Remplissez les 3 onglets :
   - **Basique** : Infos principales, icône, couleur, timeline, coût
   - **Étapes** : Ajoutez toutes les étapes de la procédure
   - **Documents** : Listez tous les documents requis
3. Cliquez sur "Enregistrer"

#### ✏️ Modifier une catégorie
1. Cliquez sur une catégorie dans la liste
2. Modifiez les champs souhaités
3. Cliquez sur "Enregistrer"

#### 🗑️ Supprimer une catégorie
1. Cliquez sur l'icône de corbeille
2. Confirmez la suppression

#### 👁️ Activer/Désactiver
Utilisez le switch "Catégorie active" pour rendre la catégorie visible ou invisible sur le site public.

## 🌐 Affichage sur le site public

### Page LegalTech : https://axe-legal-f91cd.web.app/legaltech

La page charge automatiquement toutes les catégories actives depuis Firebase et affiche :

1. **Grille de catégories** : Cartes cliquables avec icône, titre et description
2. **Guide détaillé** : Après sélection, affiche :
   - Délai estimé
   - Coût indicatif
   - Nombre de documents
   - Toutes les étapes numérotées
   - Liste des documents à préparer
   - Points d'attention

## 📝 Catégories initiales

Les 9 catégories pré-configurées sont :

1. **Droit de la Famille** (family) - Rose 🏠
2. **Droit Immobilier** (real-estate) - Bleu 🏘️
3. **Droit des Affaires** (business) - Violet 💼
4. **Droit du Travail** (labor) - Vert 👥
5. **Droit des Contrats** (contracts) - Orange 📄
6. **Succession & Héritage** (succession) - Jaune 📈
7. **Accidents & Préjudices** (accident) - Rouge 🚗
8. **Droit de la Construction** (construction) - Sarcelle 🏗️
9. **Recouvrement de Créances** (debt) - Indigo 💳

## 🎨 Icônes disponibles

- Heart (Cœur)
- Home (Maison)
- Briefcase (Mallette)
- Users (Utilisateurs)
- FileText (Document)
- TrendingUp (Graphique)
- Car (Voiture)
- Building (Bâtiment)
- CreditCard (Carte)
- Scale (Balance)

## 🎨 Couleurs disponibles

- Rose, Bleu, Violet, Vert, Orange, Jaune, Rouge, Sarcelle, Indigo, Cyan

## 🔒 Sécurité

- Lecture publique : Tous les utilisateurs peuvent voir les catégories actives
- Écriture authentifiée : Seuls les administrateurs connectés peuvent modifier
- Les catégories inactives ne sont pas visibles sur le site public

## 🚨 Dépannage

### Le seed ne fonctionne pas
- Vérifiez que vous êtes connecté avec un compte admin valide
- Vérifiez que les règles Firestore sont déployées
- Vérifiez votre connexion internet

### Les catégories ne s'affichent pas
- Vérifiez que `isActive` est à `true`
- Vérifiez la console du navigateur pour les erreurs
- Vérifiez que Firebase est bien configuré

### Les modifications ne sont pas sauvegardées
- Vérifiez que vous êtes connecté à l'admin
- Vérifiez les permissions Firestore
- Vérifiez que tous les champs obligatoires sont remplis

## 📚 Fichiers importants

- `/src/pages/admin/SettingsPage.tsx` - Interface de gestion admin
- `/src/pages/LegalTech.tsx` - Page publique (sera modifiée)
- `/src/lib/firebaseApi.ts` - Fonctions API Firebase
- `/scripts/seed-legal-categories-auth.mjs` - Script de seed
- `/firestore.rules` - Règles de sécurité

## 🎯 Prochaines étapes

1. ✅ Seed des données initiales
2. ✅ Interface admin de gestion
3. ⏳ Modifier LegalTech.tsx pour utiliser Firebase
4. ⏳ Tester l'ensemble du système

---

**Fait avec ❤️ pour Axe Legal**
