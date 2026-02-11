import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type Lang = 'fr' | 'en';
type Localized = { fr: string; en: string };

const isLocalized = (v: unknown): v is Localized => {
  return (
    typeof v === 'object' &&
    v !== null &&
    'fr' in v &&
    'en' in v &&
    typeof (v as any).fr === 'string' &&
    typeof (v as any).en === 'string'
  );
};

const toLocalized = (v: unknown): Localized | undefined => {
  if (typeof v === 'string') return { fr: v, en: v };
  if (isLocalized(v)) return v;
  return undefined;
};

const toLocalizedArray = (v: unknown): Array<Localized | string> | undefined => {
  if (!Array.isArray(v)) return undefined;
  return v.map((item) => {
    const localized = toLocalized(item);
    return localized ?? item;
  });
};

const migrateDoc = async (collectionName: string, id: string, patch: Record<string, unknown>) => {
  const ref = doc(db, collectionName, id);
  await updateDoc(ref, patch);
};

export async function migrateLocalizedContent(options?: { dryRun?: boolean; langFallback?: Lang }) {
  const dryRun = options?.dryRun ?? false;

  const migrations: Array<{
    collection: string;
    transform: (data: any) => Record<string, unknown>;
  }> = [
    {
      collection: 'services',
      transform: (data) => {
        const patch: Record<string, unknown> = {};

        const fields = ['title', 'description', 'shortDescription', 'pricing', 'duration', 'metaTitle', 'metaDescription'];
        for (const f of fields) {
          const localized = toLocalized(data?.[f]);
          if (localized && !isLocalized(data?.[f])) patch[f] = localized;
        }

        const features = toLocalizedArray(data?.features);
        if (features && Array.isArray(data?.features)) patch.features = features;

        const benefits = toLocalizedArray(data?.benefits);
        if (benefits && Array.isArray(data?.benefits)) patch.benefits = benefits;

        return patch;
      },
    },
    {
      collection: 'team',
      transform: (data) => {
        const patch: Record<string, unknown> = {};
        const role = toLocalized(data?.role);
        if (role && !isLocalized(data?.role)) patch.role = role;
        const bio = toLocalized(data?.bio);
        if (bio && !isLocalized(data?.bio)) patch.bio = bio;
        return patch;
      },
    },
    {
      collection: 'processes',
      transform: (data) => {
        const patch: Record<string, unknown> = {};
        const title = toLocalized(data?.title);
        if (title && !isLocalized(data?.title)) patch.title = title;
        const description = toLocalized(data?.description);
        if (description && !isLocalized(data?.description)) patch.description = description;
        return patch;
      },
    },
    {
      collection: 'testimonials',
      transform: (data) => {
        const patch: Record<string, unknown> = {};
        const role = toLocalized(data?.role);
        if (role && !isLocalized(data?.role)) patch.role = role;
        const content = toLocalized(data?.content);
        if (content && !isLocalized(data?.content)) patch.content = content;
        return patch;
      },
    },
    {
      collection: 'announcements',
      transform: (data) => {
        const patch: Record<string, unknown> = {};
        const title = toLocalized(data?.title);
        if (title && !isLocalized(data?.title)) patch.title = title;
        const subtitle = toLocalized(data?.subtitle);
        if (subtitle && !isLocalized(data?.subtitle)) patch.subtitle = subtitle;
        const content = toLocalized(data?.content);
        if (content && !isLocalized(data?.content)) patch.content = content;
        const linkText = toLocalized(data?.linkText);
        if (linkText && !isLocalized(data?.linkText)) patch.linkText = linkText;
        return patch;
      },
    },
    {
      collection: 'legalCategories',
      transform: (data) => {
        const patch: Record<string, unknown> = {};

        const fields = ['title', 'description', 'guidanceTitle', 'timeline', 'cost', 'warning'];
        for (const f of fields) {
          const localized = toLocalized(data?.[f]);
          if (localized && !isLocalized(data?.[f])) patch[f] = localized;
        }

        if (Array.isArray(data?.steps)) {
          const steps = data.steps.map((s: any) => {
            const next = { ...s };
            const st = toLocalized(s?.title);
            if (st && !isLocalized(s?.title)) next.title = st;
            const sd = toLocalized(s?.description);
            if (sd && !isLocalized(s?.description)) next.description = sd;
            return next;
          });
          patch.steps = steps;
        }

        return patch;
      },
    },
  ];

  const summary: Record<string, { scanned: number; updated: number }> = {};

  for (const mig of migrations) {
    summary[mig.collection] = { scanned: 0, updated: 0 };

    const snap = await getDocs(collection(db, mig.collection));
    for (const d of snap.docs) {
      summary[mig.collection].scanned += 1;

      const data = d.data();
      const patch = mig.transform(data);
      const keys = Object.keys(patch);
      if (keys.length === 0) continue;

      summary[mig.collection].updated += 1;

      if (!dryRun) {
        await migrateDoc(mig.collection, d.id, patch);
      }
    }
  }

  return summary;
}

if (typeof window !== 'undefined') {
  (window as any).migrateLocalizedContent = migrateLocalizedContent;
  // eslint-disable-next-line no-console
  console.log('Pour lancer la migration: await migrateLocalizedContent({ dryRun: true }) puis await migrateLocalizedContent()');
}
