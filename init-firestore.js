// Script pour initialiser les données de base dans Firestore
// À exécuter une seule fois après la première configuration

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyDR7e_4zXz7T9hZOqtJ_9bC5xY8kZvQ0Qs",
  authDomain: "axe-legal-f91cd.firebaseapp.com",
  projectId: "axe-legal-f91cd",
  storageBucket: "axe-legal-f91cd.firebasestorage.app",
  messagingSenderId: "449713257687",
  appId: "1:449713257687:web:ae7d6f9f8b0c9e8e8f0c9e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function initializeBusinessHours() {
  try {
    console.log('Initialisation des horaires d\'ouverture...');
    
    await setDoc(doc(db, 'settings', 'business_hours'), {
      weekdays: '08:00 - 18:00',
      saturday: '09:00 - 13:00',
      sunday: 'Fermé'
    });
    
    console.log('✅ Horaires d\'ouverture initialisés avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
  }
}

// Exécuter l'initialisation
initializeBusinessHours().then(() => {
  console.log('Initialisation terminée');
  process.exit(0);
});
