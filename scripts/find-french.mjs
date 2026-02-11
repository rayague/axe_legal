import { readFileSync } from 'fs';

const data = JSON.parse(readFileSync('tmp/firestore-export.json', 'utf8'));

function findFrenchFields(obj, path = '', docId = '', collection = '') {
  const frenchFields = [];
  
  if (typeof obj === 'object' && obj !== null) {
    if (obj.fr && obj.en) {
      if (obj.fr === obj.en && /[àâäéèêëïîôöùûüÿç]/i.test(obj.fr)) {
        frenchFields.push({
          collection,
          docId,
          path,
          french: obj.fr.length > 80 ? obj.fr.substring(0, 80) + '...' : obj.fr
        });
      }
    } else {
      for (const [k, v] of Object.entries(obj)) {
        frenchFields.push(...findFrenchFields(v, path ? `${path}.${k}` : k, docId, collection));
      }
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((item, i) => {
      frenchFields.push(...findFrenchFields(item, `${path}[${i}]`, docId, collection));
    });
  }
  
  return frenchFields;
}

const allFrench = [];
for (const [collection, docs] of Object.entries(data.collections)) {
  for (const [docId, docData] of Object.entries(docs)) {
    allFrench.push(...findFrenchFields(docData, '', docId, collection));
  }
}

console.log(`🔍 ${allFrench.length} champs à corriger :\n`);
allFrench.forEach((field, i) => {
  console.log(`${(i + 1).toString().padStart(2, ' ')}. ${field.collection}/${field.docId}.${field.path}`);
  console.log(`     🇫🇷 "${field.french}"`);
  console.log();
});
