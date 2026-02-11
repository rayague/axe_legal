/**
 * Helpers for localized fields stored in Firebase.
 * Supports progressive migration: fields can be either strings (old format) or { fr, en } objects.
 * Always falls back to French if English is missing.
 */

export type LocalizedString = { fr: string; en: string } | string;

/**
 * Safely extract a localized field.
 * - If field is a string, return it (old format)
 * - If field is { fr, en }, return the language version
 * - Fallback to French if English missing
 * - Final fallback to empty string
 */
export const pickLocalizedString = (
  field: LocalizedString | undefined,
  lang: 'fr' | 'en'
): string => {
  if (!field) return '';
  if (typeof field === 'string') return field;
  if (typeof field === 'object' && field !== null) {
    if (lang === 'en' && field.en) return field.en;
    if (field.fr) return field.fr;
    // fallback: if requested language not available, try the other one
    if (lang === 'fr' && field.en) return field.en;
    if (lang === 'en' && field.fr) return field.fr;
  }
  return '';
};

/**
 * Helper to get current language from i18next instance, normalized to 'fr' | 'en'
 */
export const getCurrentLang = (i18n?: { language: string }): 'fr' | 'en' => {
  if (!i18n || typeof i18n.language !== 'string') {
    return 'fr'; // fallback to French if i18n not available
  }
  const lng = i18n.language;
  return lng?.startsWith('en') ? 'en' : 'fr';
};
