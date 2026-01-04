import { useRegisterSW } from "virtual:pwa-register/react";
import { useTranslation } from "react-i18next";
import { RefreshCw, X } from "lucide-react";

export default function ReloadPrompt() {
  const { t } = useTranslation();
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r: ServiceWorkerRegistration | undefined) {
      console.log("SW Registered: " + r);
    },
    onRegisterError(error: unknown) {
      console.log("SW registration error", error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!offlineReady && !needRefresh) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 p-4 bg-app-panel border border-app-border rounded-xl shadow-2xl flex flex-col gap-3 max-w-sm animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-app-text">
            {offlineReady
              ? t("pwa.offline_ready")
              : t("pwa.new_content_available")}
          </h3>
          <p className="text-sm text-app-text-sub mt-1">
            {offlineReady
              ? t("pwa.offline_ready_desc")
              : t("pwa.new_content_desc")}
          </p>
        </div>
        <button
          onClick={close}
          className="text-app-text-sub hover:text-app-text transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {needRefresh && (
        <button
          onClick={() => updateServiceWorker(true)}
          className="w-full py-2 bg-app-primary hover:bg-app-primary-hover text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          {t("pwa.reload")}
        </button>
      )}
    </div>
  );
}
