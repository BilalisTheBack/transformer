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
    recent_tools: "Outils Récents",
    recent_tools_favorites: "Favoris",
    featured_tools: "Outils à la Une",
    launch_tool: "Lancer l'Outil",
    search_placeholder: "Tapez une commande ou recherchez...",
    common: {
      press: "Appuyez sur",
      to_search: "pour chercher",
      convert: "Convertir",
      copy: "Copier",
      copied: "Copié !",
      clear: "Effacer",
      download: "Télécharger",
      generate: "Générer",
      reset: "Réinitialiser",
      remove: "Supprimer",
      close: "Fermer",
      input: "Entrée",
      output: "Sortie",
      clipboard_copy: "Copié dans le presse-papier !",
      error: "Erreur",
    },
    categories: {
      converters: "Convertisseurs",
      media: "Médias & Images",
      text: "Texte & Code",
      developer: "Outils Développeur",
      security: "Outils de Sécurité",
      visual: "Visuel & CSS",
      network: "Outils Réseau",
      seo: "SEO & Outils Web",
    },
    commands: {
      "json-csv": "Convertisseur JSON ↔ CSV",
      "img-conv": "Convertisseur d'Image (WebP)",
      "img-format": "Format d'Image (PNG ↔ JPG)",
      "text-md": "Éditeur Markdown & Aperçu",
      "text-diff": "Visualiseur de Diff de Texte",
      "log-analyzer": "Analyseur de Fichiers Log",
      "json-ts": "JSON vers TypeScript",
      "xml-json": "Convertisseur XML ↔ JSON",
      "yaml-json": "Convertisseur YAML ↔ JSON",
      config: "Convertisseur de Config",
      curl: "cURL vers Code",
      svg: "SVG vers JSX",
      color: "Convertisseur de Couleur",
      ocr: "OCR (Extraction de Texte)",
      "excel-csv": "Convertisseur Excel ↔ CSV",
      "img-pdf": "Image vers PDF",
      "pdf-img": "PDF vers Image",
      "exif-cleaner": "Nettoyeur EXIF",
      "http-status": "Codes d'État HTTP",
      "user-agent": "Analyseur User-Agent",
      "cron-generator": "Générateur Cron",
      "env-generator": "Générateur de Fichier .env",
      "mock-data": "Générateur de Données Mock",
      "password-strength": "Vérificateur de Force de Mdp",
      "jwt-generator": "Générateur JWT",
      "csrf-token": "Générateur de Token CSRF",
      "secure-key": "Générateur de Clé Sécurisée",
      "email-header": "Analyseur d'En-tête Email",
      gradient: "Générateur de Dégradés",
      glassmorphism: "Générateur de Glassmorphism",
      neumorphism: "Générateur de Neumorphism",
      clamp: "Générateur CSS Clamp",
      "font-pairing": "Outil d'Association de Polices",
      bgRemover: "Suppresseur de Fond IA",
      compress: "Compresseur d'Image",
      crop: "Redimensionner & Rogner",
      minifier: "Minificateur de Code",
      beautifier: "Embellisseur de Code",
      validator: "Validateur JSON",
      "text-case": "Convertisseur de Casse",
      "meta-tags": "Générateur de Balises Meta",
      "robots-txt": "Générateur Robots.txt",
      sitemap: "Générateur Sitemap.xml",
      "page-speed": "Checklist Vitesse de Page",
      "seo-preview": "Aperçu SEO",
      settings: "Paramètres",
    },
    bgRemover: { title: "Suppresseur de Fond IA" },
    lorem: { title: "Générateur Lorem Ipsum" },
    metadata: { title: "Visualiseur de Métadonnées" },
    regex: { title: "Testeur Regex" },
    fingerprint: { title: "Empreinte Navigateur" },
    password: { title: "Générateur de Mot de Passe" },
    boxShadow: { title: "Générateur d'Ombre" },
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
      tips: "Conseils de Sécurité",
      tipsList: {
        mix: "Mélangez lettres, chiffres et symboles",
        length: "12+ caractères recommandés",
        common: "Évitez les mots courants",
        passphrase: "Utilisez une phrase au lieu d'un seul mot",
        unique: "Utilisez un mdp unique pour chaque compte",
      },
    },
  },
  tr: {
    home: {
      subtitle:
        "Geliştiriciler, tasarımcılar ve web yöneticileri için güçlü araç koleksiyonu.",
    },
    recent_tools: "Son Kullanılanlar",
    recent_tools_favorites: "Favoriler",
    featured_tools: "Öne Çıkan Araçlar",
    launch_tool: "Aracı Başlat",
    search_placeholder: "Bir komut yazın veya arayın...",
    common: {
      press: "Basın",
      to_search: "aramak için",
      convert: "Dönüştür",
      copy: "Kopyala",
      copied: "Kopyalandı!",
      clear: "Temizle",
      download: "İndir",
      generate: "Oluştur",
      reset: "Sıfırla",
      remove: "Kaldır",
      close: "Kapat",
      input: "Giriş",
      output: "Çıktı",
      clipboard_copy: "Panoya kopyalandı!",
      error: "Hata",
    },
    categories: {
      converters: "Dönüştürücüler",
      media: "Medya ve Resim",
      text: "Metin ve Kod",
      developer: "Geliştirici Araçları",
      security: "Güvenlik Araçları",
      visual: "Görsel ve CSS",
      network: "Ağ Araçları",
      seo: "SEO ve Web Tools",
    },
    commands: {
      "json-csv": "JSON ↔ CSV Dönüştürücü",
      "img-conv": "Resim Dönüştürücü (WebP)",
      "img-format": "Resim Formatı (PNG ↔ JPG)",
      "text-md": "Markdown Editör ve Önizleme",
      "text-diff": "Metin Karşılaştırma",
      "log-analyzer": "Log Dosyası Analizörü",
      "json-ts": "JSON'dan TypeScript'e",
      "xml-json": "XML ↔ JSON Dönüştürücü",
      "yaml-json": "YAML ↔ JSON Dönüştürücü",
      config: "Config Dönüştürücü",
      curl: "cURL'den Koda",
      svg: "SVG'den JSX'e",
      color: "Renk Dönüştürücü",
      ocr: "OCR (Metin Çıkarma)",
      "excel-csv": "Excel ↔ CSV Dönüştürücü",
      "img-pdf": "Resimden PDF'e",
      "pdf-img": "PDF'den Resme",
      "exif-cleaner": "EXIF Temizleyici",
      "http-status": "HTTP Durum Kodları",
      "user-agent": "User-Agent Analizörü",
      "cron-generator": "Cron Oluşturucu",
      "env-generator": ".env Dosyası Oluşturucu",
      "mock-data": "Mock Veri Oluşturucu",
      "password-strength": "Şifre Gücü Kontrolü",
      "jwt-generator": "JWT Oluşturucu",
      "csrf-token": "CSRF Token Oluşturucu",
      "secure-key": "Güvenli Anahtar Oluşturucu",
      "email-header": "E-posta Başlığı Analizörü",
      gradient: "Gradyan Oluşturucu",
      glassmorphism: "Glassmorphism Oluşturucu",
      neumorphism: "Neumorphism Oluşturucu",
      clamp: "CSS Clamp Oluşturucu",
      "font-pairing": "Yazı Tipi Eşleştirme",
      bgRemover: "AI Arka Plan Silici",
      compress: "Resim Sıkıştırıcı",
      crop: "Yeniden Boyutlandır ve Kırp",
      minifier: "Kod Küçültücü",
      beautifier: "Kod Güzelleştirici",
      validator: "JSON Doğrulayıcı",
      "text-case": "Metin Büyük/Küçük Harf",
      "meta-tags": "Meta Etiketi Oluşturucu",
      "robots-txt": "Robots.txt Oluşturucu",
      sitemap: "Sitemap.xml Oluşturucu",
      "page-speed": "Sayfa Hızı Kontrolü",
      "seo-preview": "SEO Önizleme",
      settings: "Ayarlar",
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
      placeholder: "Şifrenizi buraya yazın...",
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
        length: "Güvenlik için uzunluğu artırın",
        repeats: "Karakter tekrarlarından kaçının",
      },
      tips: "Şifre Güvenliği İpuçları",
      tipsList: {
        mix: "Harf, rakam ve sembol karıştırın",
        length: "12+ karakter önerilir",
        common: "Yaygın kelimelerden kaçının",
        passphrase: "Bir cümle kullanın",
        unique: "Her hesap için farklı şifre kullanın",
      },
    },
  },
};

function syncKeys(source, target) {
  let modified = false;
  for (const key in source) {
    if (typeof source[key] === "object" && source[key] !== null) {
      if (!target[key] || typeof target[key] !== "object") {
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
  let content = {};
  if (fs.existsSync(langPath)) {
    // We intentionally start with an empty object for TR and FR if they were corrupted
    // but to be safer, let's just use the current content and trust the manual overrides.
    // However, the user said they are "mixed".
    // Let's clear TR and FR specifically to rebuild them.
    if (lang === "tr" || lang === "fr") {
      content = {};
    } else {
      content = JSON.parse(fs.readFileSync(langPath, "utf8"));
    }
  }

  // 1. Structure sync (fill missing from EN)
  syncKeys(en, content);

  // 2. Manual overrides
  if (manualTranslations[lang]) {
    const manuals = manualTranslations[lang];
    const applyManual = (src, dest) => {
      for (const k in src) {
        if (typeof src[k] === "object" && src[k] !== null) {
          if (!dest[k] || typeof dest[k] !== "object") dest[k] = {};
          applyManual(src[k], dest[k]);
        } else {
          dest[k] = src[k];
        }
      }
    };
    applyManual(manuals, content);
  }

  fs.writeFileSync(langPath, JSON.stringify(content, null, 2));
  console.log(`Synced ${lang}.json`);
});
