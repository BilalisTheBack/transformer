import React, { useState, useRef } from "react";
import {
  Upload,
  FileText,
  Binary,
  Hash,
  Info,
  Film,
  Edit3,
  Download,
  MapPin,
  ExternalLink,
  ShieldAlert,
  Smartphone,
  Aperture,
  Trash2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
// @ts-ignore
import ExifReader from "exifreader";
import { PDFDocument } from "pdf-lib";

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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Image Meta
  const [imageDims, setImageDims] = useState<{
    width: number;
    height: number;
  } | null>(null);

  // Device & GPS Info
  const [deviceInfo, setDeviceInfo] = useState<{
    make?: string;
    model?: string;
    software?: string;
    lens?: string;
  } | null>(null);

  const [gpsInfo, setGpsInfo] = useState<{
    latStr: string;
    lngStr: string;
    mapLink?: string;
  } | null>(null);

  // Video Meta
  const [videoMeta, setVideoMeta] = useState<{
    duration: number;
    width: number;
    height: number;
  } | null>(null);

  const [exifData, setExifData] = useState<any | null>(null);

  // PDF Meta
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

  const processFile = async (file: File) => {
    setFile(file);
    // Reset states
    setImageDims(null);
    setVideoMeta(null);
    setDetectedType(null);
    setExifData(null);
    setDeviceInfo(null);
    setGpsInfo(null);
    setPdfDoc(null);
    setIsPdf(false);
    setPdfEditing(false);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setPdfMeta({
      title: "",
      author: "",
      subject: "",
      keywords: "",
      creator: "",
      producer: "",
    });

    // Create Preview URL
    if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
      setPreviewUrl(URL.createObjectURL(file));
    }

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
          setDetectedType(null);
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
        // Use expanded: true to ensure we get meaningful data structures
        const tags = await ExifReader.load(file, { expanded: true });
        // Also get raw tags for display list
        const rawTags = await ExifReader.load(file);
        setExifData(rawTags);

        // Extract Device Info (Try multiple sources)
        const make =
          tags.exif?.Make?.description || rawTags["Make"]?.description || "";

        const model =
          tags.exif?.Model?.description || rawTags["Model"]?.description || "";

        const software =
          tags.exif?.Software?.description ||
          rawTags["Software"]?.description ||
          "";

        const lens =
          tags.exif?.LensModel?.description ||
          rawTags["LensModel"]?.description ||
          "";

        if (make || model || software || lens) {
          setDeviceInfo({ make, model, software, lens });
        }

        // Extract GPS
        if (tags.gps) {
          const lat = tags.gps.Latitude;
          const lng = tags.gps.Longitude;

          if (lat && lng) {
            const latStr = `${lat.toFixed(6)}°`;
            const lngStr = `${lng.toFixed(6)}°`;

            setGpsInfo({
              latStr,
              lngStr,
              mapLink: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
            });
          }
        } else if (rawTags["GPSLatitude"] && rawTags["GPSLongitude"]) {
          // Fallback to raw tags if expanded didn't work but raw did
          const latStr = rawTags["GPSLatitude"]?.description || "";
          const lngStr = rawTags["GPSLongitude"]?.description || "";

          if (latStr && lngStr) {
            setGpsInfo({
              latStr,
              lngStr,
              mapLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${latStr} ${lngStr}`
              )}`,
            });
          }
        }
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

  const cleanMetadata = async () => {
    if (!file || !imageDims) return;

    // Privacy scrub for images: Draw to canvas and re-export
    const img = new Image();
    img.src = URL.createObjectURL(file);
    await new Promise((resolve) => (img.onload = resolve));

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(img, 0, 0);

    // Convert to Blob (strips EXIF)
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `clean_${file.name}`;
        a.click();
        URL.revokeObjectURL(url);
      },
      file.type,
      0.95
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
    <div className="p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-24">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Binary className="w-8 h-8 text-blue-500" />
          {t("metadata.title")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("metadata.description")}
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
          {t("common.dropFile")}
        </p>
        <p className="text-sm text-gray-500 mt-2">{t("metadata.dragText")}</p>
      </div>

      {file && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT COLUMN: Preview & Basic Info */}
          <div className="space-y-6">
            {/* Thumbnail Preview */}
            {previewUrl && file.type.startsWith("image/") && (
              <div className="bg-gray-100 dark:bg-gray-900/50 rounded-xl p-4 flex items-center justify-center border border-gray-200 dark:border-gray-700 overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-64 rounded-lg object-contain shadow-sm"
                />
              </div>
            )}

            {/* Basic Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-500" />
                {t("metadata.basicInfo")}
              </h3>
              <dl className="space-y-3">
                <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 p-2 rounded">
                  <dt className="text-gray-500 dark:text-gray-400 text-sm">
                    {t("metadata.name")}
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
                    {t("metadata.size")}
                  </dt>
                  <dd className="font-mono text-sm">
                    {(file.size / 1024).toFixed(2)} KB
                  </dd>
                </div>
                <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 p-2 rounded">
                  <dt className="text-gray-500 dark:text-gray-400 text-sm">
                    {t("metadata.type")}
                  </dt>
                  <dd className="font-mono text-sm">
                    {file.type || "Unknown"}
                  </dd>
                </div>
                <div className="flex justify-between items-center p-2 rounded">
                  <dt className="text-gray-500 dark:text-gray-400 text-sm">
                    {t("metadata.modified")}
                  </dt>
                  <dd className="font-mono text-sm">
                    {format(new Date(file.lastModified), "yyyy-MM-dd HH:mm")}
                  </dd>
                </div>
              </dl>

              {/* Magic Number */}
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
                    {t("metadata.signature")}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {detectedType ? detectedType : t("metadata.noSig")}
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Tools (Clean Metadata) */}
            {imageDims && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <ShieldAlert className="w-5 h-5 text-red-500" />
                  {t("metadata.privacy")}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {t("metadata.cleanDesc")}
                </p>
                <button
                  onClick={cleanMetadata}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition shadow-sm hover:shadow-md"
                >
                  <Trash2 className="w-4 h-4" />
                  {t("metadata.clean")}
                </button>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Detailed EXIF, Device, Hex */}
          <div className="space-y-6">
            {/* GPS Location Info */}
            {gpsInfo && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-500" />
                  {t("metadata.location")}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-start text-sm border-b border-gray-100 dark:border-gray-800 pb-2">
                    <span className="text-gray-500 dark:text-gray-400">
                      {t("metadata.lat")}
                    </span>
                    <span className="font-mono text-right max-w-[200px]">
                      {gpsInfo.latStr}
                    </span>
                  </div>
                  <div className="flex justify-between items-start text-sm border-b border-gray-100 dark:border-gray-800 pb-2">
                    <span className="text-gray-500 dark:text-gray-400">
                      {t("metadata.lng")}
                    </span>
                    <span className="font-mono text-right max-w-[200px]">
                      {gpsInfo.lngStr}
                    </span>
                  </div>

                  {gpsInfo.mapLink && (
                    <a
                      href={gpsInfo.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center mt-4 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition font-medium flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {t("metadata.map")}
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Device Info */}
            {deviceInfo && (
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-blue-400" />
                  {t("metadata.device")}
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {deviceInfo.make && (
                    <div>
                      <span className="text-gray-400 text-xs block uppercase">
                        {t("metadata.make")}
                      </span>
                      <span className="font-medium">{deviceInfo.make}</span>
                    </div>
                  )}
                  {deviceInfo.model && (
                    <div>
                      <span className="text-gray-400 text-xs block uppercase">
                        {t("metadata.model")}
                      </span>
                      <span className="font-medium">{deviceInfo.model}</span>
                    </div>
                  )}
                  {deviceInfo.lens && (
                    <div className="col-span-2">
                      <span className="text-gray-400 text-xs block uppercase">
                        {t("metadata.lens")}
                      </span>
                      <span className="font-medium truncate block">
                        {deviceInfo.lens}
                      </span>
                    </div>
                  )}
                  {deviceInfo.software && (
                    <div className="col-span-2 border-t border-gray-700 pt-2 mt-2">
                      <span className="text-gray-400 text-xs block uppercase">
                        {t("metadata.software")}
                      </span>
                      <span className="font-mono text-xs">
                        {deviceInfo.software}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* EXIF Data (Scrollable) */}
            {exifData && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Aperture className="w-5 h-5 text-teal-500" />
                    {t("metadata.exif")}
                  </h3>
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300">
                    {Object.keys(exifData).length} tags
                  </span>
                </div>

                <div className="h-64 overflow-y-auto pr-2 space-y-1 custom-scrollbar">
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
                          className="flex justify-between items-start text-sm border-b border-gray-100 dark:border-gray-800 pb-1 last:border-0"
                        >
                          <span
                            className="text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap mr-4 w-1/3 truncate"
                            title={key}
                          >
                            {key}
                          </span>
                          <span
                            className="text-gray-800 dark:text-gray-200 font-mono text-right w-2/3 truncate"
                            title={value.description}
                          >
                            {value.description}
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            )}

            {/* Hex Dump (Scrollable) */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Hash className="w-5 h-5 text-orange-500" />
                {t("metadata.hexDump")}
              </h3>
              <div className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
                <div className="font-mono text-xs text-green-400 leading-relaxed whitespace-pre-wrap break-all">
                  {headerHex}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Area: PDF Editor (Full Width) */}
          {isPdf && pdfDoc && (
            <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-indigo-500" />
                  {t("metadata.pdfEdit")}
                </h3>
                <button
                  onClick={() => setPdfEditing(!pdfEditing)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {pdfEditing ? t("common.cancel") : t("common.edit")}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(
                  [
                    ["title", t("metadata.pdfTitle")],
                    ["author", t("metadata.pdfAuthor")],
                    ["subject", t("metadata.pdfSubject")],
                    ["keywords", t("metadata.pdfKeywords")],
                    ["creator", t("metadata.pdfCreator")],
                    ["producer", t("metadata.pdfProducer")],
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
                  {t("metadata.savePdf")}
                </button>
              )}
            </div>
          )}

          {/* Video Metadata (Full Width) */}
          {videoMeta && (
            <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Film className="w-5 h-5 text-red-500" />
                {t("metadata.videoMetadata")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded flex flex-col gap-1">
                  <span className="text-gray-500 dark:text-gray-400 text-xs uppercase">
                    {t("metadata.duration")}
                  </span>
                  <span className="font-mono">
                    {formatDuration(videoMeta.duration)}
                  </span>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded flex flex-col gap-1">
                  <span className="text-gray-500 dark:text-gray-400 text-xs uppercase">
                    {t("metadata.resolution")}
                  </span>
                  <span className="font-mono">
                    {videoMeta.width} x {videoMeta.height}
                  </span>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded flex flex-col gap-1">
                  <span className="text-gray-500 dark:text-gray-400 text-xs uppercase">
                    {t("metadata.aspectRatio")}
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
