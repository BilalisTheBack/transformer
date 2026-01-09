import { useEffect } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

/**
 * Silent auto-update component for PWA.
 * When a new service worker is detected, it automatically
 * updates and reloads the page without any user interaction.
 */
export default function ReloadPrompt() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl: string, r: ServiceWorkerRegistration | undefined) {
      // Check for updates every 30 seconds
      if (r) {
        setInterval(() => {
          r.update();
        }, 30 * 1000);
      }
    },
    onRegisterError(error: unknown) {
      console.error("SW registration error", error);
    },
  });

  // Auto-reload when new content is available
  useEffect(() => {
    if (needRefresh) {
      // Automatically update and reload
      updateServiceWorker(true);
    }
  }, [needRefresh, updateServiceWorker]);

  // No UI needed - everything is automatic
  return null;
}
