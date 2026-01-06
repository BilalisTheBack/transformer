const fs = require("fs");
const path = require("path");

const localesDir = path.join(__dirname, "src", "locales");
const enPath = path.join(localesDir, "en.json");
const en = JSON.parse(fs.readFileSync(enPath, "utf8"));

// Basic dictionary for manual overrides if needed (empty for now, relying on fallback)
const manualTranslations = {
  fr: {
    media: {
      compressor: {
        mode: "Mode de Compression",
        auto: "Auto (Taille Cible)",
        manual: "Manuel (Qualité)",
        quality: "Qualité",
        format: "Format de Sortie",
        original: "Original",
      },
    },
  },
  tr: {
    media: {
      compressor: {
        mode: "Sıkıştırma Modu",
        auto: "Otomatik (Hedef Boyut)",
        manual: "Manuel (Kalite)",
        quality: "Kalite",
        format: "Çıktı Formatı",
        original: "Orijinal",
      },
    },
  },
};

function deepMerge(target, source) {
  if (!source) return target;
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && key in target) {
      Object.assign(source[key], deepMerge(target[key], source[key]));
    }
  }
  Object.assign(target || {}, source);
  return target;
}

function syncKeys(source, target) {
  let modified = false;
  for (const key in source) {
    if (typeof source[key] === "object" && source[key] !== null) {
      if (!target[key]) {
        target[key] = {};
        modified = true;
      }
      if (syncKeys(source[key], target[key])) modified = true;
    } else {
      if (target[key] === undefined) {
        target[key] = source[key];
        modified = true;
      }
    }
  }
  return modified;
}

const languages = ["tr", "fr", "es", "de", "it", "pt", "ru"];

languages.forEach((lang) => {
  const langPath = path.join(localesDir, `${lang}.json`);
  if (fs.existsSync(langPath)) {
    let content = JSON.parse(fs.readFileSync(langPath, "utf8"));

    // 1. Structure sync
    let modified = syncKeys(en, content);

    // 2. Manual overrides (Deep merge needed for nested objects)
    if (manualTranslations[lang]) {
      // Very simple nested merge for our known structure
      const manuals = manualTranslations[lang];
      // Helper to restart merge
      const applyManual = (src, dest) => {
        for (const k in src) {
          if (typeof src[k] === "object") {
            if (!dest[k]) dest[k] = {};
            applyManual(src[k], dest[k]);
          } else {
            dest[k] = src[k];
            modified = true;
          }
        }
      };
      applyManual(manuals, content);
    }

    if (modified) {
      fs.writeFileSync(langPath, JSON.stringify(content, null, 2));
      console.log(`Synced ${lang}.json`);
    }
  }
});
