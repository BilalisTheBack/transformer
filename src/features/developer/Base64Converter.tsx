import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Binary,
  Copy,
  ArrowLeftRight,
  CheckCircle2,
  Image as ImageIcon,
} from "lucide-react";

type Mode = "encode" | "decode";
type InputType = "text" | "file";

export default function Base64Converter() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>("encode");
  const [inputType, setInputType] = useState<InputType>("text");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleConvert = () => {
    try {
      if (mode === "encode") {
        const encoded = btoa(unescape(encodeURIComponent(input)));
        setOutput(encoded);
      } else {
        const decoded = decodeURIComponent(escape(atob(input)));
        setOutput(decoded);

        // Check if it's an image
        if (
          input.startsWith("data:image") ||
          /^iVBOR|^\/9j\/|^R0lGOD/.test(input)
        ) {
          const imgData = input.startsWith("data:")
            ? input
            : `data:image/png;base64,${input}`;
          setImagePreview(imgData);
        } else {
          setImagePreview(null);
        }
      }
    } catch {
      setOutput(t("base64.error"));
      setImagePreview(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setOutput(result);
      if (file.type.startsWith("image/")) {
        setImagePreview(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const swapMode = () => {
    setMode(mode === "encode" ? "decode" : "encode");
    setInput(output);
    setOutput("");
    setImagePreview(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-app-text flex items-center gap-3">
          <Binary className="w-8 h-8 text-app-primary" />
          {t("base64.title")}
        </h1>
        <p className="text-app-text-sub mt-2">{t("base64.description")}</p>
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
            {t("base64.encode")}
          </button>
          <button
            onClick={() => setMode("decode")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === "decode"
                ? "bg-app-primary text-white"
                : "text-app-text-sub hover:text-app-text"
            }`}
          >
            {t("base64.decode")}
          </button>
        </div>

        {mode === "encode" && (
          <div className="flex bg-app-panel border border-app-border rounded-xl p-1">
            <button
              onClick={() => setInputType("text")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                inputType === "text"
                  ? "bg-app-primary text-white"
                  : "text-app-text-sub hover:text-app-text"
              }`}
            >
              {t("base64.text")}
            </button>
            <button
              onClick={() => setInputType("file")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                inputType === "file"
                  ? "bg-app-primary text-white"
                  : "text-app-text-sub hover:text-app-text"
              }`}
            >
              {t("base64.file")}
            </button>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-app-text-sub">
          {t("common.input")}
        </label>
        {inputType === "file" && mode === "encode" ? (
          <label className="flex flex-col items-center justify-center w-full h-32 bg-app-panel border-2 border-dashed border-app-border rounded-xl cursor-pointer hover:border-app-primary transition-colors">
            <ImageIcon className="w-8 h-8 text-app-text-mute mb-2" />
            <span className="text-app-text-sub text-sm">
              {t("base64.dropFile")}
            </span>
            <input type="file" className="hidden" onChange={handleFileUpload} />
          </label>
        ) : (
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? "Hello World" : "SGVsbG8gV29ybGQ="}
            className="w-full h-32 bg-app-panel border border-app-border rounded-xl p-4 text-app-text font-mono text-sm resize-none focus:outline-none focus:border-app-primary transition-colors"
          />
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleConvert}
          className="px-6 py-3 bg-app-primary hover:bg-app-primary-hover text-white font-medium rounded-xl transition-colors"
        >
          {mode === "encode" ? t("base64.encode") : t("base64.decode")}
        </button>
        <button
          onClick={swapMode}
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

          {/* Image Preview */}
          {imagePreview && (
            <div className="bg-app-panel border border-app-border rounded-xl p-4">
              <span className="text-sm font-medium text-app-text-sub block mb-3">
                {t("base64.preview")}
              </span>
              <img
                src={imagePreview}
                alt="Preview"
                className="max-w-full max-h-64 rounded-lg"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
