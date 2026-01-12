import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import {
  Download,
  Upload,
  Trash2,
  FileText,
  Plus,
  Scissors,
  Files,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDropzone } from "react-dropzone";

export default function PdfTools() {
  const { t } = useTranslation();
  const [files, setFiles] = useState<File[]>([]);
  const [mode, setMode] = useState<"merge" | "split">("merge");
  const [processing, setProcessing] = useState(false);
  const [splitRange, setSplitRange] = useState("1-3");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMerge = async () => {
    if (files.length < 2) return;
    setProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const copiedPages = await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices()
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      const pdfBytes = await mergedPdf.save();
      download(pdfBytes, "merged.pdf");
    } catch (error) {
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  const handleSplit = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      const file = files[0];
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);

      const parts = splitRange.split("-").map((n) => parseInt(n.trim()) - 1);
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        const newPdf = await PDFDocument.create();
        const indices = Array.from(
          { length: parts[1] - parts[0] + 1 },
          (_, i) => parts[0] + i
        );
        const validIndices = indices.filter(
          (i) => i >= 0 && i < pdf.getPageCount()
        );
        const copiedPages = await newPdf.copyPages(pdf, validIndices);
        copiedPages.forEach((page) => newPdf.addPage(page));
        const pdfBytes = await newPdf.save();
        download(pdfBytes, `split_${splitRange}.pdf`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  const download = (bytes: Uint8Array, name: string) => {
    const blob = new Blob([bytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter premium-gradient">
          {t("pdf.title", "PDF Tools")}
        </h1>
        <p className="text-app-text-sub">
          {t(
            "pdf.subtitle",
            "Merge or split PDF files entirely in your browser"
          )}
        </p>
      </div>

      <div className="flex justify-center">
        <div className="bg-app-panel border border-app-border p-1 rounded-2xl flex gap-1 shadow-xl">
          <button
            onClick={() => setMode("merge")}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              mode === "merge"
                ? "bg-app-primary text-white shadow-lg shadow-app-primary/20"
                : "text-app-text-sub hover:text-app-text"
            }`}
          >
            <Files className="w-4 h-4" />
            Merge
          </button>
          <button
            onClick={() => setMode("split")}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              mode === "split"
                ? "bg-app-primary text-white shadow-lg shadow-app-primary/20"
                : "text-app-text-sub hover:text-app-text"
            }`}
          >
            <Scissors className="w-4 h-4" />
            Split
          </button>
        </div>
      </div>

      <div
        {...getRootProps()}
        className={`group flex flex-col items-center justify-center border-2 border-dashed rounded-3xl p-12 transition-all cursor-pointer ${
          isDragActive
            ? "border-app-primary bg-app-primary/5"
            : "border-app-border bg-app-panel hover:border-app-primary/30"
        }`}
      >
        <input {...getInputProps()} />
        <Plus className="w-12 h-12 text-app-primary mb-4 group-hover:scale-110 transition-transform" />
        <p className="font-bold text-app-text">
          {mode === "merge"
            ? "Drop PDF files to merge"
            : "Drop PDF file to split"}
        </p>
        <p className="text-xs text-app-text-sub mt-1">
          Multi-file selection supported
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-6">
          <div className="bg-app-panel border border-app-border rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 bg-app-border/20 border-b border-app-border">
              <h3 className="text-xs font-black uppercase tracking-widest text-app-text-sub">
                Selected Files ({files.length})
              </h3>
            </div>
            <div className="divide-y divide-app-border max-h-64 overflow-y-auto">
              {files.map((file, i) => (
                <div
                  key={i}
                  className="p-4 flex items-center justify-between group hover:bg-app-bg/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-app-primary" />
                    <div>
                      <p className="text-sm font-medium text-app-text truncate max-w-xs">
                        {file.name}
                      </p>
                      <p className="text-[10px] text-app-text-passive">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(i)}
                    className="p-2 text-app-text-passive hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {mode === "split" && (
            <div className="bg-app-panel border border-app-border rounded-2xl p-6 space-y-4">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-app-text-sub">
                  Page Range to Extract
                </label>
                <input
                  type="text"
                  value={splitRange}
                  onChange={(e) => setSplitRange(e.target.value)}
                  placeholder="e.g. 1-3"
                  className="w-full mt-2 bg-app-bg border border-app-border rounded-xl px-4 py-3 text-sm focus:border-app-primary outline-none transition-all font-mono"
                />
                <p className="text-[10px] text-app-text-passive mt-2 italic">
                  Format: START-END (e.g., 2-5 will extract pages 2, 3, 4, and
                  5)
                </p>
              </div>
            </div>
          )}

          <button
            onClick={mode === "merge" ? handleMerge : handleSplit}
            disabled={
              processing ||
              (mode === "merge" && files.length < 2) ||
              (mode === "split" && files.length === 0)
            }
            className="w-full py-4 bg-app-primary text-white rounded-2xl font-bold hover:bg-app-primary-hover shadow-xl shadow-app-primary/20 transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3"
          >
            {processing ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Download className="w-5 h-5" />
            )}
            {mode === "merge" ? "Merge PDFs" : "Extract Pages"}
          </button>
        </div>
      )}
    </div>
  );
}
