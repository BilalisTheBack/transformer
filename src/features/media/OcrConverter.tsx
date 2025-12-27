import React, { useState } from "react";
import Tesseract from "tesseract.js";
import { ScanText, Upload, RefreshCw, Copy, Check, X } from "lucide-react";

export default function OcrConverter() {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
      setText("");
      setProgress(0);
      setStatus("");
    }
  };

  const handleProcess = async () => {
    if (!image) return;
    setIsProcessing(true);
    try {
      const result = await Tesseract.recognize(
        image,
        "eng", // Default to English, can add multi-language support (tur/fra)
        {
          logger: (m) => {
            if (m.status === "recognizing text") {
              setProgress(Math.round(m.progress * 100));
              setStatus(`Recognizing... ${Math.round(m.progress * 100)}%`);
            } else {
              setStatus(m.status);
            }
          },
        }
      );
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

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg">
            <ScanText className="w-6 h-6 text-white" />
          </div>
          OCR (Text Extraction)
        </h1>
        <p className="text-neutral-400">Extract text from images using AI.</p>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
        {/* Input / Preview */}
        <div className="flex flex-col gap-4 bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
          {!image ? (
            <div
              className="flex-1 border-2 border-dashed border-neutral-700 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500 hover:bg-neutral-800/50 transition-colors"
              onClick={() => document.getElementById("ocr-input")?.click()}
            >
              <Upload className="w-10 h-10 text-neutral-500 mb-4" />
              <p className="text-neutral-300 font-medium">Upload Image</p>
              <input
                id="ocr-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          ) : (
            <div className="relative flex-1 bg-neutral-950 rounded-xl overflow-hidden flex items-center justify-center border border-neutral-800">
              <img
                src={image}
                alt="Preview"
                className="max-w-full max-h-full object-contain"
              />
              <button
                onClick={() => setImage(null)}
                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-red-500/80 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {image && (
            <button
              onClick={handleProcess}
              disabled={isProcessing}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg font-medium flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <ScanText className="w-4 h-4" />
              )}
              {isProcessing ? `Processing... ${progress}%` : "Extract Text"}
            </button>
          )}

          {status && (
            <p className="text-center text-sm text-neutral-500">{status}</p>
          )}
        </div>

        {/* Output */}
        <div className="flex flex-col bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden relative">
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-neutral-900/80">
            <span className="text-sm font-medium text-neutral-400">
              Extracted Text
            </span>
            <button
              onClick={copyToClipboard}
              className="text-neutral-400 hover:text-white"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
          <textarea
            readOnly
            value={text}
            className="flex-1 bg-transparent p-4 resize-none outline-none font-sans text-sm leading-relaxed text-neutral-200"
            placeholder="Extracted text will appear here..."
          />
        </div>
      </div>
    </div>
  );
}
