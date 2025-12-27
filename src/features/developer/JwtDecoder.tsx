import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Key, Copy, AlertCircle, CheckCircle2 } from "lucide-react";

export default function JwtDecoder() {
  const { t } = useTranslation();
  const [token, setToken] = useState("");
  const [copied, setCopied] = useState<"header" | "payload" | null>(null);

  const decodeJwt = (jwt: string) => {
    try {
      const parts = jwt.split(".");
      if (parts.length !== 3) {
        return { error: t("jwt.invalidFormat") };
      }

      const decodeBase64 = (str: string) => {
        // Handle URL-safe base64
        const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
        const padding = base64.length % 4;
        const padded = padding ? base64 + "=".repeat(4 - padding) : base64;
        return JSON.parse(atob(padded));
      };

      const header = decodeBase64(parts[0]);
      const payload = decodeBase64(parts[1]);

      return { header, payload, signature: parts[2] };
    } catch {
      return { error: t("jwt.decodeError") };
    }
  };

  const decoded = token.trim() ? decodeJwt(token.trim()) : null;

  const copyToClipboard = (content: object, type: "header" | "payload") => {
    navigator.clipboard.writeText(JSON.stringify(content, null, 2));
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatExpiry = (exp: number) => {
    const date = new Date(exp * 1000);
    const now = new Date();
    const isExpired = date < now;
    return {
      date: date.toLocaleString(),
      isExpired,
      relative: isExpired
        ? t("jwt.expired")
        : t("jwt.expiresIn", {
            time:
              Math.round((date.getTime() - now.getTime()) / 1000 / 60) + " min",
          }),
    };
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-app-text flex items-center gap-3">
          <Key className="w-8 h-8 text-app-primary" />
          {t("jwt.title")}
        </h1>
        <p className="text-app-text-sub mt-2">{t("jwt.description")}</p>
      </header>

      {/* Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-app-text-sub">
          {t("jwt.inputLabel")}
        </label>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          className="w-full h-32 bg-app-panel border border-app-border rounded-xl p-4 text-app-text font-mono text-sm resize-none focus:outline-none focus:border-app-primary transition-colors"
        />
      </div>

      {/* Results */}
      {decoded && (
        <div className="space-y-4">
          {"error" in decoded ? (
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span>{decoded.error}</span>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="bg-app-panel border border-app-border rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-app-border">
                  <span className="font-semibold text-app-text">Header</span>
                  <button
                    onClick={() => copyToClipboard(decoded.header, "header")}
                    className="flex items-center gap-2 text-sm text-app-text-sub hover:text-app-primary transition-colors"
                  >
                    {copied === "header" ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    {t("common.copy")}
                  </button>
                </div>
                <pre className="p-4 text-sm font-mono text-app-text overflow-x-auto">
                  {JSON.stringify(decoded.header, null, 2)}
                </pre>
              </div>

              {/* Payload */}
              <div className="bg-app-panel border border-app-border rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-app-border">
                  <span className="font-semibold text-app-text">Payload</span>
                  <button
                    onClick={() => copyToClipboard(decoded.payload, "payload")}
                    className="flex items-center gap-2 text-sm text-app-text-sub hover:text-app-primary transition-colors"
                  >
                    {copied === "payload" ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    {t("common.copy")}
                  </button>
                </div>
                <pre className="p-4 text-sm font-mono text-app-text overflow-x-auto">
                  {JSON.stringify(decoded.payload, null, 2)}
                </pre>

                {/* Expiry Info */}
                {decoded.payload.exp && (
                  <div className="px-4 py-3 border-t border-app-border bg-app-bg/50">
                    {(() => {
                      const expiry = formatExpiry(decoded.payload.exp);
                      return (
                        <div
                          className={`flex items-center gap-2 text-sm ${
                            expiry.isExpired ? "text-red-400" : "text-green-400"
                          }`}
                        >
                          {expiry.isExpired ? (
                            <AlertCircle className="w-4 h-4" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                          <span>{expiry.date}</span>
                          <span className="text-app-text-mute">
                            ({expiry.relative})
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* Signature */}
              <div className="bg-app-panel border border-app-border rounded-xl p-4">
                <span className="font-semibold text-app-text block mb-2">
                  Signature
                </span>
                <code className="text-sm font-mono text-app-text-sub break-all">
                  {decoded.signature}
                </code>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
