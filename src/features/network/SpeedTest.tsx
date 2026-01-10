import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Activity, Download, RefreshCw, Upload, Wifi, Zap } from "lucide-react";

export default function SpeedTest() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<"idle" | "ping" | "download" | "upload">(
    "idle"
  );
  const [results, setResults] = useState<{
    ping: number | null;
    jitter: number | null;
    download: number | null;
    upload: number | null;
  }>({ ping: null, jitter: null, download: null, upload: null });

  const [liveSpeed, setLiveSpeed] = useState(0);
  const [progress, setProgress] = useState(0);

  const testSpeed = async () => {
    setStatus("ping");
    setProgress(0);
    setLiveSpeed(0);
    setResults({ ping: null, jitter: null, download: null, upload: null });

    try {
      // 1. Ping & Jitter Test
      const pings: number[] = [];
      for (let i = 0; i < 5; i++) {
        const start = performance.now();
        await fetch("https://www.google.com/favicon.ico", {
          mode: "no-cors",
          cache: "no-store",
        });
        const end = performance.now();
        pings.push(end - start);
        setProgress((i + 1) * 4); // Up to 20%
      }

      const minPing = Math.min(...pings);
      const avgPing = Math.round(
        pings.reduce((a, b) => a + b, 0) / pings.length
      );
      // Simple jitter calculation: average difference from mean
      const jitter = Math.round(
        pings.reduce((acc, curr) => acc + Math.abs(curr - avgPing), 0) /
          pings.length
      );

      setResults((prev) => ({ ...prev, ping: avgPing, jitter }));

      // 2. Download Test
      setStatus("download");
      const imageAddr =
        "https://upload.wikimedia.org/wikipedia/commons/2/2d/Snake_River_%285mb%29.jpg";
      const downloadSize = 5242880; // ~5MB

      const startTime = performance.now();
      const download = new Image();

      // Artificial progress for download since Image() doesn't give progress events
      let downloadProgress = 20;
      const dlInterval = setInterval(() => {
        downloadProgress = Math.min(downloadProgress + 5, 55);
        setProgress(downloadProgress);
      }, 200);

      download.onload = () => {
        clearInterval(dlInterval);
        const endTime = performance.now();
        const duration = (endTime - startTime) / 1000;
        const bitsLoaded = downloadSize * 8;
        const speedBps = bitsLoaded / duration;
        const speedMbps = (speedBps / (1024 * 1024)).toFixed(2);

        setResults((prev) => ({ ...prev, download: parseFloat(speedMbps) }));
        setLiveSpeed(parseFloat(speedMbps));
        startUploadTest();
      };

      download.onerror = () => {
        clearInterval(dlInterval);
        cancelTest();
      };

      download.src = imageAddr + "?n=" + Math.random();
    } catch (e) {
      console.error(e);
      cancelTest();
    }
  };

  const startUploadTest = () => {
    setStatus("upload");
    setProgress(60);
    setLiveSpeed(0);

    // Creates a 2MB blob
    const payload = new Blob([new ArrayBuffer(2 * 1024 * 1024)]);
    const xhr = new XMLHttpRequest();
    const startTime = performance.now();

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        // Map 0-100 of upload to 60-100 of total progress
        setProgress(60 + percentComplete * 0.4);
      }
    };

    xhr.onload = () => {
      const endTime = performance.now();
      const duration = (endTime - startTime) / 1000;
      const bitsLoaded = payload.size * 8;
      const speedBps = bitsLoaded / duration;
      const speedMbps = (speedBps / (1024 * 1024)).toFixed(2);

      setResults((prev) => ({ ...prev, upload: parseFloat(speedMbps) }));
      setLiveSpeed(parseFloat(speedMbps));
      setStatus("idle");
      setProgress(100);
    };

    xhr.onerror = () => {
      cancelTest();
    };

    // Use httpbin for echo - widespread enough for a demo
    xhr.open("POST", "https://httpbin.org/post");
    xhr.send(payload);
  };

  const cancelTest = () => {
    setStatus("idle");
    setProgress(0);
    setLiveSpeed(0);
  };

  const getGaugeColor = () => {
    if (status === "download") return "text-cyan-400";
    if (status === "upload") return "text-purple-400";
    return "text-app-primary";
  };

  const getGaugeValue = () => {
    if (status === "idle" && results.download) return results.download; // Show download as primary result at end
    return liveSpeed;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12 animate-in fade-in zoom-in duration-500">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold gradient-text-optimized">
          {t("speedTest.title")}
        </h1>
        <p className="text-xl text-app-text-sub max-w-2xl mx-auto">
          {t("speedTest.description")}
        </p>
      </div>

      <div className="w-full max-w-2xl mx-auto p-8 rounded-3xl bg-app-panel border border-app-border shadow-2xl relative overflow-hidden">
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-12">
          {/* Speed Gauge */}
          <div className="relative group cursor-default">
            <div
              className={`absolute -inset-4 bg-gradient-to-r ${
                status === "upload"
                  ? "from-purple-500/20 to-pink-500/20"
                  : "from-cyan-500/20 to-blue-500/20"
              } rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
            />
            <div className="relative w-64 h-64 rounded-full border-8 border-app-border bg-app-bg flex flex-col items-center justify-center shadow-inner transition-colors duration-500">
              {status !== "idle" ? (
                <>
                  {status === "download" && (
                    <Download className="w-12 h-12 text-cyan-400 animate-bounce mb-2" />
                  )}
                  {status === "upload" && (
                    <Upload className="w-12 h-12 text-purple-400 animate-bounce mb-2" />
                  )}
                  {status === "ping" && (
                    <Activity className="w-12 h-12 text-yellow-400 animate-pulse mb-2" />
                  )}

                  <span
                    className={`text-4xl font-mono font-bold tabular-nums ${getGaugeColor()}`}
                  >
                    {getGaugeValue() || "..."}
                  </span>
                  <span className="text-sm text-app-text-sub uppercase tracking-wider mt-1">
                    {status === "ping"
                      ? t("speedTest.ms")
                      : t("speedTest.mbps")}
                  </span>
                </>
              ) : results.download ? (
                <>
                  <Wifi className="w-12 h-12 text-green-500 mb-2" />
                  <span className="text-5xl font-mono font-bold text-green-500 tabular-nums">
                    {results.download}
                  </span>
                  <span className="text-xs text-app-text-sub uppercase tracking-wider mt-1">
                    {t("speedTest.download")}
                  </span>
                </>
              ) : (
                <>
                  <Zap className="w-16 h-16 text-app-text-sub opacity-50 mb-2" />
                  <span className="text-lg text-app-text-sub">
                    {t("speedTest.pressStart")}
                  </span>
                </>
              )}

              {/* Progress Ring */}
              {status !== "idle" && (
                <svg
                  className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-app-border"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="289" // 2 * PI * 46
                    strokeDashoffset={289 - (289 * progress) / 100}
                    className={`transition-all duration-300 ${
                      status === "upload" ? "text-purple-500" : "text-cyan-500"
                    }`}
                  />
                </svg>
              )}
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            <MetricBox
              icon={Activity}
              label={t("speedTest.ping")}
              value={results.ping}
              unit={t("speedTest.ms")}
              active={status === "ping"}
            />
            <MetricBox
              icon={Zap}
              label={t("speedTest.jitter")}
              value={results.jitter}
              unit={t("speedTest.ms")}
              active={status === "ping"}
            />
            <MetricBox
              icon={Download}
              label={t("speedTest.download")}
              value={results.download}
              unit={t("speedTest.mbps")}
              active={status === "download"}
              color="text-cyan-400"
            />
            <MetricBox
              icon={Upload}
              label={t("speedTest.upload")}
              value={results.upload}
              unit={t("speedTest.mbps")}
              active={status === "upload"}
              color="text-purple-400"
            />
          </div>

          {/* Action Button */}
          <button
            onClick={testSpeed}
            disabled={status !== "idle"}
            className={`
                    relative px-12 py-4 rounded-full font-bold text-lg tracking-wide transition-all duration-300
                    ${
                      status !== "idle"
                        ? "bg-app-border text-app-text-sub cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105 active:scale-95"
                    }
                `}
          >
            {status !== "idle" ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin" />
                {t("speedTest.progress")}
              </span>
            ) : results.download ? (
              t("speedTest.restart")
            ) : (
              t("speedTest.start")
            )}
          </button>
        </div>
      </div>

      <p className="text-xs text-app-text-sub max-w-md text-center opacity-60">
        {t("speedTest.disclaimer")}
      </p>
    </div>
  );
}

function MetricBox({
  icon: Icon,
  label,
  value,
  unit,
  active,
  color = "text-app-text",
}: any) {
  return (
    <div
      className={`
            flex flex-col items-center p-4 rounded-2xl border transition-colors duration-300
            ${
              active
                ? "bg-app-panel border-app-primary/50 shadow-lg"
                : "bg-app-bg border-app-border"
            }
        `}
    >
      <span className="flex items-center gap-2 text-xs font-medium text-app-text-sub uppercase tracking-wider mb-1">
        <Icon className="w-3 h-3" />
        {label}
      </span>
      <span
        className={`text-xl md:text-2xl font-bold font-mono ${
          value ? color : "text-app-text"
        }`}
      >
        {value !== null ? value : "--"}
        <span className="text-xs md:text-sm text-app-text-sub ml-1 font-normal">
          {unit}
        </span>
      </span>
    </div>
  );
}
