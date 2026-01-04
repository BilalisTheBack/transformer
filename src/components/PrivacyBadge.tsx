import { ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function PrivacyBadge({
  className = "",
}: {
  className?: string;
}) {
  const { t } = useTranslation();

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-xs font-medium cursor-help ${className}`}
      title={t("common.local_processing_desc")}
    >
      <ShieldCheck className="w-3.5 h-3.5" />
      <span>{t("common.local_processing")}</span>
    </div>
  );
}
