import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import frTranslation from "@/locales/fr/translation.json";
import enTranslation from "@/locales/en/translation.json";

const STORAGE_KEY = "axe_legal_lang";

const getInitialLanguage = () => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "fr" || stored === "en") return stored;
  } catch {
    // ignore
  }
  return "fr";
};

i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: frTranslation },
    en: { translation: enTranslation },
  },
  lng: getInitialLanguage(),
  fallbackLng: "fr",
  interpolation: { escapeValue: false },
});

try {
  document.documentElement.lang = i18n.language || "fr";
} catch {
  // ignore
}

i18n.on("languageChanged", (lng) => {
  if (lng !== "fr" && lng !== "en") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, lng);
  } catch {
    // ignore
  }
  try {
    document.documentElement.lang = lng;
  } catch {
    // ignore
  }
});

export default i18n;
