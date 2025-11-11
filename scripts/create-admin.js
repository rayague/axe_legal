import('firebase/app').then(({ initializeApp }) => {
  return Promise.all([
    import('firebase/auth'),
    import('firebase/firestore')
  ]).then(([authModule, firestoreModule]) => {
    const { getAuth, createUserWithEmailAndPassword } = authModule;
    const { getFirestore, doc, setDoc } = firestoreModule;

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
    const auth = getAuth(app);
    const db = getFirestore(app);

    async function createAdminUser() {
      try {
        console.log('🔐 Création de l\'utilisateur admin...');
        
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          'admin@axelegal.bj',
          'admin123'
        );
        
        const user = userCredential.user;
        console.log('✅ Utilisateur créé avec UID:', user.uid);
        
        await setDoc(doc(db, 'users', user.uid), {
          email: 'admin@axelegal.bj',
          name: 'Administrateur',
          role: 'admin',
          createdAt: new Date()
        });
        
        console.log('✅ Données admin ajoutées dans Firestore');
        console.log('\n📧 Email: admin@axelegal.bj');
        console.log('🔑 Password: admin123');
        console.log('\n✨ Vous pouvez maintenant vous connecter !');
        
        process.exit(0);
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          console.log('ℹ️  L\'utilisateur admin existe déjà');
          console.log('📧 Email: admin@axelegal.bj');
          console.log('🔑 Password: admin123');
        } else {
          console.error('❌ Erreur:', error.message);
        }
        process.exit(1);
      }
    }

    return createAdminUser();
  });
});
