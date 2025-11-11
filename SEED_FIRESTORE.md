# 🌱 Ajouter des données de test dans Firestore

## Option 1 : Via la Console Firebase (RAPIDE - 5 minutes)

### 1. Ajouter des Services

👉 **Allez sur** : https://console.firebase.google.com/project/axe-legal-f91cd/firestore/databases/-default-/data

1. **Créez la collection `services`**
2. **Ajoutez ces 3 documents** :

#### Document 1 : Droit des Affaires
```
ID du document : service1
Champs :
- title (string) : "Droit des Affaires"
- description (string) : "Conseil et assistance juridique pour les entreprises"
- icon (string) : "Briefcase"
- createdAt (timestamp) : [Cliquez sur l'horloge pour timestamp actuel]
```

#### Document 2 : Droit Fiscal
```
ID du document : service2
Champs :
- title (string) : "Droit Fiscal"
- description (string) : "Optimisation fiscale et contentieux fiscal"
- icon (string) : "DollarSign"
- createdAt (timestamp) : [Cliquez sur l'horloge pour timestamp actuel]
```

#### Document 3 : Droit Immobilier
```
ID du document : service3
Champs :
- title (string) : "Droit Immobilier"
- description (string) : "Transactions immobilières et baux commerciaux"
- icon (string) : "Home"
- createdAt (timestamp) : [Cliquez sur l'horloge pour timestamp actuel]
```

### 2. Ajouter des Membres d'Équipe

**Collection : `team`**

#### Document 1
```
ID : team1
Champs :
- name (string) : "Me Dupont Jean"
- role (string) : "Avocat Senior"
- bio (string) : "Spécialiste en droit des affaires avec 15 ans d'expérience"
- image (string) : "https://ui-avatars.com/api/?name=Jean+Dupont&size=200"
- createdAt (timestamp) : [timestamp actuel]
```

#### Document 2
```
ID : team2
Champs :
- name (string) : "Me Martin Sophie"
- role (string) : "Avocate Fiscaliste"
- bio (string) : "Experte en fiscalité des entreprises"
- image (string) : "https://ui-avatars.com/api/?name=Sophie+Martin&size=200"
- createdAt (timestamp) : [timestamp actuel]
```

### 3. Ajouter des Témoignages

**Collection : `testimonials`**

#### Document 1
```
ID : testimonial1
Champs :
- name (string) : "Pierre Kouassi"
- role (string) : "Directeur Général, ABC Sarl"
- content (string) : "Service excellent et très professionnel. Je recommande vivement !"
- rating (number) : 5
- image (string) : "https://ui-avatars.com/api/?name=Pierre+Kouassi&size=200"
- createdAt (timestamp) : [timestamp actuel]
```

### 4. Ajouter des Étapes de Processus

**Collection : `processes`**

#### Document 1
```
ID : process1
Champs :
- title (string) : "Consultation Initiale"
- description (string) : "Première rencontre pour comprendre vos besoins"
- order (number) : 1
- createdAt (timestamp) : [timestamp actuel]
```

#### Document 2
```
ID : process2
Champs :
- title (string) : "Analyse du Dossier"
- description (string) : "Étude approfondie de votre situation juridique"
- order (number) : 2
- createdAt (timestamp) : [timestamp actuel]
```

#### Document 3
```
ID : process3
Champs :
- title (string) : "Proposition de Solution"
- description (string) : "Présentation de la stratégie juridique recommandée"
- order (number) : 3
- createdAt (timestamp) : [timestamp actuel]
```

## Option 2 : Via le Code (Plus tard)

Une fois que vous aurez ajouté manuellement quelques données, nous pourrons créer un script d'import automatique.

## ✅ Vérification

Une fois les données ajoutées :
1. Rafraîchissez votre page admin : https://axe-legal-f91cd.web.app/admin
2. Vous devriez voir les statistiques se mettre à jour
3. Cliquez sur "Services" pour voir vos services ajoutés

## 🚀 Prochaine Étape

Après avoir ajouté ces données de test, je vais mettre à jour toutes les pages admin pour qu'elles utilisent Firebase au lieu de localhost:4000.
