import { useState } from "react";
import { Key, Copy, Check, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface GeneratedKey {
  id: string;
  key: string;
  format: string;
  length: number;
}

export default function SecureKeyGenerator() {
  const { t } = useTranslation();
  const [keys, setKeys] = useState<GeneratedKey[]>([]);
  const [length, setLength] = useState(32);
  const [format, setFormat] = useState<"hex" | "base64" | "base64url">("hex");
  const [copied, setCopied] = useState<string | null>(null);

  const generateKey = () => {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);

    let key = "";
    switch (format) {
      case "hex":
        key = Array.from(bytes)
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
        break;
      case "base64":
        key = btoa(String.fromCharCode(...bytes));
        break;
      case "base64url":
        key = btoa(String.fromCharCode(...bytes))
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=/g, "");
        break;
    }

    return key;
  };

  const addKey = (count = 1) => {
    const newKeys = Array.from({ length: count }, () => ({
      id: crypto.randomUUID(),
      key: generateKey(),
      format,
      length,
    }));
    setKeys([...keys, ...newKeys]);
  };

  const removeKey = (id: string) => {
    setKeys(keys.filter((k) => k.id !== id));
  };

  const copyKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const applyPreset = (presetLength: number) => {
    setLength(presetLength);
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6 animate-in fade-in duration-500 pb-24">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <div className="p-2 bg-violet-600 rounded-lg shadow-lg shadow-violet-500/20">
            <Key className="w-6 h-6 text-white" />
          </div>
          {t("secureKey.title")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("secureKey.description")}
        </p>
      </header>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
        {/* Presets */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("secureKey.presets")}
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "128-bit (16 bytes)", value: 16 },
              { label: "256-bit (32 bytes)", value: 32 },
              { label: "512-bit (64 bytes)", value: 64 },
              { label: "1024-bit (128 bytes)", value: 128 },
            ].map((preset) => (
              <button
                key={preset.value}
                onClick={() => applyPreset(preset.value)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  length === preset.value
                    ? "bg-violet-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("secureKey.length", { length, bits: length * 8 })}
            </label>
            <input
              type="range"
              min="16"
              max="256"
              step="8"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("secureKey.format")}
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
            >
              <option value="hex">Hexadecimal</option>
              <option value="base64">Base64</option>
              <option value="base64url">Base64 URL-Safe</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => addKey(1)}
            className="flex-1 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium shadow-lg shadow-violet-500/25 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> {t("secureKey.generate")}
          </button>
          <button
            onClick={() => addKey(5)}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-colors"
          >
            {t("secureKey.generateFive")}
          </button>
        </div>
      </div>

      {/* Keys List */}
      {keys.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4 flex-1 min-h-0">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {t("secureKey.generated")} ({keys.length})
            </h3>
            <button
              onClick={() => setKeys([])}
              className="text-sm text-red-600 dark:text-red-400 hover:underline"
            >
              {t("secureKey.clear")}
            </button>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-96">
            {keys.map((keyItem) => (
              <div
                key={keyItem.id}
                className="flex items-start gap-2 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg group"
              >
                <div className="flex-1 min-w-0">
                  <code className="block font-mono text-sm text-gray-900 dark:text-gray-100 break-all mb-2">
                    {keyItem.key}
                  </code>
                  <div className="flex gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span>{keyItem.length} bytes</span>
                    <span>•</span>
                    <span>{keyItem.format.toUpperCase()}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => copyKey(keyItem.key, keyItem.id)}
                    className="p-2 text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                  >
                    {copied === keyItem.id ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => removeKey(keyItem.id)}
                    className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800 text-sm text-blue-900 dark:text-blue-200">
        <p className="font-semibold mb-2">🔐 {t("secureKey.tipsTitle")}</p>
        <ul className="space-y-1 text-xs">
          {(t("secureKey.tips", { returnObjects: true }) as string[]).map(
            (tip, index) => (
              <li key={index}>• {tip}</li>
            )
          )}
        </ul>
      </div>
    </div>
  );
}
