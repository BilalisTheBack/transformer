import { useState, useCallback, useRef } from "react";
import {
  FileUp,
  Scissors,
  Play,
  Pause,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Video,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

export default function VideoClipper() {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;
    setSuccess(false);
    setError(null);
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setVideoSrc(url);
    setStartTime(0);
    setEndTime(0);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/mp4": [".mp4"],
      "video/webm": [".webm"],
      "video/quicktime": [".mov"],
    },
    maxFiles: 1,
    maxSize: 500 * 1024 * 1024,
  });

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration;
      setDuration(dur);
      setEndTime(dur);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.currentTime = startTime;
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleClip = async () => {
    if (!videoRef.current || !file) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const stream = canvas.captureStream(30);
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaElementSource(video);
      const dest = audioCtx.createMediaStreamDestination();
      source.connect(dest);
      source.connect(audioCtx.destination);

      const combinedStream = new MediaStream([
        ...stream.getVideoTracks(),
        ...dest.stream.getAudioTracks(),
      ]);

      const recorder = new MediaRecorder(combinedStream, {
        mimeType: "video/webm;codecs=vp9",
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        const baseName = file.name.replace(/\.[^/.]+$/, "");
        a.href = url;
        a.download = `${baseName}_clip.webm`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
        setSuccess(true);
        setLoading(false);
      };

      video.currentTime = startTime;
      await new Promise((r) => (video.onseeked = r));

      recorder.start();
      video.play();

      const drawFrame = () => {
        if (video.currentTime >= endTime || video.paused) {
          recorder.stop();
          video.pause();
          return;
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        requestAnimationFrame(drawFrame);
      };

      drawFrame();
    } catch (err: any) {
      console.error(err);
      setError(t("videoClipper.error"));
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 px-4 sm:px-0 pb-20 animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl sm:rounded-[32px] bg-app-panel/40 border border-white/5 backdrop-blur-2xl shadow-3xl">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-app-primary/10 flex items-center justify-center text-app-primary ring-1 ring-app-primary/20 shadow-glow-sm">
            <Scissors className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-app-text tracking-tight">
              {t("videoClipper.title")}
            </h1>
            <p className="text-xs font-medium text-app-text-sub opacity-60">
              {t("videoClipper.description")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Video Area */}
        <div className="lg:col-span-8 space-y-4 sm:space-y-6">
          {videoSrc ? (
            <div className="space-y-4 sm:space-y-6">
              <div className="rounded-2xl sm:rounded-[32px] overflow-hidden bg-black border border-white/5">
                <video
                  ref={videoRef}
                  src={videoSrc}
                  onLoadedMetadata={handleLoadedMetadata}
                  onTimeUpdate={handleTimeUpdate}
                  className="w-full max-h-[400px] object-contain"
                />
              </div>

              {/* Timeline Controls */}
              <div className="p-4 sm:p-6 rounded-2xl sm:rounded-[32px] bg-app-panel/40 border border-white/5 space-y-4 sm:space-y-6">
                <div className="flex items-center justify-between">
                  <button
                    onClick={togglePlay}
                    className="w-12 h-12 rounded-full bg-app-primary text-white flex items-center justify-center shadow-glow-sm"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5 ml-0.5" />
                    )}
                  </button>
                  <span className="text-sm font-mono text-app-text-sub">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Clock className="w-4 h-4 text-app-text-sub" />
                    <span className="text-xs font-bold text-app-text-sub w-16">
                      {t("videoClipper.start")}
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={duration}
                      step={0.1}
                      value={startTime}
                      onChange={(e) => setStartTime(parseFloat(e.target.value))}
                      className="flex-1 accent-green-500"
                    />
                    <span className="text-xs font-mono text-green-500 w-14">
                      {formatTime(startTime)}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <Clock className="w-4 h-4 text-app-text-sub" />
                    <span className="text-xs font-bold text-app-text-sub w-16">
                      {t("videoClipper.end")}
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={duration}
                      step={0.1}
                      value={endTime}
                      onChange={(e) => setEndTime(parseFloat(e.target.value))}
                      className="flex-1 accent-red-500"
                    />
                    <span className="text-xs font-mono text-red-500 w-14">
                      {formatTime(endTime)}
                    </span>
                  </div>
                </div>

                <div className="text-center text-xs text-app-text-sub">
                  {t("videoClipper.clipDuration")}:{" "}
                  <strong className="text-app-primary">
                    {formatTime(Math.max(0, endTime - startTime))}
                  </strong>
                </div>
              </div>
            </div>
          ) : (
            <div
              {...getRootProps()}
              className={clsx(
                "relative group border-2 border-dashed rounded-2xl sm:rounded-[40px] transition-all duration-300 flex flex-col items-center justify-center p-8 sm:p-16 cursor-pointer min-h-[300px] sm:min-h-[400px] bg-app-panel/20",
                isDragActive
                  ? "border-app-primary bg-app-primary/5"
                  : "border-white/10 hover:border-app-primary/30"
              )}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-8 text-center">
                <div className="w-24 h-24 rounded-3xl bg-app-bg border border-white/10 flex items-center justify-center text-app-text-sub">
                  <FileUp className="w-12 h-12" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-app-text tracking-tight">
                    {t("videoClipper.dropzone")}
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
              </div>
            </div>
          )}
        </div>

        {/* Action Panel */}
        <div className="lg:col-span-4 space-y-4 sm:space-y-6">
          <div className="p-5 sm:p-8 rounded-2xl sm:rounded-[40px] bg-app-panel/40 border border-white/5 backdrop-blur-xl shadow-2xl space-y-6 sm:space-y-8">
            <div className="space-y-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-app-text-sub flex items-center gap-2">
                <Video className="w-4 h-4" /> {t("videoClipper.output")}
              </h2>
              <div className="p-4 bg-app-primary/10 border border-app-primary/30 rounded-2xl flex items-center gap-3 text-app-primary">
                <Video className="w-5 h-5" />
                <span className="font-bold text-sm">
                  {t("videoClipper.outputType")}
                </span>
              </div>
            </div>

            <button
              onClick={handleClip}
              disabled={!videoSrc || loading || startTime >= endTime}
              className="w-full bg-app-primary text-white font-black py-6 rounded-3xl flex items-center justify-center gap-4 shadow-glow-lg transition-all active:scale-95 disabled:grayscale"
            >
              {loading ? (
                <RefreshCw className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <Scissors className="w-6 h-6" />{" "}
                  <span>{t("videoClipper.clip")}</span>
                </>
              )}
            </button>

            {videoSrc && (
              <button
                onClick={() => {
                  setVideoSrc(null);
                  setFile(null);
                  setSuccess(false);
                }}
                className="w-full bg-white/5 text-app-text-sub font-bold py-4 rounded-2xl hover:bg-white/10 transition-all"
              >
                {t("videoClipper.reset")}
              </button>
            )}
          </div>

          {error && (
            <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-[32px] flex gap-5 items-start text-red-500">
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
            <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-[32px] flex gap-5 items-start text-green-500">
              <CheckCircle2 className="w-10 h-10 shrink-0" />
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest">
                  {t("videoClipper.successTitle")}
                </p>
                <p className="text-sm font-bold leading-snug">
                  {t("videoClipper.success")}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
