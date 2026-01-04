import { Github } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const version = "1.2.0"; // You might want to get this from package.json in a real app

  return (
    <footer className="w-full border-t border-app-border bg-app-panel py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col md:flex-row items-center gap-2 text-sm text-app-text-sub">
          <span>
            © {currentYear} {t("footer.built_with")}
          </span>
          <a
            href="https://github.com/BilalisTheBack"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-app-primary hover:underline hover:text-app-primary/80 transition-colors"
          >
            BilalisTheBack
          </a>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-xs text-app-text-sub bg-app-bg px-2 py-1 rounded-md border border-app-border">
            {t("footer.version", { version })}
          </span>
          <a
            href="https://github.com/BilalisTheBack/transformer"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-medium text-app-text-sub hover:text-app-text transition-colors"
          >
            <Github className="w-4 h-4" />
            {t("footer.github")}
          </a>
        </div>
      </div>
    </footer>
  );
}
