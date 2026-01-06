import { useState } from "react";
import {
  Upload,
  Image as ImageIcon,
  Download,
  Settings,
  RefreshCw,
  Archive,
} from "lucide-react";
// @ts-ignore
import imageCompression from "browser-image-compression";
import { useTranslation } from "react-i18next";

export default function ImageCompressor() {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [mode, setMode] = useState<"auto" | "manual">("auto");
  const [quality, setQuality] = useState(80);
  const [outputFormat, setOutputFormat] = useState<string>("original");
  const [options, setOptions] = useState({
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setCompressedFile(null);
    }
  };

  const handleCompress = async () => {
    if (!file) return;
    setIsCompressing(true);
    try {
      const compressionOptions = {
        ...options,
        initialQuality: mode === "manual" ? quality / 100 : undefined,
        maxSizeMB: mode === "manual" ? 50 : options.maxSizeMB,
        fileType:
          outputFormat === "original" ? undefined : `image/${outputFormat}`,
      };
      const compressed = await imageCompression(file, compressionOptions);
      setCompressedFile(compressed);
    } catch (error) {
      console.error(error);
    } finally {
      setIsCompressing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6 animate-in fade-in duration-500 pb-24">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <div className="p-2 bg-pink-600 rounded-lg shadow-lg shadow-pink-500/20">
            <Archive className="w-6 h-6 text-white" />
          </div>
          {t("media.compressor.title")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("media.compressor.description")}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT: Input & Settings */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("media.compressor.uploadStep")}
            </h3>
            <div
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-pink-500 transition-colors"
              onClick={() => document.getElementById("compress-input")?.click()}
            >
              <Upload className="w-10 h-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("media.compressor.clickSelect")}
              </p>
              <input
                id="compress-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            {file && (
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg flex items-center justify-between">
                <span className="text-sm truncate max-w-[200px]">
                  {file.name}
                </span>
                <span className="text-xs font-mono text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              {t("media.compressor.settingsStep")}
            </h3>
            <div className="space-y-4">
              {/* Mode Toggle */}
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 block mb-2">
                  {t("media.compressor.mode")}
                </label>
                <div className="flex p-1 bg-gray-100 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setMode("auto")}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      mode === "auto"
                        ? "bg-white dark:bg-gray-800 shadow-sm text-pink-600"
                        : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    {t("media.compressor.auto")}
                  </button>
                  <button
                    onClick={() => setMode("manual")}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      mode === "manual"
                        ? "bg-white dark:bg-gray-800 shadow-sm text-pink-600"
                        : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    {t("media.compressor.manual")}
                  </button>
                </div>
              </div>

              {mode === "auto" ? (
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
                    {t("media.compressor.maxSize")}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={options.maxSizeMB}
                    onChange={(e) =>
                      setOptions({
                        ...options,
                        maxSizeMB: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              ) : (
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm text-gray-600 dark:text-gray-400 block">
                      {t("media.compressor.quality")}
                    </label>
                    <span className="text-xs font-mono text-pink-600">
                      {quality}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-600"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
                    {t("media.compressor.maxDimension")}
                  </label>
                  <input
                    type="number"
                    step="100"
                    value={options.maxWidthOrHeight}
                    onChange={(e) =>
                      setOptions({
                        ...options,
                        maxWidthOrHeight: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
                    {t("media.compressor.format")}
                  </label>
                  <select
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                  >
                    <option value="original">
                      {t("media.compressor.original")}
                    </option>
                    <option value="jpeg">{t("media.compressor.jpeg")}</option>
                    <option value="png">{t("media.compressor.png")}</option>
                    <option value="webp">{t("media.compressor.webp")}</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleCompress}
                disabled={!file || isCompressing}
                className="w-full py-2 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                {isCompressing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  t("media.compressor.compressNow")
                )}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Result */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col">
          <h3 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">
            {t("media.compressor.resultStep")}
          </h3>
          <div className="flex-1 rounded-xl bg-gray-100 dark:bg-gray-900/50 flex items-center justify-center overflow-hidden relative min-h-[300px]">
            {compressedFile ? (
              <img
                src={URL.createObjectURL(compressedFile)}
                alt="Compressed"
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="text-gray-400 flex flex-col items-center">
                <ImageIcon className="w-12 h-12 mb-2 opacity-30" />
                <p className="text-sm opacity-50">
                  {t("media.compressor.preview")}
                </p>
              </div>
            )}
          </div>

          {compressedFile && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg border border-green-200 dark:border-green-800">
                <span className="text-sm font-medium">
                  {t("media.compressor.newSize")}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">
                    {(compressedFile.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                  {/* Calculate savings % */}
                  {file && (
                    <span className="text-xs bg-green-200 dark:bg-green-800 px-1.5 py-0.5 rounded text-green-800 dark:text-green-100">
                      -
                      {((1 - compressedFile.size / file.size) * 100).toFixed(0)}
                      %
                    </span>
                  )}
                </div>
              </div>
              <a
                href={URL.createObjectURL(compressedFile)}
                download={`compressed_${compressedFile.name}`}
                className="flex items-center justify-center gap-2 w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:opacity-90 transition-opacity"
              >
                <Download className="w-4 h-4" />
                {t("media.compressor.download")}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
