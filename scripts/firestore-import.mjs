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

function isPlainObject(v) {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function isLocalized(v) {
  return isPlainObject(v) && typeof v.fr === 'string' && typeof v.en === 'string';
}

function collectPatch(value, path, patch) {
  if (isLocalized(value)) {
    patch[path] = value;
    return;
  }

  if (Array.isArray(value)) {
    const hasNestedLocalized = value.some((item) => {
      if (isLocalized(item)) return true;
      if (Array.isArray(item)) return true;
      if (isPlainObject(item)) return true;
      return false;
    });

    if (hasNestedLocalized) {
      patch[path] = value;
    }
    return;
  }

  if (isPlainObject(value)) {
    for (const [k, v] of Object.entries(value)) {
      collectPatch(v, path ? `${path}.${k}` : k, patch);
    }
  }
}

async function main() {
  const input = process.env.FIRESTORE_IMPORT_FILE || 'tmp/firestore-export.json';
  const dryRun = (process.env.DRY_RUN || '').toLowerCase() === 'true';

  initAdmin();
  const db = admin.firestore();

  const absInput = resolve(input);
  if (!existsSync(absInput)) {
    throw new Error(
      `FIRESTORE_IMPORT_FILE not found: ${absInput}\n` +
        `Run: npm run firestore:export (to generate tmp/firestore-export.json) or set FIRESTORE_IMPORT_FILE to an existing file.`
    );
  }

  const json = JSON.parse(readFileSync(absInput, 'utf8'));
  const collections = json?.collections;
  if (!collections || typeof collections !== 'object') {
    throw new Error('Invalid import file: missing collections');
  }

  const summary = { collections: {}, dryRun };

  for (const [collectionName, docs] of Object.entries(collections)) {
    if (!docs || typeof docs !== 'object') continue;

    let updated = 0;
    let scanned = 0;

    for (const [docId, docData] of Object.entries(docs)) {
      scanned += 1;
      const patch = {};
      collectPatch(docData, '', patch);

      const keys = Object.keys(patch).filter((k) => k);
      if (keys.length === 0) continue;

      updated += 1;
      if (!dryRun) {
        await db.collection(collectionName).doc(docId).update(patch);
      }
    }

    summary.collections[collectionName] = { scanned, updated };
  }

  process.stdout.write(JSON.stringify(summary, null, 2));
  process.stdout.write('\n');
}

main().catch((err) => {
  process.stderr.write(String(err?.stack || err));
  process.stderr.write('\n');
  process.exit(1);
});
