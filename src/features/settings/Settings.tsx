import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../hooks/useTheme";
import { Monitor, Moon, Sun, Globe, Check, FolderOpen } from "lucide-react";
import clsx from "clsx";

export default function Settings() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [downloadPath, setDownloadPath] = useState(
    localStorage.getItem("downloadPath") || "Downloads"
  );

  useEffect(() => {
    localStorage.setItem("downloadPath", downloadPath);
  }, [downloadPath]);

  const languages = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "tr", label: "Türkçe", flag: "🇹🇷" },
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "es", label: "Español", flag: "🇪🇸" },
    { code: "de", label: "Deutsch", flag: "🇩🇪" },
    { code: "it", label: "Italiano", flag: "🇮🇹" },
    { code: "pt", label: "Português", flag: "🇵🇹" },
    { code: "ru", label: "Русский", flag: "🇷🇺" },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold mb-2 text-app-text">
          {t("settings.title")}
        </h1>
        <p className="text-app-text-sub">{t("settings.description")}</p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-app-text">
          <Globe className="w-5 h-5" />
          {t("settings.language")}
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => i18n.changeLanguage(lang.code)}
              className={clsx(
                "flex items-center justify-between p-3 rounded-xl border transition-all",
                i18n.language === lang.code
                  ? "bg-app-primary/10 border-app-primary text-app-primary"
                  : "bg-app-panel border-app-border hover:border-app-text-mute text-app-text-sub hover:text-app-text"
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{lang.flag}</span>
                <span className="font-medium">{lang.label}</span>
              </div>
              {i18n.language === lang.code && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-app-text">
          <Sun className="w-5 h-5" />
          {t("settings.appearance")}
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: "light", label: t("settings.light"), icon: Sun },
            { id: "dark", label: t("settings.dark"), icon: Moon },
            { id: "system", label: t("settings.system"), icon: Monitor },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTheme(item.id as any)}
              className={clsx(
                "flex flex-col items-center justify-center p-4 rounded-xl border transition-all gap-2",
                theme === item.id
                  ? "bg-app-primary/10 border-app-primary text-app-primary"
                  : "bg-app-panel border-app-border hover:border-app-text-mute text-app-text-sub hover:text-app-text"
              )}
            >
              <item.icon className="w-6 h-6" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-app-text">
          <FolderOpen className="w-5 h-5" />
          {t("settings.outputPath")}
        </h2>
        <div className="p-4 bg-app-panel/50 border border-app-border rounded-xl space-y-2">
          <label className="text-sm text-app-text-sub">
            {t("settings.downloadLabel")}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={downloadPath}
              onChange={(e) => setDownloadPath(e.target.value)}
              className="flex-1 bg-app-bg border border-app-border rounded-lg px-4 py-2 text-app-text outline-none focus:border-app-primary transition-colors"
            />
          </div>
          <p className="text-xs text-app-text-mute">{t("settings.pathNote")}</p>
        </div>
      </section>
    </div>
  );
}
