# ⚡ ACTION IMMÉDIATE - Ajouter les Données

## 🎯 Problème
Votre site est en ligne mais n'affiche pas de contenu car la base de données Firestore est vide.

## ✅ Solution Rapide (10 minutes)

### Ouvrez le guide complet : **`GUIDE_AJOUT_DONNEES.md`**

Ou suivez ces étapes minimales :

---

## ÉTAPES RAPIDES

### 1. Créer l'utilisateur admin

https://console.firebase.google.com/project/axe-legal-f91cd/authentication/users

- Add user
- Email: `admin@axelegal.bj`  
- Password: `admin123`
- **COPIEZ L'UID affiché**

### 2. Créer le profil admin dans Firestore

https://console.firebase.google.com/project/axe-legal-f91cd/firestore/data

- Start collection → `users`
- Document ID: **COLLEZ L'UID**
- Ajoutez 4 champs:
  - `email`: `admin@axelegal.bj`
  - `name`: `Administrateur`
  - `role`: `admin`
  - `createdAt`: timestamp (Now)
- Save

### 3. Se connecter à l'admin

https://axe-legal-f91cd.web.app/admin/login

- Email: `admin@axelegal.bj`
- Password: `admin123`

### 4. Ajouter du contenu depuis l'admin

Une fois connecté, utilisez l'interface admin pour ajouter :
- Services
- Équipe
- Témoignages
- Annonces

---

## 📖 Guide Détaillé

Le fichier **`GUIDE_AJOUT_DONNEES.md`** contient un tutoriel complet avec toutes les étapes illustrées et des exemples de données.

Le fichier **`seed-data.json`** contient toutes les données prêtes à utiliser.

---

## ⏱️ Temps estimé

- Étapes 1-2 : **5 minutes** → Admin fonctionnel
- Étapes 3-4 : **5-10 minutes** → Site avec contenu

**Total : 10-15 minutes maximum**

---

Ouvrez **`GUIDE_AJOUT_DONNEES.md`** maintenant ! 🚀
