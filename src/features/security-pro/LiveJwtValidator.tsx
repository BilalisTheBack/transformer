import { useState, useEffect } from "react";
import {
  Key,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Copy,
  Trash2,
  ExternalLink,
  Code2,
  Lock,
  Search,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export default function LiveJwtValidator() {
  const { t } = useTranslation();
  const [token, setToken] = useState("");
  const [decoded, setDecoded] = useState<{
    header: any;
    payload: any;
    signature: string;
    raw: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [secret, setSecret] = useState("");
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  const decodeToken = (jwt: string) => {
    try {
      if (!jwt) {
        setDecoded(null);
        setError(null);
        return;
      }

      const parts = jwt.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid JWT format: Should have 3 parts");
      }

      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      const signature = parts[2];

      setDecoded({ header, payload, signature, raw: parts });
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setDecoded(null);
    }
  };

  useEffect(() => {
    decodeToken(token);
  }, [token]);

  const verifySignature = () => {
    // Simple mock verification simulation
    if (!token || !secret) return;
    setIsVerified(secret === "secret123"); // Demo secret
  };

  const clear = () => {
    setToken("");
    setDecoded(null);
    setError(null);
    setIsVerified(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(JSON.stringify(text, null, 2));
  };

  const getStatusColor = (isExp: boolean) => {
    if (isExp) return "text-red-500 bg-red-500/10 border-red-500/20";
    return "text-green-500 bg-green-500/10 border-green-500/20";
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <div className="p-2 bg-amber-600 rounded-lg shadow-lg shadow-amber-500/20">
            <Key className="w-6 h-6 text-white" />
          </div>
          <span className="gradient-text-optimized">
            {t("securityPro.jwtLive.title")}
          </span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("securityPro.jwtLive.description")}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Panel */}
        <div className="space-y-6">
          <div className="bg-app-panel border border-app-border rounded-2xl p-6 shadow-sm flex flex-col h-full min-h-[500px]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Code2 className="w-5 h-5 text-app-primary" />
                {t("securityPro.jwtLive.input")}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={clear}
                  className="p-2 hover:bg-app-bg text-app-text-sub rounded-lg transition-colors"
                  title={t("securityPro.rateLimit.clear")}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <textarea
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder={t("securityPro.jwtLive.paste")}
              className="flex-1 w-full bg-app-bg border border-app-border rounded-xl p-4 font-mono text-sm resize-none focus:ring-2 focus:ring-app-primary outline-none text-app-text-sub placeholder:opacity-50"
            />

            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-500 text-sm">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            {!decoded && !error && (
              <div className="mt-4 p-4 bg-app-bg/50 border border-app-border rounded-xl flex items-center gap-3 text-app-text-sub text-sm">
                <Search className="w-4 h-4" />
                <p>{t("securityPro.jwtLive.ready")}</p>
              </div>
            )}

            <div className="mt-4 p-4 bg-app-panel border border-app-border rounded-xl text-center">
              <p className="text-[10px] text-app-text-sub italic">
                {t("securityPro.jwtLive.localPrivacy")}
              </p>
            </div>
          </div>
        </div>

        {/* Decoder Panel */}
        <div className="space-y-6">
          {decoded ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              {/* Claims Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`p-4 rounded-2xl border ${getStatusColor(
                    decoded.payload.exp < Date.now() / 1000
                  )}`}
                >
                  <div className="text-[10px] uppercase tracking-widest font-bold opacity-60 mb-1">
                    {t("securityPro.jwtLive.status")}
                  </div>
                  <div className="flex items-center justify-between font-mono">
                    <span>
                      {decoded.payload.exp < Date.now() / 1000
                        ? t("securityPro.jwtLive.invalid")
                        : t("securityPro.jwtLive.active")}
                    </span>
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="p-4 rounded-2xl border border-app-border bg-app-panel">
                  <div className="text-[10px] uppercase tracking-widest font-bold text-app-text-sub mb-1">
                    Algorithm
                  </div>
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-app-primary">
                      {decoded.header.alg}
                    </span>
                    <ShieldCheck className="w-4 h-4 text-app-primary" />
                  </div>
                </div>
              </div>

              {/* Header */}
              <div className="bg-app-panel border border-app-border rounded-2xl p-6 relative group">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase tracking-widest font-bold text-pink-500">
                    {t("securityPro.jwtLive.header")}
                  </span>
                  <button
                    onClick={() => copyToClipboard(decoded.header)}
                    className="p-1 hover:bg-app-bg rounded transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Copy className="w-4 h-4 text-app-text-sub" />
                  </button>
                </div>
                <pre className="text-sm font-mono text-pink-400 overflow-x-auto">
                  {JSON.stringify(decoded.header, null, 2)}
                </pre>
              </div>

              {/* Payload */}
              <div className="bg-app-panel border border-app-border rounded-2xl p-6 relative group">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase tracking-widest font-bold text-blue-500">
                    {t("securityPro.jwtLive.payload")}
                  </span>
                  <button
                    onClick={() => copyToClipboard(decoded.payload)}
                    className="p-1 hover:bg-app-bg rounded transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Copy className="w-4 h-4 text-app-text-sub" />
                  </button>
                </div>
                <pre className="text-sm font-mono text-blue-400 overflow-x-auto">
                  {JSON.stringify(decoded.payload, null, 2)}
                </pre>
              </div>

              {/* Signature Verification */}
              <div className="bg-app-panel border border-app-border rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest font-bold text-emerald-500">
                    Signature
                  </span>
                  {isVerified !== null && (
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isVerified
                          ? "bg-green-500/10 text-green-500"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {isVerified ? "VERIFIED" : "INVALID SIGNATURE"}
                    </span>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-app-text-sub" />
                    <input
                      type="password"
                      value={secret}
                      onChange={(e) => setSecret(e.target.value)}
                      placeholder="Enter HMAC Secret or Public Key"
                      className="w-full bg-app-bg border border-app-border rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-app-primary outline-none"
                    />
                  </div>
                  <button
                    onClick={verifySignature}
                    className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                  >
                    {t("securityPro.jwtLive.decode")}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-app-panel border border-app-border border-dashed rounded-2xl h-full flex flex-col items-center justify-center p-12 text-center text-app-text-sub space-y-4">
              <div className="p-4 bg-app-bg rounded-full">
                <ExternalLink className="w-8 h-8 opacity-20" />
              </div>
              <div>
                <p className="font-semibold text-app-text">
                  {t("securityPro.jwtLive.result")}
                </p>
                <p className="text-sm">{t("securityPro.jwtLive.readyDesc")}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
