import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Image as ImageIcon,
  ShieldAlert,
  Download,
  Trash2,
  Info,
  MapPin,
  Smartphone,
} from "lucide-react";
// @ts-ignore
import ExifReader from "exifreader";

export default function ExifCleaner() {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [cleanedPreview, setCleanedPreview] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<any | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setPreview(URL.createObjectURL(uploadedFile));
      setCleanedPreview(null);
      setMetadata(null);

      // Load EXIF
      try {
        const tags = await ExifReader.load(uploadedFile);
        setMetadata(tags);
      } catch (error) {
        console.warn("Failed to read EXIF", error);
      }
    }
  };

  const cleanAndDownload = async () => {
    if (!file || !preview) return;

    const img = new Image();
    img.src = preview;
    await new Promise((resolve) => (img.onload = resolve));

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setCleanedPreview(url);

            const a = document.createElement("a");
            a.href = url;
            a.download = `clean_${file.name}`;
            a.click();
          }
        },
        file.type,
        0.95
      );
    }
  };

  const hasSensitiveData = () => {
    if (!metadata) return false;
    return !!(
      metadata["GPSLatitude"] ||
      metadata["Model"] ||
      metadata["Software"]
    );
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6 animate-in fade-in duration-500 pb-24">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <div className="p-2 bg-red-600 rounded-lg shadow-lg shadow-red-500/20">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          {t("media.exifCleaner.title")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("media.exifCleaner.description")}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
        {/* Input Section */}
        <div className="space-y-6 flex flex-col">
          <div
            className={`flex-1 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-colors ${
              file
                ? "border-red-500 bg-red-50 dark:bg-red-900/10"
                : "border-gray-300 dark:border-gray-700 hover:border-red-500"
            }`}
            onClick={() => document.getElementById("exif-upload")?.click()}
          >
            {file ? (
              <img
                src={preview!}
                alt="Preview"
                className="max-h-64 object-contain rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
              />
            ) : (
              <div className="flex flex-col items-center">
                <ImageIcon className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  {t("media.exifCleaner.uploadLabel")}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {t("media.exifCleaner.supports")}
                </p>
              </div>
            )}
            <input
              id="exif-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />
          </div>

          {metadata && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm max-h-64 overflow-y-auto">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-500" />{" "}
                {t("media.exifCleaner.metadataTitle")}
              </h3>
              <div className="space-y-3">
                {metadata["GPSLatitude"] && (
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-medium p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <MapPin className="w-4 h-4" />{" "}
                    {t("media.exifCleaner.gpsFound")}
                  </div>
                )}
                {metadata["Model"] && (
                  <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 text-sm font-medium p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <Smartphone className="w-4 h-4" />{" "}
                    {t("media.exifCleaner.deviceInfo", {
                      model: metadata["Model"].description,
                    })}
                  </div>
                )}
                <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                  {Object.keys(metadata)
                    .filter((k) => k !== "MakerNote" && k !== "UserComment")
                    .slice(0, 10)
                    .join(", ")}
                  ...
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Section */}
        <div className="flex flex-col justify-center space-y-6">
          {file ? (
            <>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm text-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {t("media.exifCleaner.readyTitle")}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {hasSensitiveData()
                    ? t("media.exifCleaner.sensFound")
                    : t("media.exifCleaner.noSensFound")}
                </p>

                <button
                  onClick={cleanAndDownload}
                  className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-500/25 flex items-center justify-center gap-2 text-lg transition-transform active:scale-95"
                >
                  <Trash2 className="w-5 h-5" />{" "}
                  {t("media.exifCleaner.cleanBtn")}
                </button>
              </div>

              {cleanedPreview && (
                <div className="bg-green-50 dark:bg-green-900/10 rounded-2xl p-6 border border-green-200 dark:border-green-800 text-center animate-in fade-in slide-in-from-bottom-4">
                  <p className="text-green-700 dark:text-green-400 font-medium flex items-center justify-center gap-2 mb-2">
                    <Download className="w-5 h-5" />{" "}
                    {t("media.exifCleaner.success")}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-500">
                    {t("media.exifCleaner.autoDownload")}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
              <p>{t("media.exifCleaner.noImage")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
