import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Fingerprint, Copy, CheckCircle2, RefreshCw } from "lucide-react";

type UuidVersion = "v4" | "v1-like";

export default function UuidGenerator() {
  const { t } = useTranslation();
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(5);
  const [version, setVersion] = useState<UuidVersion>("v4");
  const [copied, setCopied] = useState<number | null>(null);
  const [uppercase, setUppercase] = useState(false);
  const [noDashes, setNoDashes] = useState(false);

  const generateUuidV4 = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const generateUuidV1Like = () => {
    const now = Date.now();
    const timeHex = now.toString(16).padStart(12, "0");
    const randomPart = "xxxxxxxx".replace(/x/g, () =>
      Math.floor(Math.random() * 16).toString(16)
    );
    return `${timeHex.slice(0, 8)}-${timeHex.slice(8, 12)}-1${randomPart.slice(
      0,
      3
    )}-${randomPart.slice(3, 7)}-${randomPart}${Math.random()
      .toString(16)
      .slice(2, 6)}`;
  };

  const generate = () => {
    const newUuids: string[] = [];
    for (let i = 0; i < count; i++) {
      let uuid = version === "v4" ? generateUuidV4() : generateUuidV1Like();
      if (uppercase) uuid = uuid.toUpperCase();
      if (noDashes) uuid = uuid.replace(/-/g, "");
      newUuids.push(uuid);
    }
    setUuids(newUuids);
  };

  const copyToClipboard = (index: number, uuid: string) => {
    navigator.clipboard.writeText(uuid);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join("\n"));
    setCopied(-1);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-app-text flex items-center gap-3">
          <Fingerprint className="w-8 h-8 text-app-primary" />
          {t("uuid.title")}
        </h1>
        <p className="text-app-text-sub mt-2">{t("uuid.description")}</p>
      </header>

      {/* Options */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Count */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-app-text-sub">
            {t("uuid.count")}:
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={count}
            onChange={(e) =>
              setCount(
                Math.min(100, Math.max(1, parseInt(e.target.value) || 1))
              )
            }
            className="w-20 bg-app-panel border border-app-border rounded-lg px-3 py-2 text-app-text text-sm focus:outline-none focus:border-app-primary"
          />
        </div>

        {/* Version */}
        <div className="flex bg-app-panel border border-app-border rounded-xl p-1">
          <button
            onClick={() => setVersion("v4")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              version === "v4"
                ? "bg-app-primary text-white"
                : "text-app-text-sub hover:text-app-text"
            }`}
          >
            UUID v4
          </button>
          <button
            onClick={() => setVersion("v1-like")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              version === "v1-like"
                ? "bg-app-primary text-white"
                : "text-app-text-sub hover:text-app-text"
            }`}
          >
            UUID v1
          </button>
        </div>

        {/* Checkboxes */}
        <label className="flex items-center gap-2 text-sm text-app-text-sub cursor-pointer">
          <input
            type="checkbox"
            checked={uppercase}
            onChange={(e) => setUppercase(e.target.checked)}
            className="rounded border-app-border"
          />
          {t("uuid.uppercase")}
        </label>

        <label className="flex items-center gap-2 text-sm text-app-text-sub cursor-pointer">
          <input
            type="checkbox"
            checked={noDashes}
            onChange={(e) => setNoDashes(e.target.checked)}
            className="rounded border-app-border"
          />
          {t("uuid.noDashes")}
        </label>
      </div>

      {/* Generate Button */}
      <button
        onClick={generate}
        className="flex items-center gap-2 px-6 py-3 bg-app-primary hover:bg-app-primary-hover text-white font-medium rounded-xl transition-colors"
      >
        <RefreshCw className="w-5 h-5" />
        {t("uuid.generate")}
      </button>

      {/* Results */}
      {uuids.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-app-text-sub">
              {t("uuid.generated")} ({uuids.length})
            </span>
            <button
              onClick={copyAll}
              className="flex items-center gap-2 text-sm text-app-text-sub hover:text-app-primary transition-colors"
            >
              {copied === -1 ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {t("uuid.copyAll")}
            </button>
          </div>

          {uuids.map((uuid, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-app-panel border border-app-border rounded-xl"
            >
              <code className="font-mono text-sm text-app-text">{uuid}</code>
              <button
                onClick={() => copyToClipboard(index, uuid)}
                className="p-2 text-app-text-sub hover:text-app-primary transition-colors"
              >
                {copied === index ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
