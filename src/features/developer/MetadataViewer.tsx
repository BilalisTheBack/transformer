import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  FileText,
  Image as ImageIcon,
  Binary,
  Hash,
  Info,
  Film,
  Camera,
  Edit3,
  Download,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
// @ts-ignore
import ExifReader from "exifreader";
import { PDFDocument } from "pdf-lib";
import { useDragDrop } from "../../providers/DragDropProvider";

interface FileSignature {
  hex: string;
  type: string;
  description: string;
}

const SIGNATURES: FileSignature[] = [
  {
    hex: "89 50 4E 47 0D 0A 1A 0A",
    type: "image/png",
    description: "PNG Image",
  },
  { hex: "FF D8 FF", type: "image/jpeg", description: "JPEG Image" },
  { hex: "47 49 46 38", type: "image/gif", description: "GIF Image" },
  { hex: "25 50 44 46", type: "application/pdf", description: "PDF Document" },
  {
    hex: "50 4B 03 04",
    type: "application/zip",
    description: "ZIP Archive / OpenXml (Docx, Xlsx)",
  },
  { hex: "52 61 72 21", type: "application/x-rar", description: "RAR Archive" },
  {
    hex: "4D 5A",
    type: "application/x-msdownload",
    description: "Windows Executable (EXE/DLL)",
  },
  {
    hex: "7F 45 4C 46",
    type: "application/x-elf",
    description: "ELF Executable",
  },
  { hex: "49 44 33", type: "audio/mp3", description: "MP3 Audio (ID3)" },
  {
    hex: "00 00 00 18 66 74 79 70",
    type: "video/mp4",
    description: "MP4 Video",
  },
  {
    hex: "00 00 00 20 66 74 79 70",
    type: "video/mp4",
    description: "MP4 Video",
  },
];

interface PdfMeta {
  title: string;
  author: string;
  subject: string;
  keywords: string;
  creator: string;
  producer: string;
}

export default function MetadataViewer() {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [headerHex, setHeaderHex] = useState<string>("");
  const [detectedType, setDetectedType] = useState<string | null>(null);
  const [imageDims, setImageDims] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [videoMeta, setVideoMeta] = useState<{
    duration: number;
    width: number;
    height: number;
  } | null>(null);
  const [exifData, setExifData] = useState<any | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [pdfMeta, setPdfMeta] = useState<PdfMeta>({
    title: "",
    author: "",
    subject: "",
    keywords: "",
    creator: "",
    producer: "",
  });
  const [isPdf, setIsPdf] = useState(false);
  const [pdfEditing, setPdfEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // DragDrop Context
  const { droppedFile, clearDroppedFile, resetDragState } = useDragDrop();

  const processFile = async (file: File) => {
    setFile(file);
    setImageDims(null);
    setVideoMeta(null);
    setDetectedType(null);
    setExifData(null);
    setPdfDoc(null);
    setIsPdf(false);
    setPdfEditing(false);
    setPdfMeta({
      title: "",
      author: "",
      subject: "",
      keywords: "",
      creator: "",
      producer: "",
    });

    // Read first 64 bytes for hex dump & signature check
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result instanceof ArrayBuffer) {
        const buffer = new Uint8Array(e.target.result);
        const hexParts = Array.from(buffer).map((b) =>
          b.toString(16).padStart(2, "0").toUpperCase()
        );
        const hexStr = hexParts.join(" ");
        setHeaderHex(hexStr);

        // Detect Magic Number
        const foundSig = SIGNATURES.find((sig) => hexStr.startsWith(sig.hex));
        if (foundSig) {
          setDetectedType(foundSig.description);
        } else {
          setDetectedType(null); // Unknown or not in our list
        }
      }
    };
    reader.readAsArrayBuffer(file.slice(0, 64));

    // Image: Dimensions & EXIF
    if (file.type.startsWith("image/")) {
      const img = new Image();
      img.onload = () => {
        setImageDims({ width: img.width, height: img.height });
      };
      img.src = URL.createObjectURL(file);

      // EXIF
      try {
        const tags = await ExifReader.load(file);
        setExifData(tags);
      } catch (err) {
        console.warn("No EXIF data found or error reading", err);
      }
    }

    // Video: Duration & Dimensions
    if (file.type.startsWith("video/")) {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        setVideoMeta({
          duration: video.duration,
          width: video.videoWidth,
          height: video.videoHeight,
        });
        URL.revokeObjectURL(video.src);
      };
      video.src = URL.createObjectURL(file);
    }

    // PDF: Read metadata
    if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      setIsPdf(true);
      try {
        const arrayBuffer = await file.arrayBuffer();
        const doc = await PDFDocument.load(arrayBuffer);
        setPdfDoc(doc);
        setPdfMeta({
          title: doc.getTitle() || "",
          author: doc.getAuthor() || "",
          subject: doc.getSubject() || "",
          keywords: (() => {
            const kw = doc.getKeywords();
            if (!kw) return "";
            if (Array.isArray(kw)) return kw.join(", ");
            return String(kw);
          })(),
          creator: doc.getCreator() || "",
          producer: doc.getProducer() || "",
        });
      } catch (err) {
        console.warn("Error loading PDF", err);
      }
    }
  };

  // Consume dropped file from context
  useEffect(() => {
    if (droppedFile) {
      processFile(droppedFile);
      clearDroppedFile();
    }
  }, [droppedFile, clearDroppedFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    resetDragState(); // Ensure overlay is closed
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handlePdfMetaChange = (field: keyof PdfMeta, value: string) => {
    setPdfMeta((prev) => ({ ...prev, [field]: value }));
  };

  const handleSavePdf = async () => {
    if (!pdfDoc) return;

    pdfDoc.setTitle(pdfMeta.title);
    pdfDoc.setAuthor(pdfMeta.author);
    pdfDoc.setSubject(pdfMeta.subject);
    pdfDoc.setKeywords(pdfMeta.keywords.split(",").map((k) => k.trim()));
    pdfDoc.setCreator(pdfMeta.creator);
    pdfDoc.setProducer(pdfMeta.producer);

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file?.name || "modified.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}h ${m}m ${s}s`;
    return `${m}m ${s}s`;
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Binary className="w-8 h-8 text-blue-500" />
          {t("metadata.title", "Metadata Viewer")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t(
            "metadata.description",
            "View detailed metadata and hexdump for any file."
          )}
        </p>
      </div>

      <div
        className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-12 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer bg-gray-50 dark:bg-gray-800/50"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
          {t("common.dropFile", "Drop file here")}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {t("metadata.dragText", "or click to select file")}
        </p>
      </div>

      {file && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-500" />
              {t("metadata.basicInfo", "Basic Info")}
            </h3>
            <dl className="space-y-3">
              <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 p-2 rounded">
                <dt className="text-gray-500 dark:text-gray-400 text-sm">
                  {t("metadata.name", "Name")}
                </dt>
                <dd
                  className="font-mono text-sm max-w-[200px] truncate"
                  title={file.name}
                >
                  {file.name}
                </dd>
              </div>
              <div className="flex justify-between items-center p-2 rounded">
                <dt className="text-gray-500 dark:text-gray-400 text-sm">
                  {t("metadata.size", "Size")}
                </dt>
                <dd className="font-mono text-sm">
                  {(file.size / 1024).toFixed(2)} KB
                </dd>
              </div>
              <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 p-2 rounded">
                <dt className="text-gray-500 dark:text-gray-400 text-sm">
                  {t("metadata.type", "Type")}
                </dt>
                <dd className="font-mono text-sm">{file.type || "Unknown"}</dd>
              </div>
              <div className="flex justify-between items-center p-2 rounded">
                <dt className="text-gray-500 dark:text-gray-400 text-sm">
                  {t("metadata.lastModified", "Last Modified")}
                </dt>
                <dd className="font-mono text-sm">
                  {format(new Date(file.lastModified), "yyyy-MM-dd HH:mm:ss")}
                </dd>
              </div>

              {/* Magic Number Detection */}
              <div
                className={`mt-4 p-3 rounded-lg border flex items-start gap-3 ${
                  detectedType
                    ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                    : "bg-gray-50 border-gray-200 dark:bg-gray-900/50 dark:border-gray-700"
                }`}
              >
                <Info
                  className={`w-5 h-5 mt-0.5 ${
                    detectedType
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-500"
                  }`}
                />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Magic Number Analysis
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {detectedType ? (
                      <span>
                        Detected:{" "}
                        <strong className="text-green-700 dark:text-green-300">
                          {detectedType}
                        </strong>
                      </span>
                    ) : (
                      "No common signature detected in first bytes."
                    )}
                  </div>
                </div>
              </div>
            </dl>
          </div>

          {/* Hex Dump */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Hash className="w-5 h-5 text-orange-500" />
              {t("metadata.hexDump", "Header Hex Dump")}
            </h3>
            <div className="bg-gray-900 p-4 rounded-lg overflow-x-auto h-[250px]">
              <div className="font-mono text-xs text-green-400 leading-relaxed whitespace-pre-wrap break-all">
                {headerHex}
              </div>
            </div>
          </div>

          {/* PDF Identity Editor */}
          {isPdf && pdfDoc && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 md:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-indigo-500" />
                  {t("metadata.pdfEdit", "Edit PDF Identity")}
                </h3>
                <button
                  onClick={() => setPdfEditing(!pdfEditing)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {pdfEditing ? "Cancel" : "Edit"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(
                  [
                    ["title", t("metadata.pdfTitle", "Title")],
                    ["author", t("metadata.pdfAuthor", "Author")],
                    ["subject", t("metadata.pdfSubject", "Subject")],
                    ["keywords", t("metadata.pdfKeywords", "Keywords")],
                    ["creator", t("metadata.pdfCreator", "Creator")],
                    ["producer", t("metadata.pdfProducer", "Producer")],
                  ] as [keyof PdfMeta, string][]
                ).map(([field, label]) => (
                  <div key={field} className="space-y-1">
                    <label className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                      {label}
                    </label>
                    {pdfEditing ? (
                      <input
                        type="text"
                        value={pdfMeta[field]}
                        onChange={(e) =>
                          handlePdfMetaChange(field, e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="px-3 py-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-sm font-mono truncate">
                        {pdfMeta[field] || (
                          <span className="text-gray-400">—</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {pdfEditing && (
                <button
                  onClick={handleSavePdf}
                  className="mt-6 flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  <Download className="w-4 h-4" />
                  {t("metadata.savePdf", "Save & Download PDF")}
                </button>
              )}
            </div>
          )}

          {/* Image Info */}
          {imageDims && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 md:col-span-2">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-500" />
                {t("metadata.imageInfo", "Image Info")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    {t("metadata.dimensions", "Dimensions")}
                  </span>
                  <span className="font-mono text-sm">
                    {imageDims.width} x {imageDims.height} px
                  </span>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    {t("metadata.aspectRatio", "Aspect Ratio")}
                  </span>
                  <span className="font-mono text-sm">
                    {(imageDims.width / imageDims.height).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* EXIF Data */}
              {exifData && (
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <Camera className="w-4 h-4" /> EXIF Data
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {Object.entries(exifData).map(
                      ([key, value]: [string, any]) => {
                        if (
                          key === "MakerNote" ||
                          key === "UserComment" ||
                          typeof value?.description !== "string"
                        )
                          return null;
                        return (
                          <div
                            key={key}
                            className="p-2 bg-gray-50 dark:bg-gray-900/30 rounded border border-gray-100 dark:border-gray-800"
                          >
                            <div
                              className="text-[10px] text-gray-400 uppercase tracking-widest truncate"
                              title={key}
                            >
                              {key}
                            </div>
                            <div
                              className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate"
                              title={value.description}
                            >
                              {value.description}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Video Info */}
          {videoMeta && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 md:col-span-2">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Film className="w-5 h-5 text-red-500" />
                Video Metadata
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded flex flex-col gap-1">
                  <span className="text-gray-500 dark:text-gray-400 text-xs uppercase">
                    Duration
                  </span>
                  <span className="font-mono">
                    {formatDuration(videoMeta.duration)}
                  </span>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded flex flex-col gap-1">
                  <span className="text-gray-500 dark:text-gray-400 text-xs uppercase">
                    Resolution
                  </span>
                  <span className="font-mono">
                    {videoMeta.width} x {videoMeta.height}
                  </span>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded flex flex-col gap-1">
                  <span className="text-gray-500 dark:text-gray-400 text-xs uppercase">
                    Aspect Ratio
                  </span>
                  <span className="font-mono">
                    {(videoMeta.width / videoMeta.height).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
