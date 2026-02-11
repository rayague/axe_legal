import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { existsSync } from 'fs';

function initAdmin() {
  if (admin.apps.length > 0) return admin.app();

  const projectId = process.env.FIREBASE_PROJECT_ID || 'axe-legal-f91cd';

  const credentialsPath = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (credentialsPath) {
    const abs = resolve(credentialsPath);
    if (!existsSync(abs)) {
      throw new Error(
        `FIREBASE_SERVICE_ACCOUNT not found: ${abs}\n` +
          `Place your service account JSON there, or set FIREBASE_SERVICE_ACCOUNT to the correct path.`
      );
    }
    const serviceAccount = JSON.parse(readFileSync(abs, 'utf8'));
    return admin.initializeApp({ credential: admin.credential.cert(serviceAccount), projectId });
  }

  return admin.initializeApp({ credential: admin.credential.applicationDefault(), projectId });
}

async function main() {
  initAdmin();
  const db = admin.firestore();

  console.log('🔍 Checking all collections in Firestore...\n');

  // List all collections
  const collections = await db.listCollections();
  
  for (const collectionRef of collections) {
    const collectionName = collectionRef.id;
    console.log(`📁 Collection: ${collectionName}`);
    
    const snapshot = await collectionRef.get();
    let frenchCount = 0;
    let totalCount = 0;
    
    snapshot.forEach(doc => {
      totalCount++;
      const data = doc.data();
      
      // Check for French text in localized fields
      function checkForFrench(obj, path = '') {
        if (typeof obj === 'object' && obj !== null) {
          if (obj.fr && obj.en) {
            if (obj.fr === obj.en && /[àâäéèêëïîôöùûüÿç]/i.test(obj.fr)) {
              frenchCount++;
              console.log(`  🇫🇷 ${doc.id}.${path}: "${obj.fr.substring(0, 50)}..."`);
            }
          } else {
            for (const [key, value] of Object.entries(obj)) {
              checkForFrench(value, path ? `${path}.${key}` : key);
            }
          }
        }
      }
      
      checkForFrench(data);
    });
    
    console.log(`  📊 ${totalCount} documents, ${frenchCount} with French text in EN fields\n`);
  }
}

main().catch((err) => {
  process.stderr.write(String(err?.stack || err));
  process.stderr.write('\n');
  process.exit(1);
});
