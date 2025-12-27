import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { QrCode, Download, Copy, CheckCircle2 } from "lucide-react";
import QRCodeLib from "qrcode";

export default function QrCodeGenerator() {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQr = async () => {
    if (!input.trim()) return;

    try {
      const dataUrl = await QRCodeLib.toDataURL(input, {
        width: size,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      });
      setQrDataUrl(dataUrl);
    } catch (err) {
      console.error("QR generation error:", err);
    }
  };

  const downloadQr = () => {
    if (!qrDataUrl) return;

    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = qrDataUrl;
    link.click();
  };

  const copyToClipboard = async () => {
    if (!qrDataUrl) return;

    try {
      const response = await fetch(qrDataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: copy data URL as text
      await navigator.clipboard.writeText(qrDataUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-app-text flex items-center gap-3">
          <QrCode className="w-8 h-8 text-app-primary" />
          {t("qrCode.title")}
        </h1>
        <p className="text-app-text-sub mt-2">{t("qrCode.description")}</p>
      </header>

      {/* Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-app-text-sub">
          {t("qrCode.inputLabel")}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="https://example.com"
          className="w-full h-24 bg-app-panel border border-app-border rounded-xl p-4 text-app-text font-mono text-sm resize-none focus:outline-none focus:border-app-primary transition-colors"
        />
      </div>

      {/* Options */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-app-text-sub">
            {t("qrCode.size")}:
          </label>
          <select
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="bg-app-panel border border-app-border rounded-lg px-3 py-2 text-app-text text-sm focus:outline-none focus:border-app-primary"
          >
            <option value={128}>128px</option>
            <option value={256}>256px</option>
            <option value={512}>512px</option>
            <option value={1024}>1024px</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-app-text-sub">
            {t("qrCode.foreground")}:
          </label>
          <input
            type="color"
            value={fgColor}
            onChange={(e) => setFgColor(e.target.value)}
            className="w-10 h-10 rounded cursor-pointer border border-app-border"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-app-text-sub">
            {t("qrCode.background")}:
          </label>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="w-10 h-10 rounded cursor-pointer border border-app-border"
          />
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={generateQr}
        className="px-6 py-3 bg-app-primary hover:bg-app-primary-hover text-white font-medium rounded-xl transition-colors"
      >
        {t("qrCode.generate")}
      </button>

      {/* Result */}
      {qrDataUrl && (
        <div className="flex flex-col items-center gap-4 p-6 bg-app-panel border border-app-border rounded-xl">
          <img
            src={qrDataUrl}
            alt="QR Code"
            className="rounded-lg border border-app-border"
            style={{ width: Math.min(size, 300), height: Math.min(size, 300) }}
          />
          <canvas ref={canvasRef} className="hidden" />

          <div className="flex gap-3">
            <button
              onClick={downloadQr}
              className="flex items-center gap-2 px-4 py-2 bg-app-primary hover:bg-app-primary-hover text-white font-medium rounded-xl transition-colors"
            >
              <Download className="w-4 h-4" />
              {t("common.download")}
            </button>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-4 py-2 bg-app-panel border border-app-border hover:border-app-text-mute text-app-text-sub rounded-xl transition-colors"
            >
              {copied ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {t("common.copy")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
