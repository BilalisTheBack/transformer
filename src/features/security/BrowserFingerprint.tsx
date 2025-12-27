import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Fingerprint,
  Monitor,
  Globe,
  Cpu,
  Copy,
  Check,
  Shield,
  Layers,
  Trash2,
  Lock,
} from "lucide-react";

export default function BrowserFingerprint() {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [permissions, setPermissions] = useState<{
    camera?: string;
    microphone?: string;
    geolocation?: string;
    notifications?: string;
  }>({});

  const [info, setInfo] = useState<{
    userAgent: string;
    language: string;
    platform: string;
    screenRes: string;
    colorDepth: number;
    pixelRatio: number;
    cores: number;
    memory?: number;
    timezone: string;
    cookiesEnabled: boolean;
    online: boolean;
  } | null>(null);

  useEffect(() => {
    setInfo({
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenRes: `${window.screen.width} x ${window.screen.height}`,
      colorDepth: window.screen.colorDepth,
      pixelRatio: window.devicePixelRatio,
      cores: navigator.hardwareConcurrency,
      // @ts-ignore
      memory: navigator.deviceMemory,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      cookiesEnabled: navigator.cookieEnabled,
      online: navigator.onLine,
    });

    // Check permissions
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    const perms: {
      camera?: string;
      microphone?: string;
      geolocation?: string;
      notifications?: string;
    } = {};

    try {
      const camera = await navigator.permissions.query({
        name: "camera" as PermissionName,
      });
      perms.camera = camera.state;
    } catch {
      perms.camera = "unknown";
    }

    try {
      const mic = await navigator.permissions.query({
        name: "microphone" as PermissionName,
      });
      perms.microphone = mic.state;
    } catch {
      perms.microphone = "unknown";
    }

    try {
      const geo = await navigator.permissions.query({
        name: "geolocation" as PermissionName,
      });
      perms.geolocation = geo.state;
    } catch {
      perms.geolocation = "unknown";
    }

    try {
      const notif = await navigator.permissions.query({
        name: "notifications" as PermissionName,
      });
      perms.notifications = notif.state;
    } catch {
      perms.notifications = "unknown";
    }

    setPermissions(perms);
  };

  const handleCopy = () => {
    if (info) {
      navigator.clipboard.writeText(JSON.stringify(info, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClearData = async () => {
    try {
      // Clear cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      // Clear localStorage
      localStorage.clear();

      // Clear sessionStorage
      sessionStorage.clear();

      // Clear IndexedDB (for all databases)
      if (indexedDB.databases) {
        const dbs = await indexedDB.databases();
        dbs.forEach((db) => {
          if (db.name) indexedDB.deleteDatabase(db.name);
        });
      }

      // Clear Cache Storage
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }

      setCleared(true);
      setTimeout(() => setCleared(false), 3000);
    } catch (error) {
      console.error("Error clearing data:", error);
    }
  };

  if (!info) return null;

  interface FingerprintItem {
    label: string;
    value: string | number;
    mono?: boolean;
    full?: boolean;
  }

  const getPermissionColor = (state?: string) => {
    switch (state) {
      case "granted":
        return "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400";
      case "denied":
        return "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400";
      case "prompt":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const sections: {
    title: string;
    icon: any;
    color: string;
    items: FingerprintItem[];
  }[] = [
    {
      title: t("fingerprint.browser", "Browser & System"),
      icon: Layers,
      color: "text-blue-500",
      items: [
        { label: "User Agent", value: info.userAgent, mono: true, full: true },
        { label: "Platform", value: info.platform },
        { label: "Cookies Enabled", value: info.cookiesEnabled ? "Yes" : "No" },
      ],
    },
    {
      title: t("fingerprint.screen", "Screen & Display"),
      icon: Monitor,
      color: "text-purple-500",
      items: [
        { label: "Resolution", value: info.screenRes, mono: true },
        { label: "Color Depth", value: `${info.colorDepth}-bit` },
        { label: "Pixel Ratio", value: `${info.pixelRatio}x` },
      ],
    },
    {
      title: t("fingerprint.hardware", "Hardware & Connection"),
      icon: Cpu,
      color: "text-red-500",
      items: [
        { label: "CPU Cores", value: info.cores },
        {
          label: "Memory (RAM)",
          value: info.memory ? `~${info.memory} GB` : "Unknown",
        },
        { label: "Status", value: info.online ? "Online" : "Offline" },
      ],
    },
    {
      title: t("fingerprint.locale", "Locale & Time"),
      icon: Globe,
      color: "text-green-500",
      items: [
        { label: "Language", value: info.language },
        { label: "Timezone", value: info.timezone },
      ],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Fingerprint className="w-8 h-8 text-rose-500" />
            {t("fingerprint.title", "Browser Fingerprint")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t(
              "fingerprint.description",
              "View sensitive information your browser reveals to websites."
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleClearData}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
          >
            {cleared ? (
              <Check className="w-4 h-4" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {cleared
                ? t("fingerprint.cleared", "Cleared!")
                : t("fingerprint.clearData", "Clear Site Data")}
            </span>
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-gray-500" />
            )}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {copied
                ? t("common.clipboard_copy", "Copied!")
                : t("common.copy", "Copy JSON")}
            </span>
          </button>
        </div>
      </div>

      {/* Permissions Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-amber-500" />
          {t("fingerprint.permissions", "Permissions")}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(permissions).map(([key, value]) => (
            <div
              key={key}
              className="flex flex-col items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg"
            >
              <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {key}
              </span>
              <span
                className={`px-2 py-1 rounded text-xs font-medium capitalize ${getPermissionColor(
                  value
                )}`}
              >
                {value || "unknown"}
              </span>
            </div>
          ))}
        </div>
        <button
          onClick={checkPermissions}
          className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          {t("fingerprint.checkPerms", "Check Permissions")}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, idx) => (
          <div
            key={idx}
            className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 ${
              section.items.some((i) => i.full) ? "md:col-span-2" : ""
            }`}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <section.icon className={`w-5 h-5 ${section.color}`} />
              {section.title}
            </h3>
            <div className="space-y-4">
              {section.items.map((item, i) => (
                <div
                  key={i}
                  className={`${
                    item.full ? "block" : "flex justify-between items-center"
                  }`}
                >
                  <dt className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {item.label}
                  </dt>
                  <dd
                    className={`text-sm font-medium text-gray-900 dark:text-gray-100 break-all ${
                      item.mono
                        ? "font-mono bg-gray-50 dark:bg-gray-900/50 p-1.5 rounded"
                        : ""
                    }`}
                  >
                    {item.value}
                  </dd>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 flex gap-4">
        <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400 shrink-0" />
        <div className="space-y-2">
          <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
            {t("fingerprint.privacyNoteTitle", "Did you know?")}
          </h4>
          <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
            {t(
              "fingerprint.privacyNote",
              "Websites use this information to create a 'fingerprint' that can track you across the internet, even if you delete your cookies. This technique relies on the unique combination of your screen resolution, installed fonts, hardware, and browser version."
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
