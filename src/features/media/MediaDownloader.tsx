import { useState } from "react";
import {
  Download,
  Youtube,
  Instagram,
  Music,
  Video,
  Image as ImageIcon,
  Link as LinkIcon,
  RefreshCw,
  Zap,
  CheckCircle2,
  AlertCircle,
  Settings,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

type Format = "mp4" | "mp3" | "image";
type Quality = "auto" | "144" | "240" | "360" | "480" | "720" | "1080";

export default function MediaDownloader() {
  const { t } = useTranslation();
  const [url, setUrl] = useState("");
  const [format, setFormat] = useState<Format>("mp4");
  const [quality, setQuality] = useState<Quality>("auto");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleDownload = async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Use internal Vercel Proxy to bypass CORS
      const response = await fetch("/api/cobalt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          url: url,
          videoQuality: quality === "auto" ? "720" : quality, // Cobalt typical quality mapping
          downloadMode: format === "mp3" ? "audio" : "video",
          filenameStyle: "pretty",
        }),
      });

      const data = await response.json();

      if (data.status === "error") {
        throw new Error(data.text || t("mediaDownloader.error"));
      }

      if (data.url) {
        window.open(data.url, "_blank");
        setSuccess(true);
      } else {
        throw new Error(t("mediaDownloader.error"));
      }
    } catch (err: any) {
      setError(err.message || t("mediaDownloader.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4 sm:px-0 pb-20 animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl sm:rounded-[32px] bg-app-panel/40 border border-white/5 backdrop-blur-2xl shadow-3xl">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-app-primary/10 flex items-center justify-center text-app-primary ring-1 ring-app-primary/20 shadow-glow-sm">
            <Download className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-app-text tracking-tight">
              {t("mediaDownloader.title")}
            </h1>
            <p className="text-xs font-medium text-app-text-sub opacity-60">
              {t("mediaDownloader.description")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Area */}
        <div className="lg:col-span-8 space-y-4 sm:space-y-6">
          <div className="p-5 sm:p-8 rounded-2xl sm:rounded-[40px] bg-app-panel/40 border border-white/5 backdrop-blur-xl shadow-2xl space-y-4 sm:space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-app-text-sub flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />{" "}
                {t("mediaDownloader.inputLabel")}
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={t("mediaDownloader.placeholder")}
                className="w-full bg-app-bg/50 border border-white/10 rounded-2xl px-6 py-4 text-app-text placeholder:text-app-text-sub/30 focus:outline-none focus:border-app-primary/50 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div
                className={clsx(
                  "p-4 rounded-2xl border transition-all flex items-center gap-3",
                  url.includes("youtube.com") || url.includes("youtu.be")
                    ? "bg-red-500/10 border-red-500/30 text-red-500"
                    : "bg-white/5 border-white/10 text-app-text-sub opacity-50",
                )}
              >
                <Youtube className="w-5 h-5" />
                <span className="text-xs font-bold">YouTube</span>
              </div>
              <div
                className={clsx(
                  "p-4 rounded-2xl border transition-all flex items-center gap-3",
                  url.includes("instagram.com")
                    ? "bg-pink-500/10 border-pink-500/30 text-pink-500"
                    : "bg-white/5 border-white/10 text-app-text-sub opacity-50",
                )}
              >
                <Instagram className="w-5 h-5" />
                <span className="text-xs font-bold">Instagram / TikTok</span>
              </div>
            </div>
          </div>

          {/* Supported Features Grid */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Video, label: "MP4 Video", color: "blue" },
              { icon: Music, label: "MP3 Audio", color: "purple" },
              { icon: ImageIcon, label: "Thumbnails", color: "orange" },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-4 rounded-3xl bg-app-panel/20 border border-white/5 flex flex-col items-center gap-2 text-center"
              >
                <feature.icon
                  className={`w-6 h-6 text-${feature.color}-400 mb-1`}
                />
                <span className="text-[10px] font-black uppercase tracking-widest text-app-text-sub">
                  {feature.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-8 rounded-[40px] bg-app-panel/40 border border-white/5 backdrop-blur-xl shadow-2xl space-y-8">
            {/* Format Selection */}
            <div className="space-y-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-app-text-sub flex items-center gap-2">
                <Settings className="w-4 h-4" /> {t("mediaDownloader.format")}
              </h2>
              <div className="space-y-2">
                {[
                  { id: "mp4", label: t("mediaDownloader.video"), icon: Video },
                  { id: "mp3", label: t("mediaDownloader.audio"), icon: Music },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFormat(f.id as Format)}
                    className={clsx(
                      "w-full flex items-center gap-4 px-6 py-4 rounded-2xl border transition-all text-left",
                      format === f.id
                        ? "bg-app-primary/10 border-app-primary/50 text-app-primary shadow-glow-sm"
                        : "bg-app-bg/50 border-white/10 text-app-text-sub hover:border-white/20",
                    )}
                  >
                    <f.icon className="w-5 h-5" />
                    <span className="font-bold text-sm">{f.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quality Selection */}
            {format === "mp4" && (
              <div className="space-y-4">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-app-text-sub flex items-center gap-2">
                  <Zap className="w-4 h-4" /> {t("mediaDownloader.quality")}
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "auto", label: t("mediaDownloader.auto") },
                    { id: "1080", label: "1080p" },
                    { id: "720", label: "720p" },
                    { id: "480", label: "480p" },
                    { id: "360", label: "360p" },
                    { id: "144", label: "144p" },
                  ].map((q) => (
                    <button
                      key={q.id}
                      onClick={() => setQuality(q.id as Quality)}
                      className={clsx(
                        "px-4 py-3 rounded-xl border text-xs font-bold transition-all",
                        quality === q.id
                          ? "bg-app-primary text-white border-app-primary"
                          : "bg-app-bg/50 border-white/10 text-app-text-sub hover:border-white/20",
                      )}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleDownload}
              disabled={!url || loading}
              className="w-full bg-app-primary text-white font-black py-6 rounded-3xl flex items-center justify-center gap-4 shadow-glow-lg transition-all active:scale-95 disabled:grayscale"
            >
              {loading ? (
                <RefreshCw className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <Download className="w-6 h-6" />{" "}
                  <span>{t("mediaDownloader.download")}</span>
                </>
              )}
            </button>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-[32px] flex gap-5 items-start text-red-500 animate-in slide-in-from-right-4">
              <AlertCircle className="w-10 h-10 shrink-0" />
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest leading-none">
                  {t("common.error")}
                </p>
                <p className="text-sm font-bold leading-snug">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-[32px] flex gap-5 items-start text-green-500 animate-in slide-in-from-right-4">
              <CheckCircle2 className="w-10 h-10 shrink-0" />
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest leading-none">
                  Success
                </p>
                <p className="text-sm font-bold leading-snug">
                  {t("mediaDownloader.success")}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
