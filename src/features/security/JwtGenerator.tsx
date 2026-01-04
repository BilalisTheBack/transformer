import { useState } from "react";
import { FileKey, Copy, Check } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function JwtGenerator() {
  const { t } = useTranslation();
  const [header, setHeader] = useState(
    JSON.stringify({ alg: "HS256", typ: "JWT" }, null, 2)
  );
  const [payload, setPayload] = useState(
    JSON.stringify(
      {
        sub: "1234567890",
        name: "John Doe",
        iat: Math.floor(Date.now() / 1000),
      },
      null,
      2
    )
  );
  const [secret, setSecret] = useState("your-256-bit-secret");
  const [algorithm, setAlgorithm] = useState("HS256");
  const [token, setToken] = useState("");
  const [copied, setCopied] = useState(false);

  // Simple HMAC-SHA256 implementation using Web Crypto API
  const generateToken = async () => {
    try {
      const headerObj = JSON.parse(header);
      const payloadObj = JSON.parse(payload);

      // Update algorithm in header
      headerObj.alg = algorithm;

      // Create base64url encoded header and payload
      const base64UrlEncode = (str: string) => {
        return btoa(str)
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=/g, "");
      };

      const headerB64 = base64UrlEncode(JSON.stringify(headerObj));
      const payloadB64 = base64UrlEncode(JSON.stringify(payloadObj));
      const data = `${headerB64}.${payloadB64}`;

      // Create signature using HMAC
      const enc = new TextEncoder();
      const keyData = enc.encode(secret);
      const key = await crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );

      const signature = await crypto.subtle.sign("HMAC", key, enc.encode(data));
      const signatureB64 = base64UrlEncode(
        String.fromCharCode(...new Uint8Array(signature))
      );

      setToken(`${data}.${signatureB64}`);
    } catch (error) {
      console.error("Error generating JWT:", error);
      alert("Error: Invalid JSON in header or payload");
    }
  };

  const copyToken = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatJson = (text: string, setter: (val: string) => void) => {
    try {
      const obj = JSON.parse(text);
      setter(JSON.stringify(obj, null, 2));
    } catch (error) {
      // Keep as is if invalid JSON
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6 animate-in fade-in duration-500 pb-24">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
            <FileKey className="w-6 h-6 text-white" />
          </div>
          {t("jwt.title")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("jwt.description")}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        {/* Input Section */}
        <div className="space-y-4 flex flex-col min-h-0">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("jwt.headerLabel")}
            </label>
            <textarea
              value={header}
              onChange={(e) => setHeader(e.target.value)}
              onBlur={() => formatJson(header, setHeader)}
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Payload */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm flex-1 flex flex-col min-h-0">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("jwt.payloadLabel")}
            </label>
            <textarea
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              onBlur={() => formatJson(payload, setPayload)}
              className="flex-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Secret & Algorithm */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("jwt.algorithm")}
              </label>
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="HS256">HS256 (HMAC-SHA256)</option>
                <option value="HS384">HS384 (HMAC-SHA384)</option>
                <option value="HS512">HS512 (HMAC-SHA512)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("jwt.secretKey")}
              </label>
              <input
                type="text"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder={t("jwt.secretPlaceholder")}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <button
              onClick={generateToken}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 transition-colors"
            >
              {t("jwt.generate")}
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="flex flex-col gap-4 min-h-0">
          {token && (
            <>
              {/* Token Display */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm flex-1 flex flex-col min-h-0">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("jwt.generated")}
                  </label>
                  <button
                    onClick={copyToken}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                  >
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    {copied ? t("common.clipboard_copy") : t("common.copy")}
                  </button>
                </div>
                <div className="flex-1 px-3 py-2 bg-gray-900 dark:bg-black rounded-lg overflow-auto">
                  <code className="text-green-400 font-mono text-xs break-all whitespace-pre-wrap">
                    {token}
                  </code>
                </div>
              </div>

              {/* Token Parts */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {t("jwt.components")}
                </h3>
                <div className="space-y-2">
                  {token.split(".").map((part, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded ${
                          idx === 0
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            : idx === 1
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                            : "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400"
                        }`}
                      >
                        {idx === 0
                          ? "HEADER"
                          : idx === 1
                          ? "PAYLOAD"
                          : "SIGNATURE"}
                      </span>
                      <code className="flex-1 text-xs font-mono text-gray-600 dark:text-gray-400 break-all">
                        {part}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Info */}
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800 text-sm text-amber-900 dark:text-amber-200">
            <p className="font-semibold mb-2">⚠️ {t("jwt.securityTitle")}</p>
            <ul className="space-y-1 text-xs">
              {(t("jwt.securityTips", { returnObjects: true }) as string[]).map(
                (tip, index) => (
                  <li key={index}>• {tip}</li>
                )
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
