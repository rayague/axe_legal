# 🚀 Guide de démarrage rapide Firebase - Axe Legal

## ✅ Configuration terminée !

Firebase est maintenant configuré pour votre projet Axe Legal avec :
- **Project ID**: axe-legal-f91cd
- **Configuration**: src/lib/firebase.ts
- **API Firestore**: src/lib/firebaseApi.ts
- **Règles de sécurité**: firestore.rules

---

## 📝 Étapes restantes (à faire dans la console Firebase)

### 1. Activer Authentication Email/Password

1. Allez sur https://console.firebase.google.com/project/axe-legal-f91cd
2. Cliquez sur **Authentication** dans le menu de gauche
3. Cliquez sur **Get started** (si pas encore fait)
4. Dans l'onglet **Sign-in method**
5. Activez **Email/Password**
6. Cliquez sur **Save**

### 2. Créer l'utilisateur admin

1. Toujours dans **Authentication**
2. Allez dans l'onglet **Users**
3. Cliquez sur **Add user**
4. Email: `admin@axelegal.bj`
5. Password: `admin123` (vous pourrez le changer plus tard)
6. Cliquez sur **Add user**
7. **COPIEZ l'UID** de l'utilisateur créé (ex: `kR8vN2mP4qXvZ...`)

### 3. Ajouter les données admin dans Firestore

1. Dans le menu de gauche, cliquez sur **Firestore Database**
2. Si pas encore créé, cliquez sur **Create database**
   - Mode: **Production mode**
   - Location: **europe-west** (ou le plus proche)
3. Cliquez sur **Start collection**
4. Collection ID: `users`
5. Document ID: **COLLEZ l'UID copié de l'étape 2**
6. Ajoutez ces champs :

   | Champ | Type | Valeur |
   |-------|------|--------|
   | email | string | admin@axelegal.bj |
   | name | string | Administrateur |
   | role | string | admin |
   | createdAt | timestamp | (utilisez la date/heure actuelle) |

7. Cliquez sur **Save**

### 4. Déployer les règles Firestore

```bash
firebase deploy --only firestore:rules
```

---

## 🎯 Déploiement de l'application

### Option 1: Build local et test

```bash
npm run build
npm run preview
```

### Option 2: Déploiement Firebase Hosting

```bash
npm run firebase:deploy
```

Votre site sera disponible sur: **https://axe-legal-f91cd.web.app**

### Option 3: Déploiement Hosting uniquement

```bash
npm run firebase:hosting
```

---

## 🔐 Identifiants de connexion

Une fois l'utilisateur admin créé :

- **URL Admin**: https://axe-legal-f91cd.web.app/admin/login
- **Email**: admin@axelegal.bj
- **Password**: admin123

⚠️ **Important**: Changez le mot de passe après la première connexion via la page Profile.

---

## 📊 Collections Firestore

Votre base de données Firestore utilisera ces collections :

- `users` - Comptes administrateurs
- `services` - Services juridiques
- `team` - Membres de l'équipe
- `process` - Étapes du processus
- `testimonials` - Témoignages
- `announcements` - Annonces
- `messages` - Messages de contact
- `consultations` - Demandes de consultation
- `settings` - Configuration (horaires, etc.)

Les collections seront créées automatiquement lors de l'ajout de données.

---

## 🔒 Sécurité

Les règles Firestore sont configurées pour :
- ✅ Lecture publique des contenus (services, équipe, etc.)
- ✅ Écriture réservée aux admins authentifiés
- ✅ Messages et consultations: création publique, gestion admin

---

## 🛠️ Commandes utiles

```bash
# Développement local
npm run dev

# Build production
npm run build

# Déploiement complet Firebase
npm run firebase:deploy

# Déploiement hosting uniquement
npm run firebase:hosting

# Déploiement règles Firestore uniquement
firebase deploy --only firestore:rules

# Voir les logs Firebase
firebase functions:log

# Ouvrir la console Firebase
firebase open
```

---

## 📈 Quotas gratuits Firebase

**Firestore**:
- 1 GB de stockage
- 50,000 lectures/jour
- 20,000 écritures/jour
- 20,000 suppressions/jour

**Authentication**:
- 10,000 utilisateurs
- Illimité pour Email/Password

**Hosting**:
- 10 GB de stockage
- 360 MB/jour de transfert

---

## 🆘 Support

Si vous rencontrez des problèmes :

1. Vérifiez que Authentication Email/Password est activé
2. Vérifiez que l'utilisateur admin existe dans Authentication
3. Vérifiez que le document admin existe dans Firestore collection `users`
4. Vérifiez les règles Firestore avec `firebase deploy --only firestore:rules`
5. Consultez la console Firebase pour les erreurs

---

## ✨ Prochaines étapes

1. ✅ Activer Authentication Email/Password
2. ✅ Créer l'utilisateur admin
3. ✅ Ajouter les données admin dans Firestore
4. ✅ Déployer les règles Firestore
5. ✅ Tester la connexion admin
6. ✅ Déployer sur Firebase Hosting

**Commencez par l'étape 1 ci-dessus !** 🚀
