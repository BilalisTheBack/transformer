import { useState } from "react";
import { Key, Copy, Check, RefreshCw, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function CsrfTokenGenerator() {
  const { t } = useTranslation();
  const [tokens, setTokens] = useState<string[]>([]);
  const [length, setLength] = useState(32);
  const [format, setFormat] = useState<"hex" | "base64" | "alphanumeric">(
    "hex"
  );
  const [copied, setCopied] = useState<number | null>(null);

  const generateToken = () => {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);

    let token = "";
    switch (format) {
      case "hex":
        token = Array.from(bytes)
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
        break;
      case "base64":
        token = btoa(String.fromCharCode(...bytes));
        break;
      case "alphanumeric":
        const chars =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        token = Array.from(bytes)
          .map((b) => chars[b % chars.length])
          .join("");
        break;
    }

    return token;
  };

  const addToken = () => {
    setTokens([...tokens, generateToken()]);
  };

  const regenerateAll = () => {
    setTokens(tokens.map(() => generateToken()));
  };

  const copyToken = (token: string, index: number) => {
    navigator.clipboard.writeText(token);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(tokens.join("\n"));
    setCopied(-1);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6 animate-in fade-in duration-500 pb-24">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <div className="p-2 bg-pink-600 rounded-lg shadow-lg shadow-pink-500/20">
            <Key className="w-6 h-6 text-white" />
          </div>
          {t("csrf.title")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("csrf.description")}
        </p>
      </header>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("csrf.length", { length })}
            </label>
            <input
              type="range"
              min="16"
              max="64"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("csrf.format")}
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
            >
              <option value="hex">Hexadecimal</option>
              <option value="base64">Base64</option>
              <option value="alphanumeric">Alphanumeric</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={addToken}
            className="flex-1 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-medium shadow-lg shadow-pink-500/25 transition-colors"
          >
            {t("csrf.generate")}
          </button>
          {tokens.length > 0 && (
            <>
              <button
                onClick={regenerateAll}
                className="px-4 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={() => setTokens([])}
                className="px-4 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tokens List */}
      {tokens.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {t("csrf.generated")} ({tokens.length})
            </h3>
            <button
              onClick={copyAll}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 hover:bg-pink-100 dark:hover:bg-pink-900/30 rounded-lg transition-colors"
            >
              {copied === -1 ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {t("csrf.copyAll")}
            </button>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {tokens.map((token, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg group"
              >
                <code className="flex-1 font-mono text-sm text-gray-900 dark:text-gray-100 break-all">
                  {token}
                </code>
                <button
                  onClick={() => copyToken(token, idx)}
                  className="p-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-all"
                >
                  {copied === idx ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800 text-sm text-blue-900 dark:text-blue-200">
        <p className="font-semibold mb-2">🔒 {t("csrf.securityTitle")}</p>
        <ul className="space-y-1 text-xs">
          {(t("csrf.tips", { returnObjects: true }) as string[]).map(
            (tip, index) => (
              <li key={index}>• {tip}</li>
            )
          )}
        </ul>
      </div>
    </div>
  );
}
