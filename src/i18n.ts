import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import tr from "./locales/tr.json";
import fr from "./locales/fr.json";
import es from "./locales/es.json";
import de from "./locales/de.json";
import it from "./locales/it.json";
import pt from "./locales/pt.json";
import ru from "./locales/ru.json";

const resources = {
  en: {
    translation: en,
  },
  tr: {
    translation: tr,
  },
  fr: {
    translation: fr,
  },
  es: {
    translation: es,
  },
  de: {
    translation: de,
  },
  it: {
    translation: it,
  },
  pt: {
    translation: pt,
  },
  ru: {
    translation: ru,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
