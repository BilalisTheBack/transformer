import { useState, useCallback } from "react";
import {
  FileUp,
  Settings,
  Download,
  FileJson,
  FileText,
  Table,
  FileCode,
  ArrowRight,
  RefreshCw,
  Zap,
  CheckCircle2,
  ShieldCheck,
  SearchX,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

type Format = "json" | "csv" | "txt" | "dat";
type Mode = "fromDat" | "toDat";

export default function DatConverter() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>("fromDat");
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<Format>(
    mode === "fromDat" ? "json" : "dat"
  );
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [notices, setNotices] = useState<string[]>([]);

  const toggleMode = () => {
    const newMode = mode === "fromDat" ? "toDat" : "fromDat";
    setMode(newMode);
    setFile(null);
    setFormat(newMode === "fromDat" ? "json" : "dat");
    setError(null);
    setSuccess(false);
    setProgress(0);
    setNotices([]);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;
    setSuccess(false);
    setProgress(0);
    setFile(selectedFile);
    setError(null);
    setNotices([]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:
      mode === "fromDat"
        ? {
            "application/octet-stream": [".dat", ".bin", ".exe"],
            "text/plain": [".dat"],
          }
        : {
            "application/json": [".json"],
            "text/csv": [".csv"],
            "text/plain": [".txt", ".text"],
            "application/octet-stream": [".bin", ".exe"],
          },
    maxFiles: 1,
    maxSize: 25 * 1024 * 1024,
  });

  // --- V11 BINARY GUARD: Pure Content-Based Classification ---
  const validateContent = (
    buffer: ArrayBuffer
  ): { isText: boolean; reasonKey?: string } => {
    const view = new Uint8Array(buffer.slice(0, 4096)); // Check first 4KB

    // 1. EXE Signature (MZ)
    if (view[0] === 0x4d && view[1] === 0x5a) {
      return { isText: false, reasonKey: "datConverter.errors.exeDetected" };
    }

    // 2. Game Save Patterns (Hollow Knight etc.)
    if (view[0] === 0x7b && view[1] === 0x22 && view[2] >= 0 && view[2] <= 31) {
      return {
        isText: false,
        reasonKey: "datConverter.errors.gameSaveDetected",
      };
    }

    // 3. Null Byte Check (\u0000) - Reliable binary indicator
    let nulls = 0;
    let control = 0;
    for (let i = 0; i < view.length; i++) {
      if (view[i] === 0) nulls++;
      if (view[i] < 9 || (view[i] > 13 && view[i] < 32)) control++;
    }

    if (nulls > 0)
      return {
        isText: false,
        reasonKey: "datConverter.errors.nullByteDetected",
      };
    if (control > view.length * 0.1)
      return { isText: false, reasonKey: "datConverter.errors.notReadable" };

    return { isText: true };
  };

  const sanitizeV11 = (str: string): string => {
    if (!str) return "";
    return str
      .replace(
        /[^\x09\x0A\x0D\x20-\x7E\s\dşŞıİğĞüÜöÖçÇ.,:;!?(){}\[\]\-_=+\/*&%$#@]/gi,
        ""
      )
      .replace(/\s+/g, " ")
      .trim();
  };

  const decodeV11 = (
    buffer: ArrayBuffer
  ): { text: string; encoding: string } => {
    const list = ["utf-8", "iso-8859-9", "windows-1254"];
    let best = { text: "", encoding: "utf-8", score: -Infinity };

    for (const enc of list) {
      try {
        const d = new TextDecoder(enc, { fatal: true }); // Use fatal true for strictness
        const t = d.decode(buffer);
        const score =
          t.length - (t.match(/[^\w\s\dşŞıİğĞüÜöÖçÇ.,:;!]/g) || []).length;
        if (score > best.score) best = { text: t, encoding: enc, score };
      } catch (e) {
        continue;
      }
    }

    // Fallback without fatal if all strict decoders fail
    if (!best.text) {
      const d = new TextDecoder("utf-8", { fatal: false });
      best = { text: d.decode(buffer), encoding: "utf-8", score: 0 };
    }

    return best;
  };

  const handleProcess = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setSuccess(false);
    setNotices([]);
    setProgress(10);

    try {
      const buffer = await file.arrayBuffer();
      setProgress(30);

      // V11 GUARD CHECK
      if (mode === "fromDat") {
        const check = validateContent(buffer);
        if (!check.isText) {
          throw new Error(t(check.reasonKey!));
        }
      }

      const res = await processMaster(buffer, file.name, format, mode, (p) =>
        setProgress(30 + Math.floor(p * 0.7))
      );

      const blob = new Blob([res.data], { type: res.contentType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = res.fileName;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccess(true);
      setProgress(100);
      setTimeout(() => setLoading(false), 1200);
    } catch (err: any) {
      setError(err.message || t("datConverter.processStopped"));
      setLoading(false);
      setProgress(0);
    }
  };

  const processMaster = async (
    buffer: ArrayBuffer,
    name: string,
    fmt: Format,
    m: Mode,
    onP: (p: number) => void
  ) => {
    const base = name.substring(0, name.lastIndexOf(".")) || name;

    if (m === "toDat") {
      const { text: input } = decodeV11(buffer);
      let payload = input;

      // Logic for building DAT from structured text
      if (name.endsWith(".json")) {
        try {
          const parsed = JSON.parse(input);
          if (Array.isArray(parsed)) {
            payload = parsed
              .map((obj) => {
                if (typeof obj === "object") {
                  return Object.entries(obj)
                    .map(([k, v]) => (k === "satır" ? v : `${k}=${v}`))
                    .join("\n");
                }
                return String(obj);
              })
              .join("\n");
          }
        } catch (e) {
          /* Fallback to raw */
        }
      } else if (name.endsWith(".csv")) {
        const lines = input.split(/\n/).filter((l) => l.trim());
        if (lines.length > 1) {
          const headers = lines[0].split(",").map((h) => h.replace(/"/g, ""));
          payload = lines
            .slice(1)
            .map((line) => {
              const cells = line.split(",").map((c) => c.replace(/"/g, ""));
              return headers
                .map((h, i) => (h === "satır" ? cells[i] : `${h}=${cells[i]}`))
                .join("\n");
            })
            .join("\n");
        }
      }

      onP(100);
      return {
        data: payload,
        contentType: "application/octet-stream",
        fileName: `${base}.dat`,
      };
    }

    const { text: raw, encoding } = decodeV11(buffer);
    if (encoding !== "utf-8")
      setNotices((n) => [
        ...n,
        `${t("datConverter.autoEncoding")}: ${encoding.toUpperCase()}`,
      ]);

    // Simple V11 Sanitize (Whitelist)
    const clean = sanitizeV11(raw);
    if (clean.length < raw.length * 0.5)
      throw new Error(t("datConverter.errors.noisyContent"));

    let out: any = clean;
    let type = "text/plain",
      ext = "txt";

    if (fmt === "json" || fmt === "csv") {
      const lines = clean
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l);
      const data = lines.map((l) => {
        if (l.includes("=")) {
          const firstEq = l.indexOf("=");
          const k = l.substring(0, firstEq);
          const v = l.substring(firstEq + 1);
          const o: any = {};
          o[k.trim()] = v.trim();
          return o;
        }
        return { satır: l };
      });

      if (fmt === "json") {
        out = JSON.stringify(data, null, 2);
        type = "application/json";
        ext = "json";
      } else {
        const keys = Array.from(new Set(data.flatMap((d) => Object.keys(d))));
        out = [
          keys.join(","),
          ...data.map((r) =>
            keys.map((k) => `"${String(r[k] || "")}"`).join(",")
          ),
        ].join("\n");
        type = "text/csv";
        ext = "csv";
      }
    }

    onP(100);
    return { data: out, contentType: type, fileName: `${base}.${ext}` };
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4 sm:px-0 pb-20 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl sm:rounded-[32px] bg-app-panel/40 border border-white/5 backdrop-blur-2xl shadow-3xl">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-app-primary/10 flex items-center justify-center text-app-primary ring-1 ring-app-primary/20 shadow-glow-sm">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-app-text tracking-tight">
              {t("datConverter.title")}
            </h1>
            <p className="text-xs font-medium text-app-text-sub opacity-60">
              {t("datConverter.description")}
            </p>
          </div>
        </div>

        <button
          onClick={toggleMode}
          className="flex items-center gap-3 px-8 py-4 bg-app-bg border border-white/5 rounded-2xl hover:border-app-primary/50 transition-all active:scale-95 group shadow-xl"
        >
          <RefreshCw className="w-5 h-5 text-app-primary group-hover:rotate-180 transition-transform duration-1000" />
          <span className="font-bold text-sm tracking-widest uppercase">
            {mode === "fromDat"
              ? t("datConverter.modeAnalyze")
              : t("datConverter.modePackage")}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Dropzone Area */}
        <div className="lg:col-span-8">
          <div
            {...getRootProps()}
            className={clsx(
              "relative group border-2 border-dashed rounded-2xl sm:rounded-[40px] transition-all duration-300 flex flex-col items-center justify-center p-8 sm:p-16 cursor-pointer min-h-[300px] sm:min-h-[400px] bg-app-panel/20",
              isDragActive
                ? "border-app-primary bg-app-primary/5"
                : "border-white/10 hover:border-app-primary/30",
              loading && "pointer-events-none opacity-50"
            )}
          >
            <input {...getInputProps()} />

            <div className="flex flex-col items-center gap-8 text-center">
              <div
                className={clsx(
                  "w-24 h-24 rounded-3xl bg-app-bg border border-white/10 flex items-center justify-center transition-all duration-500",
                  file
                    ? "text-app-primary border-app-primary shadow-glow-md scale-110"
                    : "text-app-text-sub"
                )}
              >
                {success ? (
                  <CheckCircle2 className="w-12 h-12" />
                ) : file ? (
                  <FileCode className="w-12 h-12" />
                ) : (
                  <FileUp className="w-12 h-12" />
                )}
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-app-text tracking-tight">
                  {file ? file.name : t("datConverter.dropzone")}
                </h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {[".dat", ".exe", ".bin", ".txt"].map((ext) => (
                    <span
                      key={ext}
                      className="px-3 py-1 bg-white/5 text-[10px] font-black uppercase rounded-lg border border-white/10 opacity-40"
                    >
                      {ext}
                    </span>
                  ))}
                </div>
              </div>
              {loading && (
                <div className="w-64 space-y-4">
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-app-primary shadow-glow-sm transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-[10px] font-black uppercase text-app-primary animate-pulse tracking-widest">
                    {t("datConverter.validating")}
                  </p>
                </div>
              )}

              {success && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setSuccess(false);
                    setProgress(0);
                    setError(null);
                    setNotices([]);
                  }}
                  className="px-6 py-2 bg-app-primary/10 hover:bg-app-primary/20 text-app-primary text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-app-primary/20"
                >
                  {t("common.reset")}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="lg:col-span-4 space-y-4 sm:space-y-6">
          <div className="p-5 sm:p-8 rounded-2xl sm:rounded-[40px] bg-app-panel/40 border border-white/5 backdrop-blur-xl shadow-2xl space-y-6 sm:space-y-8">
            <div className="space-y-6">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-app-text-sub flex items-center gap-2">
                <Settings className="w-4 h-4" /> {t("datConverter.format")}
              </h2>
              <div className="space-y-2">
                {mode === "fromDat" ? (
                  [
                    { id: "json", label: "Structured JSON", icon: FileJson },
                    { id: "csv", label: "Excel CSV", icon: Table },
                    { id: "txt", label: "Cleaned Text", icon: FileText },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFormat(f.id as Format)}
                      className={clsx(
                        "w-full flex items-center gap-4 px-6 py-4 rounded-2xl border transition-all text-left",
                        format === f.id
                          ? "bg-app-primary/10 border-app-primary/50 text-app-primary shadow-glow-sm"
                          : "bg-app-bg/50 border-white/10 text-app-text-sub hover:border-white/20"
                      )}
                    >
                      <f.icon className="w-5 h-5" />
                      <span className="font-bold text-sm">{f.label}</span>
                    </button>
                  ))
                ) : (
                  <div className="p-6 bg-app-primary/5 border border-app-primary/20 rounded-2xl text-center">
                    <p className="text-app-primary font-black uppercase tracking-widest text-xs">
                      {t("datConverter.packagerActive")}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleProcess}
              disabled={!file || loading}
              className="w-full bg-app-primary text-white font-black py-6 rounded-3xl flex items-center justify-center gap-4 shadow-glow-lg transition-all active:scale-95 disabled:grayscale"
            >
              {loading ? (
                <RefreshCw className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <Download className="w-6 h-6" />{" "}
                  <span>{t("datConverter.start")}</span>{" "}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {error ? (
            <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-[32px] flex gap-5 items-start text-red-500 animate-in slide-in-from-right-4">
              <SearchX className="w-10 h-10 shrink-0" />
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest">
                  {t("datConverter.binaryRejected")}
                </p>
                <p className="text-sm font-bold leading-snug">{error}</p>
              </div>
            </div>
          ) : (
            notices.length > 0 && (
              <div className="p-6 bg-app-primary/5 border border-app-primary/20 rounded-[32px] space-y-3">
                {notices.map((n, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-xs font-bold text-app-text-sub"
                  >
                    <ShieldCheck className="w-4 h-4 text-app-primary" /> {n}
                  </div>
                ))}
              </div>
            )
          )}

          <div className="p-6 bg-yellow-500/5 border border-yellow-500/10 rounded-3xl flex gap-4">
            <Zap className="w-6 h-6 text-yellow-500 shrink-0" />
            <p className="text-[10px] text-app-text-sub leading-relaxed font-bold italic">
              {t("datConverter.philosophy")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
