# 🌱 Guide de Seed - Données Initiales

## Qu'est-ce que le seed ?

Le script de seed (`scripts/seed-firestore.js`) initialise votre base de données Firestore avec des **données de démonstration** pour que votre site affiche immédiatement du contenu professionnel.

---

## 📋 Données qui seront ajoutées

Le script va créer :

### 1. **Utilisateur Admin** 👤
- Email: `admin@axelegal.bj`
- Mot de passe: `admin123`
- Rôle: Administrateur

### 2. **Services** (4) 📋
- Droit des Affaires
- Droit Immobilier
- Droit du Travail
- Droit Fiscal

### 3. **Équipe** (4 membres) 👥
- Me. Jean-Baptiste ADJIBI (Droit des Affaires)
- Me. Marie KOSSOU (Droit Immobilier)
- Me. Serge HOUNKANRIN (Droit du Travail)
- Me. Claudine AGOSSOU (Droit Fiscal)

### 4. **Processus** (5 étapes) ⚙️
- Consultation Initiale
- Étude du Dossier
- Stratégie Juridique
- Mise en Œuvre
- Suivi et Accompagnement

### 5. **Témoignages** (4) 💬
- Témoignages de clients satisfaits

### 6. **Annonces** (2) 📢
- Nouveau service de médiation
- Consultation gratuite

### 7. **Paramètres** ⚙️
- Horaires d'ouverture du cabinet

---

## 🚀 Comment exécuter le seed ?

### Prérequis

1. **Authentication Email/Password activée** dans Firebase Console
2. **Firestore Database créée** (mode production)

### Exécution

```bash
npm run seed
```

C'est tout ! Le script va :
1. ✅ Créer l'utilisateur admin dans Authentication
2. ✅ Ajouter le profil admin dans Firestore
3. ✅ Remplir toutes les collections avec des données

---

## ⏱️ Durée

Le seed prend environ **30 secondes** à s'exécuter.

---

## 📊 Résultat attendu

Après exécution, vous verrez :

```
🌱 Début du seed de la base de données...

👤 Création de l'utilisateur admin...
✅ Utilisateur admin créé avec UID: kR8vN2mP4qX...
✅ Données admin ajoutées dans Firestore

📋 Ajout des services...
✅ 4 services ajoutés

👥 Ajout des membres de l'équipe...
✅ 4 membres ajoutés

⚙️ Ajout des étapes du processus...
✅ 5 étapes ajoutées

💬 Ajout des témoignages...
✅ 4 témoignages ajoutés

📢 Ajout des annonces...
✅ 2 annonces ajoutées

⚙️ Configuration des paramètres...
✅ Horaires d'ouverture configurés

🎉 SEED TERMINÉ AVEC SUCCÈS !

📊 Résumé:
   - 1 utilisateur admin
   - 4 services
   - 4 membres d'équipe
   - 5 étapes de processus
   - 4 témoignages
   - 2 annonces
   - Paramètres configurés

✨ Vous pouvez maintenant vous connecter avec:
   Email: admin@axelegal.bj
   Mot de passe: admin123

🌐 URL: https://axe-legal-f91cd.web.app/admin/login
```

---

## ✅ Vérification

Après le seed, vérifiez dans la console Firebase :

1. **Authentication** → Users : Vous devriez voir `admin@axelegal.bj`
2. **Firestore** → Data : Vous devriez voir 8 collections :
   - `users` (1 document)
   - `services` (4 documents)
   - `team` (4 documents)
   - `process` (5 documents)
   - `testimonials` (4 documents)
   - `announcements` (2 documents)
   - `settings` (1 document: business_hours)

---

## 🔄 Re-seed (Ajouter plus de données)

Si vous voulez ajouter plus de données sans supprimer les existantes :

```bash
npm run seed
```

⚠️ **Note** : L'utilisateur admin ne sera pas créé deux fois (erreur ignorée si existe déjà).

---

## 🗑️ Nettoyer la base (Optionnel)

Si vous voulez repartir de zéro :

1. Allez dans Firebase Console → Firestore
2. Pour chaque collection, supprimez tous les documents
3. Allez dans Authentication → Users, supprimez l'admin
4. Re-exécutez : `npm run seed`

---

## 🎯 Après le seed

Une fois le seed terminé :

1. ✅ Visitez votre site : https://axe-legal-f91cd.web.app
2. ✅ Toutes les pages afficheront du contenu
3. ✅ Connectez-vous à l'admin : https://axe-legal-f91cd.web.app/admin/login
4. ✅ Modifiez les données selon vos besoins
5. ✅ Ajoutez vos propres contenus

---

## 📝 Personnalisation des données

Pour modifier les données de seed :

1. Ouvrez `scripts/seed-firestore.js`
2. Modifiez l'objet `seedData` :
   - Changez les noms, descriptions, etc.
   - Ajoutez ou supprimez des éléments
   - Modifiez les horaires d'ouverture
3. Sauvegardez et exécutez : `npm run seed`

---

## ⚠️ Important

- **Images** : Les chemins d'images pointent vers `/assets/images/`. Assurez-vous d'avoir les images correspondantes ou modifiez les chemins.
- **Mot de passe** : Changez le mot de passe admin après la première connexion via le menu Profile.
- **Données réelles** : Remplacez les données de démonstration par vos vraies informations depuis l'admin.

---

## 🆘 Erreurs courantes

### "Firebase: Error (auth/operation-not-allowed)"
➡️ **Solution** : Activez Email/Password dans Firebase Console → Authentication → Sign-in method

### "Missing or insufficient permissions"
➡️ **Solution** : Vérifiez que les règles Firestore sont déployées :
```bash
firebase deploy --only firestore:rules
```

### "Firebase: Error (auth/weak-password)"
➡️ **Solution** : Firebase nécessite un mot de passe d'au moins 6 caractères (déjà respecté avec "admin123")

---

## ✨ Prêt à commencer ?

Exécutez simplement :

```bash
npm run seed
```

Et votre site sera rempli de contenu professionnel en 30 secondes ! 🚀
