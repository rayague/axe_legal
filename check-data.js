import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDPdKaODMcfT8YsHR1G2i8JP47v2vF2NZA",
  authDomain: "axe-legal-f91cd.firebaseapp.com",
  projectId: "axe-legal-f91cd",
  storageBucket: "axe-legal-f91cd.firebasestorage.app",
  messagingSenderId: "164833152543",
  appId: "1:164833152543:web:5ba9acf19a2242126bcf2a",
  measurementId: "G-LT2697MYWX"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkData() {
  console.log('🔍 Vérification des données Firestore...\n');

  // Services
  const servicesSnapshot = await getDocs(collection(db, 'services'));
  console.log(`📦 SERVICES (${servicesSnapshot.size} documents):`);
  servicesSnapshot.forEach(doc => {
    const data = doc.data();
    console.log(`\n✅ ${data.title}`);
    console.log(`   Description: ${data.description.substring(0, 80)}...`);
    console.log(`   Icon: ${data.icon}`);
  });

  // Team
  const teamSnapshot = await getDocs(collection(db, 'team'));
  console.log(`\n\n👥 ÉQUIPE (${teamSnapshot.size} documents):`);
  teamSnapshot.forEach(doc => {
    const data = doc.data();
    console.log(`\n✅ ${data.name}`);
    console.log(`   Rôle: ${data.role}`);
    console.log(`   Bio: ${data.bio.substring(0, 80)}...`);
  });

  // Testimonials
  const testimonialsSnapshot = await getDocs(collection(db, 'testimonials'));
  console.log(`\n\n💬 TÉMOIGNAGES (${testimonialsSnapshot.size} documents):`);
  testimonialsSnapshot.forEach(doc => {
    const data = doc.data();
    console.log(`\n✅ ${data.name} - ${data.role}`);
    console.log(`   ${data.content.substring(0, 80)}...`);
    console.log(`   Note: ${'⭐'.repeat(data.rating)}`);
  });

  // Process
  const processSnapshot = await getDocs(collection(db, 'processes'));
  console.log(`\n\n📋 PROCESSUS (${processSnapshot.size} documents):`);
  processSnapshot.forEach(doc => {
    const data = doc.data();
    console.log(`\n${data.order}. ${data.title}`);
    console.log(`   ${data.description.substring(0, 80)}...`);
  });

  // Announcements
  const announcementsSnapshot = await getDocs(collection(db, 'announcements'));
  console.log(`\n\n📢 ANNONCES (${announcementsSnapshot.size} documents):`);
  announcementsSnapshot.forEach(doc => {
    const data = doc.data();
    console.log(`\n✅ ${data.title}`);
    console.log(`   ${data.content.substring(0, 80)}...`);
    console.log(`   Type: ${data.type}`);
  });

  console.log('\n\n✅ Vérification terminée !');
}

checkData();
