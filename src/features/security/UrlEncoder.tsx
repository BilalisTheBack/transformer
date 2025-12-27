import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link2, Copy, ArrowLeftRight, CheckCircle2 } from "lucide-react";

type Mode = "encode" | "decode";

export default function UrlEncoder() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [encodeAll, setEncodeAll] = useState(false);

  const convert = () => {
    try {
      if (mode === "encode") {
        if (encodeAll) {
          // Encode all characters
          setOutput(
            input
              .split("")
              .map(
                (char) =>
                  "%" +
                  char.charCodeAt(0).toString(16).padStart(2, "0").toUpperCase()
              )
              .join("")
          );
        } else {
          setOutput(encodeURIComponent(input));
        }
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch {
      setOutput(t("url.error"));
    }
  };

  const swap = () => {
    setMode(mode === "encode" ? "decode" : "encode");
    setInput(output);
    setOutput("");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-app-text flex items-center gap-3">
          <Link2 className="w-8 h-8 text-app-primary" />
          {t("url.title")}
        </h1>
        <p className="text-app-text-sub mt-2">{t("url.description")}</p>
      </header>

      {/* Mode Toggle */}
      <div className="flex items-center gap-4">
        <div className="flex bg-app-panel border border-app-border rounded-xl p-1">
          <button
            onClick={() => setMode("encode")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === "encode"
                ? "bg-app-primary text-white"
                : "text-app-text-sub hover:text-app-text"
            }`}
          >
            {t("url.encode")}
          </button>
          <button
            onClick={() => setMode("decode")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === "decode"
                ? "bg-app-primary text-white"
                : "text-app-text-sub hover:text-app-text"
            }`}
          >
            {t("url.decode")}
          </button>
        </div>

        {mode === "encode" && (
          <label className="flex items-center gap-2 text-sm text-app-text-sub cursor-pointer">
            <input
              type="checkbox"
              checked={encodeAll}
              onChange={(e) => setEncodeAll(e.target.checked)}
              className="rounded border-app-border"
            />
            {t("url.encodeAll")}
          </label>
        )}
      </div>

      {/* Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-app-text-sub">
          {t("common.input")}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === "encode"
              ? "Hello World! 🌍"
              : "Hello%20World%21%20%F0%9F%8C%8D"
          }
          className="w-full h-32 bg-app-panel border border-app-border rounded-xl p-4 text-app-text font-mono text-sm resize-none focus:outline-none focus:border-app-primary transition-colors"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={convert}
          className="px-6 py-3 bg-app-primary hover:bg-app-primary-hover text-white font-medium rounded-xl transition-colors"
        >
          {mode === "encode" ? t("url.encode") : t("url.decode")}
        </button>
        <button
          onClick={swap}
          className="px-4 py-3 bg-app-panel border border-app-border hover:border-app-text-mute text-app-text-sub rounded-xl transition-colors"
        >
          <ArrowLeftRight className="w-5 h-5" />
        </button>
      </div>

      {/* Output */}
      {output && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-app-text-sub">
              {t("common.output")}
            </label>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 text-sm text-app-text-sub hover:text-app-primary transition-colors"
            >
              {copied ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {t("common.copy")}
            </button>
          </div>
          <pre className="w-full bg-app-panel border border-app-border rounded-xl p-4 text-app-text font-mono text-sm overflow-x-auto whitespace-pre-wrap break-all">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
