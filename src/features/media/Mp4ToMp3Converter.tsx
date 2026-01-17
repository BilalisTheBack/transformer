import { useState, useCallback } from "react";
import {
  FileUp,
  Music,
  Video,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Zap,
  FileAudio,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

export default function Mp4ToMp3Converter() {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;
    setSuccess(false);
    setProgress(0);
    setFile(selectedFile);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/mp4": [".mp4"],
      "video/webm": [".webm"],
      "video/quicktime": [".mov"],
    },
    maxFiles: 1,
    maxSize: 500 * 1024 * 1024, // 500MB
  });

  const handleConvert = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setSuccess(false);
    setProgress(10);

    try {
      // Create an audio context
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      setProgress(20);

      // Read the file as an ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      setProgress(40);

      // Decode the audio data
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      setProgress(60);

      // Convert AudioBuffer to WAV (browser-compatible audio format)
      const wavBlob = audioBufferToWav(audioBuffer);
      setProgress(90);

      // Download
      const url = URL.createObjectURL(wavBlob);
      const a = document.createElement("a");
      const baseName = file.name.replace(/\.[^/.]+$/, "");
      a.href = url;
      a.download = `${baseName}.wav`; // WAV is browser-native, MP3 needs encoder
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccess(true);
      setProgress(100);
      setTimeout(() => setLoading(false), 1200);
    } catch (err: any) {
      console.error(err);
      setError(t("mp4tomp3.error"));
      setLoading(false);
      setProgress(0);
    }
  };

  // Helper function to convert AudioBuffer to WAV Blob
  const audioBufferToWav = (buffer: AudioBuffer): Blob => {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2 + 44;
    const out = new ArrayBuffer(length);
    const view = new DataView(out);
    const channels: Float32Array[] = [];
    let offset = 0;
    let pos = 0;

    // Write RIFF header
    const writeString = (s: string) => {
      for (let i = 0; i < s.length; i++) {
        view.setUint8(pos + i, s.charCodeAt(i));
      }
      pos += s.length;
    };

    writeString("RIFF");
    view.setUint32(pos, length - 8, true);
    pos += 4;
    writeString("WAVE");
    writeString("fmt ");
    view.setUint32(pos, 16, true);
    pos += 4;
    view.setUint16(pos, 1, true);
    pos += 2;
    view.setUint16(pos, numOfChan, true);
    pos += 2;
    view.setUint32(pos, buffer.sampleRate, true);
    pos += 4;
    view.setUint32(pos, buffer.sampleRate * 2 * numOfChan, true);
    pos += 4;
    view.setUint16(pos, numOfChan * 2, true);
    pos += 2;
    view.setUint16(pos, 16, true);
    pos += 2;
    writeString("data");
    view.setUint32(pos, length - pos - 4, true);
    pos += 4;

    // Get channel data
    for (let i = 0; i < numOfChan; i++) {
      channels.push(buffer.getChannelData(i));
    }

    // Interleave channels and write samples
    while (offset < buffer.length) {
      for (let i = 0; i < numOfChan; i++) {
        let sample = Math.max(-1, Math.min(1, channels[i][offset]));
        sample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
        view.setInt16(pos, sample, true);
        pos += 2;
      }
      offset++;
    }

    return new Blob([out], { type: "audio/wav" });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4 sm:px-0 pb-20 animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl sm:rounded-[32px] bg-app-panel/40 border border-white/5 backdrop-blur-2xl shadow-3xl">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-app-primary/10 flex items-center justify-center text-app-primary ring-1 ring-app-primary/20 shadow-glow-sm">
            <FileAudio className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-app-text tracking-tight">
              {t("mp4tomp3.title")}
            </h1>
            <p className="text-xs font-medium text-app-text-sub opacity-60">
              {t("mp4tomp3.description")}
            </p>
          </div>
        </div>
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
                  <Video className="w-12 h-12" />
                ) : (
                  <FileUp className="w-12 h-12" />
                )}
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-app-text tracking-tight">
                  {file ? file.name : t("mp4tomp3.dropzone")}
                </h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {[".mp4", ".webm", ".mov"].map((ext) => (
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
                    {t("mp4tomp3.converting")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="lg:col-span-4 space-y-4 sm:space-y-6">
          <div className="p-5 sm:p-8 rounded-2xl sm:rounded-[40px] bg-app-panel/40 border border-white/5 backdrop-blur-xl shadow-2xl space-y-6 sm:space-y-8">
            <div className="space-y-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-app-text-sub flex items-center gap-2">
                <Music className="w-4 h-4" /> {t("mp4tomp3.outputFormat")}
              </h2>
              <div className="p-4 bg-app-primary/10 border border-app-primary/30 rounded-2xl flex items-center gap-3 text-app-primary">
                <Music className="w-5 h-5" />
                <span className="font-bold text-sm">
                  {t("mp4tomp3.outputType")}
                </span>
              </div>
              <p className="text-[10px] text-app-text-sub opacity-60 leading-relaxed">
                {t("mp4tomp3.wavNote")}
              </p>
            </div>

            <button
              onClick={handleConvert}
              disabled={!file || loading}
              className="w-full bg-app-primary text-white font-black py-6 rounded-3xl flex items-center justify-center gap-4 shadow-glow-lg transition-all active:scale-95 disabled:grayscale"
            >
              {loading ? (
                <RefreshCw className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <Download className="w-6 h-6" />{" "}
                  <span>{t("mp4tomp3.convert")}</span>
                </>
              )}
            </button>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-[32px] flex gap-5 items-start text-red-500 animate-in slide-in-from-right-4">
              <AlertCircle className="w-10 h-10 shrink-0" />
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest">
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
                <p className="text-[10px] font-black uppercase tracking-widest">
                  {t("mp4tomp3.successTitle")}
                </p>
                <p className="text-sm font-bold leading-snug">
                  {t("mp4tomp3.success")}
                </p>
              </div>
            </div>
          )}

          <div className="p-6 bg-yellow-500/5 border border-yellow-500/10 rounded-3xl flex gap-4">
            <Zap className="w-6 h-6 text-yellow-500 shrink-0" />
            <p className="text-[10px] text-app-text-sub leading-relaxed font-bold italic">
              {t("mp4tomp3.info")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
