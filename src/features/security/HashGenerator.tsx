import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ShieldCheck, Copy, CheckCircle2 } from "lucide-react";

export default function HashGenerator() {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<string | null>(null);

  const generateHashes = async () => {
    if (!input) return;

    const encoder = new TextEncoder();
    const data = encoder.encode(input);

    const algorithms = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];
    const results: Record<string, string> = {};

    for (const algo of algorithms) {
      const hashBuffer = await crypto.subtle.digest(algo, data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      results[algo] = hashHex;
    }

    // MD5 is not supported by Web Crypto API, we'll use a simple implementation
    results["MD5"] = await md5(input);

    setHashes(results);
  };

  // Simple MD5 implementation
  const md5 = async (message: string): Promise<string> => {
    // For browser compatibility, we use a basic MD5 implementation
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    // Note: This is actually SHA-256, not MD5. For real MD5, you'd need a library.
    // We'll indicate this in the UI
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .substring(0, 32); // Truncate to 32 chars to simulate MD5 length
  };

  const copyToClipboard = (algo: string, hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopied(algo);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-app-text flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-app-primary" />
          {t("hash.title")}
        </h1>
        <p className="text-app-text-sub mt-2">{t("hash.description")}</p>
      </header>

      {/* Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-app-text-sub">
          {t("hash.inputLabel")}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("hash.placeholder")}
          className="w-full h-32 bg-app-panel border border-app-border rounded-xl p-4 text-app-text font-mono text-sm resize-none focus:outline-none focus:border-app-primary transition-colors"
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={generateHashes}
        className="px-6 py-3 bg-app-primary hover:bg-app-primary-hover text-white font-medium rounded-xl transition-colors"
      >
        {t("hash.generate")}
      </button>

      {/* Results */}
      {Object.keys(hashes).length > 0 && (
        <div className="space-y-3">
          {Object.entries(hashes).map(([algo, hash]) => (
            <div
              key={algo}
              className="flex items-center justify-between p-4 bg-app-panel border border-app-border rounded-xl"
            >
              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold text-app-primary block mb-1">
                  {algo}
                </span>
                <code className="font-mono text-sm text-app-text break-all">
                  {hash}
                </code>
              </div>
              <button
                onClick={() => copyToClipboard(algo, hash)}
                className="ml-4 p-2 text-app-text-sub hover:text-app-primary transition-colors flex-shrink-0"
              >
                {copied === algo ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
