import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FileText, Download, Upload } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import JSZip from "jszip";

// Set worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function PdfToImage() {
  const { t } = useTranslation();
  const [pages, setPages] = useState<string[]>([]); // Array of data URLs
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setIsProcessing(true);
      setPages([]);

      try {
        const arrayBuffer = await uploadedFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;

        const renderedPages = [];

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2 }); // Scale 2 for better quality
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");

          if (context) {
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // @ts-ignore - render types conflict in some versions
            const renderContext: any = {
              canvasContext: context,
              viewport: viewport,
            };
            await page.render(renderContext).promise;

            renderedPages.push(canvas.toDataURL("image/png"));
          }
        }

        setPages(renderedPages);
      } catch (error) {
        console.error("PDF Parsing Error", error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const downloadAll = async () => {
    if (pages.length === 0) return;

    if (pages.length === 1) {
      const a = document.createElement("a");
      a.href = pages[0];
      a.download = `page_1.png`;
      a.click();
    } else {
      const zip = new JSZip();
      pages.forEach((page, i) => {
        const data = page.split(",")[1];
        zip.file(`page_${i + 1}.png`, data, { base64: true });
      });

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = "converted_pages.zip";
      a.click();
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6 animate-in fade-in duration-500 pb-24">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <div className="p-2 bg-orange-600 rounded-lg shadow-lg shadow-orange-500/20">
            <FileText className="w-6 h-6 text-white" />
          </div>
          {t("media.pdfToImage.title")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("media.pdfToImage.description")}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        {/* Sidebar Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm transition-all hover:shadow-md">
            <div
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-orange-500 transition-colors"
              onClick={() => document.getElementById("pdf-upload")?.click()}
            >
              <Upload className="w-10 h-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("media.pdfToImage.uploadLabel")}
              </p>
              <input
                id="pdf-upload"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleUpload}
              />
            </div>

            {isProcessing && (
              <div className="mt-4 text-center text-sm text-gray-500 animate-pulse font-medium">
                {t("media.pdfToImage.processing")}
              </div>
            )}

            {pages.length > 0 && !isProcessing && (
              <button
                onClick={downloadAll}
                className="w-full mt-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-medium shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <Download className="w-4 h-4" />
                {pages.length > 1
                  ? t("media.pdfToImage.downloadAll")
                  : t("media.pdfToImage.downloadSingle")}
              </button>
            )}
          </div>
        </div>

        {/* Preview Grid */}
        <div className="lg:col-span-3 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 overflow-y-auto">
          {pages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl">
              <FileText className="w-16 h-16 mb-4 opacity-20" />
              <p>{t("media.pdfToImage.noPages")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pages.map((dataUrl, i) => (
                <div key={i} className="flex flex-col gap-2 group">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 transition-transform group-hover:scale-[1.02]">
                    <img
                      src={dataUrl}
                      alt={`Page ${i + 1}`}
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="flex justify-between items-center px-1">
                    <span className="text-xs font-mono text-gray-500">
                      {t("media.pdfToImage.pageLabel", { index: i + 1 })}
                    </span>
                    <a
                      href={dataUrl}
                      download={`page_${i + 1}.png`}
                      className="p-1 text-gray-400 hover:text-orange-500 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
