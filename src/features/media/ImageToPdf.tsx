import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FileText,
  Image as ImageIcon,
  Download,
  Trash2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import jsPDF from "jspdf";

export default function ImageToPdf() {
  const { t } = useTranslation();
  const [images, setImages] = useState<
    { file: File; id: string; preview: string }[]
  >([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map((file) => ({
        file,
        id: crypto.randomUUID(),
        preview: URL.createObjectURL(file),
      }));
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    const newImages = [...images];
    const temp = newImages[index];
    newImages[index] = newImages[index + direction];
    newImages[index + direction] = temp;
    setImages(newImages);
  };

  const generateAndDownloadPdf = async () => {
    if (images.length === 0) return;
    setIsGenerating(true);

    try {
      const doc = new jsPDF();

      for (let i = 0; i < images.length; i++) {
        const imgParams = images[i];

        const imgData = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(imgParams.file);
        });

        const imgProps = doc.getImageProperties(imgData);
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = doc.internal.pageSize.getHeight();

        const ratio = imgProps.width / imgProps.height;
        let finalWidth = pdfWidth;
        let finalHeight = finalWidth / ratio;

        if (finalHeight > pdfHeight) {
          finalHeight = pdfHeight;
          finalWidth = finalHeight * ratio;
        }

        const x = (pdfWidth - finalWidth) / 2;
        const y = (pdfHeight - finalHeight) / 2;

        doc.addImage(imgData, "JPEG", x, y, finalWidth, finalHeight);

        if (i < images.length - 1) {
          doc.addPage();
        }
      }

      doc.save("converted_images.pdf");
    } catch (error) {
      console.error("PDF Generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6 animate-in fade-in duration-500 pb-24">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <div className="p-2 bg-red-600 rounded-lg shadow-lg shadow-red-500/20">
            <FileText className="w-6 h-6 text-white" />
          </div>
          {t("media.imageToPdf.title")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("media.imageToPdf.description")}
        </p>
      </header>

      <div className="flex-1 flex flex-col min-h-0 gap-6">
        {/* Upload Area */}
        <div
          className="bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-red-500 transition-colors shrink-0"
          onClick={() => document.getElementById("img-pdf-upload")?.click()}
        >
          <ImageIcon className="w-10 h-10 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("media.imageToPdf.uploadLabel")}
          </p>
          <input
            id="img-pdf-upload"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleUpload}
          />
        </div>

        {/* Image List */}
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
          {images.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <p>{t("media.imageToPdf.noImages")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <div
                  key={img.id}
                  className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 aspect-[3/4]"
                >
                  <img
                    src={img.preview}
                    alt=""
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay Controls */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <button
                      onClick={() => removeImage(img.id)}
                      className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex gap-2">
                      <button
                        disabled={idx === 0}
                        onClick={() => moveImage(idx, -1)}
                        className="p-1.5 bg-white text-gray-900 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        disabled={idx === images.length - 1}
                        onClick={() => moveImage(idx, 1)}
                        className="p-1.5 bg-white text-gray-900 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    #{idx + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Button */}
        {images.length > 0 && (
          <button
            onClick={generateAndDownloadPdf}
            disabled={isGenerating}
            className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium shadow-lg shadow-red-500/25 flex items-center justify-center gap-2 text-lg shrink-0"
          >
            {isGenerating ? (
              t("media.imageToPdf.generating")
            ) : (
              <>
                <Download className="w-5 h-5" />{" "}
                {t("media.imageToPdf.downloadBtn")}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
