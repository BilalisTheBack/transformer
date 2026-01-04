import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Upload,
  Image as ImageIcon,
  Download,
  RefreshCw,
  Eraser,
  Layers,
  X,
  AlertTriangle,
} from "lucide-react";
import PrivacyBadge from "../../components/PrivacyBadge";

export default function BgRemover() {
  const { t } = useTranslation();
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (file: File) => {
    if (file) {
      if (image) URL.revokeObjectURL(image);
      if (result) URL.revokeObjectURL(result);

      const url = URL.createObjectURL(file);
      setImage(url);
      setResult(null);
      setError(null);
    }
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

  const processImage = async () => {
    if (!image) return;
    setIsProcessing(true);
    setError(null);
    try {
      const { removeBackground } = await import("@imgly/background-removal");
      const blob = await removeBackground(image);
      const url = URL.createObjectURL(blob);
      setResult(url);
    } catch (err) {
      console.error(err);
      setError(t("media.bgRemover.error"));
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResult = () => {
    if (result) {
      const link = document.createElement("a");
      link.href = result;
      link.download = "removed-bg.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6 animate-in fade-in duration-500 pb-24">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <div className="p-2 bg-purple-600 rounded-lg shadow-lg shadow-purple-500/20">
            <Eraser className="w-6 h-6 text-white" />
          </div>
          {t("media.bgRemover.title", {
            defaultValue: "AI Background Remover",
          })}
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <p className="text-gray-600 dark:text-gray-400">
            {t("media.bgRemover.description", {
              defaultValue:
                "Remove image backgrounds instantly in your browser. No data leaves your device.",
            })}
          </p>
          <PrivacyBadge />
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        {/* Input Area */}
        <div className="flex flex-col gap-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm overflow-hidden relative">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-blue-500" />
            {t("media.bgRemover.uploadTitle")}
          </h3>

          <div
            className={`flex-1 relative rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center
                ${
                  image
                    ? "border-transparent bg-gray-900"
                    : "border-gray-300 dark:border-gray-600 hover:border-purple-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                }
             `}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() =>
              !image && document.getElementById("bg-upload")?.click()
            }
          >
            {image ? (
              <>
                <img
                  src={image}
                  alt="Original"
                  className="max-w-full max-h-[300px] object-contain"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setImage(null);
                    setResult(null);
                  }}
                  className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-red-500 rounded-full text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="text-center p-6 space-y-4">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto text-purple-600 dark:text-purple-400">
                  <Upload className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {t("media.bgRemover.clickDrop")}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {t("media.bgRemover.supports")}
                  </p>
                </div>
              </div>
            )}
            <input
              id="bg-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileChange}
            />
          </div>

          {image && !result && !isProcessing && (
            <button
              onClick={processImage}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <Layers className="w-5 h-5" />
              {t("media.bgRemover.removeBtn")}
            </button>
          )}

          {isProcessing && (
            <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
              <RefreshCw className="w-10 h-10 text-purple-600 animate-spin mb-4" />
              <p className="font-medium text-gray-900 dark:text-gray-100 animate-pulse">
                {t("media.bgRemover.processing")}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {t("media.bgRemover.localNote")}
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Result Area */}
        <div className="flex flex-col gap-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm overflow-hidden relative">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Layers className="w-5 h-5 text-green-500" />
            {t("media.bgRemover.resultTitle")}
          </h3>

          <div
            className={`flex-1 relative rounded-xl flex items-center justify-center bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI2UzZTNlMyIgLz4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNlM2UzZTMiIC8+Cjwvc3ZnPg==')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iIzMzMyIgLz4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiMzMzMiIC8+Cjwvc3ZnPg==')]`}
          >
            {result ? (
              <img
                src={result}
                alt="Result"
                className="max-w-full max-h-[300px] object-contain animate-in zoom-in-50 duration-300"
              />
            ) : (
              <div className="text-center text-gray-400 dark:text-gray-600">
                <Layers className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>{t("media.bgRemover.resultTitle")}</p>
              </div>
            )}
          </div>

          <button
            onClick={downloadResult}
            disabled={!result}
            className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
            title="Download PNG"
          >
            <Download className="w-5 h-5" />
            {t("media.bgRemover.downloadBtn")}
          </button>
        </div>
      </div>
    </div>
  );
}
