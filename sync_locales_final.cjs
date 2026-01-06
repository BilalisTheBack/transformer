const fs = require("fs");
const path = require("path");

const localesDir = path.join(__dirname, "src", "locales");
const enPath = path.join(localesDir, "en.json");
const en = JSON.parse(fs.readFileSync(enPath, "utf8"));

const manualTranslations = {
  fr: {
    home: {
      subtitle:
        "Une collection d'outils puissants pour les développeurs, designers et webmasters.",
    },
    recent_tools: "Outils récents",
    featured_tools: "Outils mis en avant",
    recent_tools_favorites: "Favoris",
    launch_tool: "Lancer l'outil",
    categories: {
      converters: "Convertisseurs",
      media: "Médias et Images",
      text: "Texte et Code",
      developer: "Outils Développeur",
      security: "Sécurité",
      visual: "Visual & CSS",
      network: "Réseau",
      seo: "SEO & Web",
    },
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
    bgRemover: { title: "Suppresseur de Fond AI" },
    lorem: { title: "Générateur Lorem Ipsum" },
    metadata: { title: "Visualiseur de Métadonnées" },
    regex: { title: "Testeur Regex" },
    fingerprint: { title: "Empreinte Navigateur" },
    password: { title: "Générateur de Mot de Passe" },
    boxShadow: { title: "Générateur d'Ombres" },
    passwordChecker: {
      title: "Vérificateur de Force de Mot de Passe",
      description:
        "Analysez la sécurité et la complexité de votre mot de passe",
      enter: "Entrez le Mot de Passe",
      placeholder: "Entrez un mot de passe à vérifier...",
      strength: "Force de Sécurité",
      strengths: {
        weak: "Faible",
        medium: "Moyen",
        strong: "Fort",
        veryStrong: "Très Fort",
      },
      criteria: "Critères de Sécurité",
      chars8: "Au moins 8 caractères",
      chars12: "Au moins 12 caractères",
      uppercase: "Lettres majuscules",
      lowercase: "Lettres minuscules",
      numbers: "Chiffres (0-9)",
      special: "Caractères spéciaux",
      info: "Mesures de Sécurité",
      length: "Longueur du Mot de Passe",
      crackTime: "Temps de Craquage Estimé",
      suggestions: "Suggestions de Sécurité",
      feedback: {
        min8: "Utilisez au moins 8 caractères",
        uppercase: "Ajoutez des lettres majuscules",
        lowercase: "Ajoutez des lettres minuscules",
        numbers: "Ajoutez des chiffres",
        special: "Ajoutez des caractères spéciaux",
        length: "Augmentez la longueur pour une meilleure sécurité",
        repeats: "Évitez les caractères ou séquences répétitifs",
      },
      tips: "Conseils de Sécurité de Mot de Passe",
      tipsList: {
        mix: "Mélangez lettres (A-z), chiffres (0-9) et symboles",
        length: "Plus c'est long, mieux c'est : 12+ caractères recommandés",
        common: "Évitez les mots courants (password, 123456)",
        passphrase: "Utilisez une phrase au lieu d'un seul mot",
        unique: "Utilisez un mot de passe unique pour chaque compte",
      },
    },
  },
  tr: {
    home: {
      subtitle:
        "Geliştiriciler, tasarımcılar ve web yöneticileri için güçlü araç koleksiyonu.",
    },
    recent_tools: "Son Kullanılanlar",
    featured_tools: "Öne Çıkan Araçlar",
    recent_tools_favorites: "Favoriler",
    launch_tool: "Aracı Başlat",
    categories: {
      converters: "Dönüştürücüler",
      media: "Medya ve Resim",
      text: "Metin ve Kod",
      developer: "Geliştirici Araçları",
      security: "Güvenlik Araçları",
      visual: "Görsel ve CSS",
      network: "Ağ Araçları",
      seo: "SEO ve Web",
    },
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
    bgRemover: { title: "AI Arka Plan Silici" },
    lorem: { title: "Lorem Ipsum Oluşturucu" },
    metadata: { title: "Dosya Metadata İzleyici" },
    regex: { title: "Regex Test Edici" },
    fingerprint: { title: "Tarayıcı Parmak İzi" },
    password: { title: "Şifre Oluşturucu" },
    boxShadow: { title: "Box Shadow Oluşturucu" },
    passwordChecker: {
      title: "Şifre Gücü Kontrolü",
      description: "Şifrenizin güvenliğini ve karmaşıklığını analiz edin",
      enter: "Şifreyi Girin",
      placeholder: "Kontrol edilecek şifreyi girin...",
      strength: "Güvenlik Seviyesi",
      strengths: {
        weak: "Zayıf",
        medium: "Orta",
        strong: "Güçlü",
        veryStrong: "Çok Güçlü",
      },
      criteria: "Güvenlik Kriterleri",
      chars8: "En az 8 karakter",
      chars12: "En az 12 karakter",
      uppercase: "Büyük harf",
      lowercase: "Küçük harf",
      numbers: "Rakam (0-9)",
      special: "Özel karakter",
      info: "Güvenlik Metrikleri",
      length: "Şifre Uzunluğu",
      crackTime: "Tahmini Kırılma Süresi",
      suggestions: "Güvenlik Önerileri",
      feedback: {
        min8: "En az 8 karakter kullanın",
        uppercase: "Büyük harf ekleyin",
        lowercase: "Küçük harf ekleyin",
        numbers: "Rakam ekleyin",
        special: "Özel karakter ekleyin",
        length: "Daha iyi güvenlik için uzunluğu artırın",
        repeats: "Tekrar eden karakterlerden veya dizilerden kaçının",
      },
      tips: "Şifre Güvenliği İpuçları",
      tipsList: {
        mix: "Harfleri (A-z), sayıları (0-9) ve sembolleri karıştırın",
        length: "Daha uzun daha iyidir: 12+ karakter önerilir",
        common: "Yaygın kelimelerden kaçının (sifre, 123456)",
        passphrase: "Tek bir kelime yerine bir cümle veya 'parola' kullanın",
        unique: "Her önemli hesap için benzersiz bir şifre kullanın",
      },
    },
  },
};

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

    // 2. Manual overrides
    if (manualTranslations[lang]) {
      const manuals = manualTranslations[lang];
      const applyManual = (src, dest) => {
        for (const k in src) {
          if (typeof src[k] === "object" && src[k] !== null) {
            if (!dest[k]) dest[k] = {};
            applyManual(src[k], dest[k]);
          } else {
            if (dest[k] !== src[k]) {
              dest[k] = src[k];
              modified = true;
            }
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
