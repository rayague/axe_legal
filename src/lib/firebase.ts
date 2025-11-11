import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDPdKaODMcfT8YsHR1G2i8JP47v2vF2NZA",
  authDomain: "axe-legal-f91cd.firebaseapp.com",
  projectId: "axe-legal-f91cd",
  storageBucket: "axe-legal-f91cd.firebasestorage.app",
  messagingSenderId: "164833152543",
  appId: "1:164833152543:web:5ba9acf19a2242126bcf2a",
  measurementId: "G-LT2697MYWX"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser les services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
