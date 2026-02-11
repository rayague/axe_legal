import admin from 'firebase-admin';
import { mkdirSync, writeFileSync, readFileSync } from 'fs';
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
  return (
    isPlainObject(v) &&
    typeof v.fr === 'string' &&
    typeof v.en === 'string'
  );
}

function visit(value, path, report) {
  if (isLocalized(value)) {
    report.localized.total += 1;
    if (!value.en) report.localized.missingEn.push(path);
    if (value.en === value.fr) report.localized.enEqualsFr.push(path);
    return;
  }

  if (typeof value === 'string') {
    report.strings.total += 1;
    return;
  }

  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i += 1) {
      visit(value[i], `${path}[${i}]`, report);
    }
    return;
  }

  if (isPlainObject(value)) {
    for (const [k, v] of Object.entries(value)) {
      visit(v, path ? `${path}.${k}` : k, report);
    }
  }
}

async function exportCollection(db, collection) {
  const snap = await collection.get();
  const out = {};
  for (const docSnap of snap.docs) {
    out[docSnap.id] = docSnap.data();
  }
  return out;
}

async function main() {
  const outputDir = process.env.FIRESTORE_EXPORT_DIR || 'tmp';
  const outputFile = process.env.FIRESTORE_EXPORT_FILE || 'firestore-export.json';
  const reportFile = process.env.FIRESTORE_EXPORT_REPORT_FILE || 'firestore-export-report.json';

  const projectId = process.env.FIREBASE_PROJECT_ID || 'axe-legal-f91cd';

  initAdmin();
  const db = admin.firestore();

  const collections = await db.listCollections();
  const collectionsData = {};

  const report = {
    projectId,
    generatedAt: new Date().toISOString(),
    collectionsScanned: [],
    localized: { total: 0, missingEn: [], enEqualsFr: [] },
    strings: { total: 0 },
  };

  for (const col of collections) {
    const colName = col.id;
    report.collectionsScanned.push(colName);

    const data = await exportCollection(db, col);
    collectionsData[colName] = data;

    for (const [docId, docData] of Object.entries(data)) {
      const docReport = { localized: { total: 0, missingEn: [], enEqualsFr: [] }, strings: { total: 0 } };
      visit(docData, `${colName}/${docId}`, docReport);
      report.localized.total += docReport.localized.total;
      report.strings.total += docReport.strings.total;
      report.localized.missingEn.push(...docReport.localized.missingEn);
      report.localized.enEqualsFr.push(...docReport.localized.enEqualsFr);
    }
  }

  mkdirSync(outputDir, { recursive: true });
  writeFileSync(resolve(outputDir, outputFile), JSON.stringify({ projectId, exportedAt: new Date().toISOString(), collections: collectionsData }, null, 2), 'utf8');
  writeFileSync(resolve(outputDir, reportFile), JSON.stringify(report, null, 2), 'utf8');

  process.stdout.write(`Export OK: ${resolve(outputDir, outputFile)}\n`);
  process.stdout.write(`Report OK: ${resolve(outputDir, reportFile)}\n`);
}

main().catch((err) => {
  process.stderr.write(String(err?.stack || err));
  process.stderr.write('\n');
  process.exit(1);
});
