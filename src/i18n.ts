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
import ja from "./locales/ja.json";
import zh from "./locales/zh.json";
import ar from "./locales/ar.json";
import ko from "./locales/ko.json";
import hi from "./locales/hi.json";

const resources = {
  en: { translation: en },
  tr: { translation: tr },
  fr: { translation: fr },
  es: { translation: es },
  de: { translation: de },
  it: { translation: it },
  pt: { translation: pt },
  ru: { translation: ru },
  ja: { translation: ja },
  zh: { translation: zh },
  ar: { translation: ar },
  ko: { translation: ko },
  hi: { translation: hi },
};

const savedLanguage = localStorage.getItem("i18nextLng") || "en";

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

// Update document language and direction
i18n.on("languageChanged", (lng) => {
  document.documentElement.lang = lng;
  document.documentElement.dir = i18n.dir(lng);
  localStorage.setItem("i18nextLng", lng);
});

// Initial set
document.documentElement.lang = i18n.language;
document.documentElement.dir = i18n.dir(i18n.language);

export default i18n;
