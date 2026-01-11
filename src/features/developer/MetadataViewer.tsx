import React, { useState, useRef, useEffect } from "react";
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
  CheckCircle2,
  XCircle,
  Save,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
// @ts-ignore
import ExifReader from "exifreader";
import { PDFDocument } from "pdf-lib";
// @ts-ignore
import * as piexif from "piexifjs";
import { motion, AnimatePresence } from "framer-motion";

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
    description: "ZIP Archive / OpenXml",
  },
  { hex: "52 61 72 21", type: "application/x-rar", description: "RAR Archive" },
  {
    hex: "4D 5A",
    type: "application/x-msdownload",
    description: "Windows Executable",
  },
  { hex: "49 D3 33", type: "audio/mp3", description: "MP3 Audio" },
  {
    hex: "00 00 00 18 66 74 79 70",
    type: "video/mp4",
    description: "MP4 Video",
  },
];

interface EditableMeta {
  title: string;
  author: string;
  subject: string;
  keywords: string;
  software: string;
  copyright: string;
}

export default function MetadataViewer() {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [headerHex, setHeaderHex] = useState<string>("");
  const [detectedType, setDetectedType] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  // States for Editing
  const [editableMeta, setEditableMeta] = useState<EditableMeta>({
    title: "",
    author: "",
    subject: "",
    keywords: "",
    software: "",
    copyright: "",
  });

  // Display-only states
  const [imageDims, setImageDims] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [gpsInfo, setGpsInfo] = useState<any>(null);
  const [videoMeta, setVideoMeta] = useState<any>(null);
  const [exifData, setExifData] = useState<any>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (selectedFile: File) => {
    setFile(selectedFile);
    setEditMode(false);
    // Reset secondary states
    setImageDims(null);
    setVideoMeta(null);
    setExifData(null);
    setDeviceInfo(null);
    setGpsInfo(null);
    setPdfDoc(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);

    setEditableMeta({
      title: "",
      author: "",
      subject: "",
      keywords: "",
      software: "",
      copyright: "",
    });

    if (
      selectedFile.type.startsWith("image/") ||
      selectedFile.type.startsWith("video/")
    ) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }

    // Signatures
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result instanceof ArrayBuffer) {
        const buffer = new Uint8Array(e.target.result);
        const hex = Array.from(buffer)
          .map((b) => b.toString(16).padStart(2, "0").toUpperCase())
          .join(" ");
        setHeaderHex(hex);
        const found = SIGNATURES.find((s) => hex.startsWith(s.hex));
        setDetectedType(found ? found.description : null);
      }
    };
    reader.readAsArrayBuffer(selectedFile.slice(0, 64));

    // Image Extraction
    if (selectedFile.type.startsWith("image/")) {
      const img = new Image();
      img.onload = () => setImageDims({ width: img.width, height: img.height });
      img.src = URL.createObjectURL(selectedFile);

      try {
        const tags = await ExifReader.load(selectedFile, { expanded: true });
        const rawTags = await ExifReader.load(selectedFile);
        setExifData(rawTags);

        setDeviceInfo({
          make: tags.exif?.Make?.description || "",
          model: tags.exif?.Model?.description || "",
          software: tags.exif?.Software?.description || "",
          lens: tags.exif?.LensModel?.description || "",
        });

        // Set initial editable meta from image tags
        setEditableMeta({
          title: rawTags["ImageDescription"]?.description || "",
          author: rawTags["Artist"]?.description || "",
          subject: "",
          keywords: "",
          software: rawTags["Software"]?.description || "",
          copyright: rawTags["Copyright"]?.description || "",
        });

        if (tags.gps) {
          setGpsInfo({
            lat: tags.gps.Latitude,
            lng: tags.gps.Longitude,
            mapLink: `https://www.google.com/maps?q=${tags.gps.Latitude},${tags.gps.Longitude}`,
          });
        }
      } catch (e) {
        console.warn("EXIF error", e);
      }
    }

    // PDF Extraction
    if (selectedFile.type === "application/pdf") {
      try {
        const arr = await selectedFile.arrayBuffer();
        const doc = await PDFDocument.load(arr);
        setPdfDoc(doc);
        setEditableMeta({
          title: doc.getTitle() || "",
          author: doc.getAuthor() || "",
          subject: doc.getSubject() || "",
          keywords: doc.getKeywords() || "",
          software: doc.getCreator() || "",
          copyright: doc.getProducer() || "",
        });
      } catch (e) {
        console.warn("PDF error", e);
      }
    }
  };

  const saveEditedFile = async () => {
    if (!file) return;

    // JPEG Edit Logic
    if (file.type === "image/jpeg") {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const dataUrl = reader.result as string;
          let exifObj: any = {
            "0th": {},
            Exif: {},
            GPS: {},
            "1st": {},
            thumbnail: null,
          };

          try {
            exifObj = piexif.load(dataUrl);
          } catch (e) {}

          // Update tags
          exifObj["0th"][piexif.ImageIFD.ImageDescription] = editableMeta.title;
          exifObj["0th"][piexif.ImageIFD.Artist] = editableMeta.author;
          exifObj["0th"][piexif.ImageIFD.Software] = editableMeta.software;
          exifObj["0th"][piexif.ImageIFD.Copyright] = editableMeta.copyright;

          const exifBytes = piexif.dump(exifObj);
          const newUrl = piexif.insert(exifBytes, dataUrl);

          const a = document.createElement("a");
          a.href = newUrl;
          a.download = `edited_${file.name}`;
          a.click();
        } catch (e) {
          console.error("Save Error", e);
          alert(
            "Editing failed. This JPEG might have a non-standard structure."
          );
        }
      };
      reader.readAsDataURL(file);
    }
    // PDF Edit Logic
    else if (file.type === "application/pdf" && pdfDoc) {
      pdfDoc.setTitle(editableMeta.title);
      pdfDoc.setAuthor(editableMeta.author);
      pdfDoc.setSubject(editableMeta.subject);
      pdfDoc.setKeywords(editableMeta.keywords.split(","));
      pdfDoc.setProducer(editableMeta.copyright);
      pdfDoc.setCreator(editableMeta.software);
      const bytes = await pdfDoc.save();
      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `edited_${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      alert("Editing is only supported for JPEG and PDF files.");
    }
  };

  const scrubAll = async () => {
    if (!file) return;
    if (file.type.startsWith("image/")) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await new Promise((r) => (img.onload = r));
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);
      canvas.toBlob((b) => {
        if (!b) return;
        const a = document.createElement("a");
        a.href = URL.createObjectURL(b);
        a.download = `scrubbed_${file.name}`;
        a.click();
      }, file.type);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-6xl mx-auto space-y-8 p-4 md:p-8 animate-in fade-in duration-700">
      <div className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter premium-gradient">
          {t("metadata.title")}
        </h1>
        <p className="text-app-text-sub text-lg max-w-xl mx-auto">
          {t("metadata.description")}
        </p>
      </div>

      {!file ? (
        <motion.div
          whileHover={{ scale: 1.01 }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            e.dataTransfer.files[0] && processFile(e.dataTransfer.files[0]);
          }}
          onClick={() => fileInputRef.current?.click()}
          className="w-full max-w-3xl aspect-[16/9] border-2 border-dashed border-app-border rounded-[40px] flex flex-col items-center justify-center space-y-6 bg-app-panel/50 backdrop-blur-xl group cursor-pointer hover:border-app-primary transition-all duration-500"
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) =>
              e.target.files?.[0] && processFile(e.target.files[0])
            }
          />
          <div className="p-8 rounded-full bg-app-bg border border-app-border group-hover:scale-110 transition-transform duration-500">
            <Upload className="w-12 h-12 text-app-primary" />
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-app-text">
              {t("common.dropFile")}
            </p>
            <p className="text-app-text-sub mt-1">{t("metadata.dragText")}</p>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
          {/* LEFT: Preview & Quick Actions */}
          <div className="lg:col-span-12 flex flex-wrap gap-4 mb-4">
            <button
              onClick={() => setFile(null)}
              className="px-6 py-2 rounded-xl bg-app-panel border border-app-border text-app-text font-bold flex items-center gap-2 hover:bg-app-bg transition-all"
            >
              <Trash2 className="w-4 h-4 text-rose-500" /> New File
            </button>
            {(file.type === "image/jpeg" ||
              file.type === "application/pdf") && (
              <button
                onClick={() => setEditMode(!editMode)}
                className={`px-6 py-2 rounded-xl border font-bold flex items-center gap-2 transition-all ${
                  editMode
                    ? "bg-indigo-500 text-white border-indigo-400"
                    : "bg-app-panel border-app-border text-app-text hover:bg-indigo-500/10"
                }`}
              >
                <Edit3 className="w-4 h-4" />{" "}
                {editMode ? t("common.cancel") : t("metadata.edit")}
              </button>
            )}
            <button
              onClick={scrubAll}
              className="px-6 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 font-bold flex items-center gap-2 hover:bg-rose-500 hover:text-white transition-all"
            >
              <ShieldAlert className="w-4 h-4" /> {t("metadata.clean")}
            </button>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <motion.div
              layout
              className="p-4 rounded-3xl bg-app-panel border border-app-border shadow-xl overflow-hidden"
            >
              {previewUrl ? (
                file.type.startsWith("image/") ? (
                  <img
                    src={previewUrl}
                    className="w-full rounded-2xl object-contain max-h-[400px]"
                    alt="Preview"
                  />
                ) : (
                  <div className="aspect-square bg-app-bg rounded-2xl flex flex-col items-center justify-center">
                    <FileText className="w-20 h-20 text-indigo-400" />
                    <p className="mt-4 font-bold text-app-text uppercase">
                      {file.type.split("/")[1]}
                    </p>
                  </div>
                )
              ) : (
                <div className="aspect-square bg-app-bg rounded-2xl flex items-center justify-center p-8 break-all font-mono text-xs text-app-text-sub">
                  {headerHex.slice(0, 200)}...
                </div>
              )}
            </motion.div>

            <div className="p-6 rounded-3xl bg-app-panel border border-app-border shadow-xl space-y-4">
              <h3 className="text-sm font-black text-app-primary uppercase tracking-widest flex items-center gap-2">
                <Info className="w-4 h-4" /> {t("metadata.basicInfo")}
              </h3>
              <div className="grid gap-3">
                <InfoItem label={t("metadata.name")} value={file.name} />
                <InfoItem
                  label={t("metadata.type")}
                  value={detectedType || file.type}
                />
                <InfoItem
                  label={t("metadata.size")}
                  value={`${(file.size / 1024).toFixed(2)} KB`}
                />
                <InfoItem
                  label={t("metadata.lastModified")}
                  value={format(file.lastModified, "yyyy-MM-dd HH:mm")}
                />
                {imageDims && (
                  <InfoItem
                    label={t("metadata.dimensions")}
                    value={`${imageDims.width}x${imageDims.height}`}
                  />
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Edit Form or View Data */}
          <div className="lg:col-span-7 space-y-6">
            <AnimatePresence mode="wait">
              {editMode ? (
                <motion.div
                  key="edit"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-8 rounded-[40px] bg-app-panel border-2 border-indigo-500/30 shadow-2xl space-y-6 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Edit3 className="w-32 h-32 text-indigo-500" />
                  </div>
                  <h2 className="text-2xl font-black tracking-tighter text-app-text flex items-center gap-3">
                    <Save className="w-6 h-6 text-indigo-500" />{" "}
                    {t("metadata.pdfEdit")}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <EditField
                      label={t("metadata.pdfTitle")}
                      value={editableMeta.title}
                      onChange={(v) =>
                        setEditableMeta({ ...editableMeta, title: v })
                      }
                    />
                    <EditField
                      label={t("metadata.tagArtist")}
                      value={editableMeta.author}
                      onChange={(v) =>
                        setEditableMeta({ ...editableMeta, author: v })
                      }
                    />
                    {file.type === "application/pdf" && (
                      <EditField
                        label={t("metadata.pdfSubject")}
                        value={editableMeta.subject}
                        onChange={(v) =>
                          setEditableMeta({ ...editableMeta, subject: v })
                        }
                      />
                    )}
                    {file.type === "application/pdf" && (
                      <EditField
                        label={t("metadata.pdfKeywords")}
                        value={editableMeta.keywords}
                        onChange={(v) =>
                          setEditableMeta({ ...editableMeta, keywords: v })
                        }
                      />
                    )}
                    <EditField
                      label={t("metadata.tagSoftware")}
                      value={editableMeta.software}
                      onChange={(v) =>
                        setEditableMeta({ ...editableMeta, software: v })
                      }
                    />
                    <EditField
                      label={t("metadata.tagCopyright")}
                      value={editableMeta.copyright}
                      onChange={(v) =>
                        setEditableMeta({ ...editableMeta, copyright: v })
                      }
                    />
                  </div>
                  <button
                    onClick={saveEditedFile}
                    className="w-full mt-4 py-4 rounded-2xl bg-indigo-600 text-white font-black text-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-xl hover:shadow-indigo-500/20"
                  >
                    <Download className="w-6 h-6" /> {t("common.download")}
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="view"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* GPS UI */}
                  {gpsInfo && (
                    <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/20 shadow-xl overflow-hidden relative group">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
                          <MapPin className="w-4 h-4" />{" "}
                          {t("metadata.location")}
                        </h3>
                        <a
                          href={gpsInfo.mapLink}
                          target="_blank"
                          className="p-2 rounded-xl bg-amber-500 text-white hover:scale-110 transition-all shadow-lg"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-2xl bg-white dark:bg-app-bg border border-app-border">
                          <p className="text-[10px] font-bold text-app-text-sub uppercase">
                            {t("metadata.lat")}
                          </p>
                          <p className="font-mono text-sm font-bold text-app-text">
                            {gpsInfo.lat?.toFixed(6)}°
                          </p>
                        </div>
                        <div className="p-3 rounded-2xl bg-white dark:bg-app-bg border border-app-border">
                          <p className="text-[10px] font-bold text-app-text-sub uppercase">
                            {t("metadata.lng")}
                          </p>
                          <p className="font-mono text-sm font-bold text-app-text">
                            {gpsInfo.lng?.toFixed(6)}°
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Device UI */}
                  {deviceInfo && (deviceInfo.make || deviceInfo.model) && (
                    <div className="p-6 rounded-3xl bg-cyan-500/5 border border-cyan-500/20 shadow-xl relative overflow-hidden">
                      <ShieldAlert className="absolute -top-4 -right-4 w-24 h-24 text-cyan-500 opacity-10" />
                      <h3 className="text-sm font-black text-cyan-500 uppercase tracking-widest flex items-center gap-2 mb-4">
                        <Smartphone className="w-4 h-4" />{" "}
                        {t("metadata.device")}
                      </h3>
                      <div className="grid grid-cols-2 gap-6">
                        <InfoItem
                          label={t("metadata.make")}
                          value={deviceInfo.make}
                        />
                        <InfoItem
                          label={t("metadata.model")}
                          value={deviceInfo.model}
                        />
                        <div className="col-span-2">
                          <InfoItem
                            label={t("metadata.tagSoftware")}
                            value={deviceInfo.software}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Hex Dump */}
                  <div className="p-6 rounded-3xl bg-app-panel border border-app-border shadow-xl">
                    <h3 className="text-sm font-black text-app-text-sub uppercase tracking-widest flex items-center gap-2 mb-4">
                      <Binary className="w-4 h-4" /> {t("metadata.hexDump")}
                    </h3>
                    <div className="font-mono text-[10px] text-indigo-400 p-4 bg-app-bg rounded-2xl border border-app-border overflow-x-auto whitespace-pre">
                      {headerHex}
                    </div>
                  </div>

                  {/* Full Tags */}
                  {exifData && (
                    <div className="p-6 rounded-3xl bg-app-panel border border-app-border shadow-xl">
                      <h3 className="text-sm font-black text-app-text-sub uppercase tracking-widest flex items-center gap-2 mb-4">
                        <Aperture className="w-4 h-4" /> {t("metadata.exif")} (
                        {Object.keys(exifData).length})
                      </h3>
                      <div className="max-h-60 overflow-y-auto pr-4 custom-scrollbar space-y-1">
                        {Object.entries(exifData).map(
                          ([k, v]: any) =>
                            k !== "MakerNote" &&
                            v?.description && (
                              <div
                                key={k}
                                className="flex justify-between items-center py-2 border-b border-app-border/50 text-xs text-app-text"
                              >
                                <span className="text-app-text-sub font-bold w-1/3 truncate">
                                  {k}
                                </span>
                                <span className="text-app-text font-mono truncate w-2/3 text-right">
                                  {String(v.description)}
                                </span>
                              </div>
                            )
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-black text-app-text-sub uppercase tracking-tighter">
        {label}
      </p>
      <p className="text-sm font-bold text-app-text truncate">{value}</p>
    </div>
  );
}

function EditField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-app-text-sub uppercase tracking-widest px-1">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-app-bg border border-app-border rounded-2xl px-4 py-3 text-sm font-bold text-app-text focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:opacity-30"
        placeholder={`Enter ${label.toLowerCase()}...`}
      />
    </div>
  );
}
