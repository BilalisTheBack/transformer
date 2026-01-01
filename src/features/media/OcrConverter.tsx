import React, { useState, useEffect, useCallback } from "react";
import Tesseract from "tesseract.js";
import { useTranslation } from "react-i18next";
import {
  ScanText,
  Upload,
  RefreshCw,
  Copy,
  Check,
  X,
  Languages,
  FileText,
  ClipboardList,
} from "lucide-react";

export default function OcrConverter() {
  const { t } = useTranslation();
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState("eng");

  // Paste handler
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.indexOf("image") !== -1) {
          const blob = item.getAsFile();
          if (blob) {
            handleFileChange(blob);
          }
        }
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  const handleFileChange = (file: File) => {
    if (image) URL.revokeObjectURL(image);
    const url = URL.createObjectURL(file);
    setImage(url);
    setText("");
    setProgress(0);
    setStatus("");
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleProcess = async () => {
    if (!image) return;
    setIsProcessing(true);
    setStatus("Initializing...");
    try {
      const result = await Tesseract.recognize(image, language, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(Math.round(m.progress * 100));
            setStatus(`Recognizing... ${Math.round(m.progress * 100)}%`);
          } else {
            setStatus(m.status);
          }
        },
      });
      setText(result.data.text);
      setStatus("Completed");
    } catch (err) {
      setStatus("Error processing image");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const languages = [
    { code: "eng", name: "English" },
    { code: "tur", name: "Türkçe" },
    { code: "fra", name: "Français" },
    { code: "deu", name: "Deutsch" },
    { code: "spa", name: "Español" },
  ];

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6 animate-in fade-in duration-500 pb-24">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
            <ScanText className="w-6 h-6 text-white" />
          </div>
          {t("ocr.title", "OCR (Text Extraction)")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t(
            "ocr.description",
            "Extract text from images using AI. Paste image or upload."
          )}
        </p>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        {/* Input Area */}
        <div className="flex flex-col gap-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm overflow-hidden relative">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-500" />
              Source Image
            </h3>
            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-gray-500" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm px-2 py-1 text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            className={`flex-1 relative rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center
                ${
                  image
                    ? "border-transparent bg-gray-900"
                    : "border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                }
             `}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() =>
              !image && document.getElementById("ocr-upload")?.click()
            }
          >
            {image ? (
              <>
                <img
                  src={image}
                  alt="Source"
                  className="max-w-full max-h-full object-contain"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setImage(null);
                    setText("");
                  }}
                  className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-red-500 rounded-full text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="text-center p-6 space-y-4">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400">
                  <Upload className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    Click or drag image here
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center justify-center gap-1">
                    <ClipboardList className="w-3 h-3" /> You can also paste
                    (Ctrl+V)
                  </p>
                </div>
              </div>
            )}
            <input
              id="ocr-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileChange}
            />
          </div>

          {image && !isProcessing && (
            <button
              onClick={handleProcess}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <ScanText className="w-5 h-5" />
              Extract Text
            </button>
          )}

          {isProcessing && (
            <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
              <div className="w-full max-w-xs bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4 overflow-hidden">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="font-medium text-gray-900 dark:text-gray-100 animate-pulse">
                {status}
              </p>
            </div>
          )}
        </div>

        {/* Output Area */}
        <div className="flex flex-col gap-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm relative">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-500" />
              Extracted Text
            </h3>
            {text && (
              <button
                onClick={copyToClipboard}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                title="Copy Text"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            )}
          </div>

          <div className="flex-1 min-h-[200px] relative">
            {text ? (
              <textarea
                readOnly
                value={text}
                className="w-full h-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl resize-none outline-none font-sans text-sm md:text-base leading-relaxed text-gray-800 dark:text-gray-200"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-xl">
                <FileText className="w-12 h-12 mb-2 opacity-50" />
                <p>Extracted text will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
