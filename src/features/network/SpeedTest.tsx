import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Activity, Download, RefreshCw, Wifi } from "lucide-react";

export default function SpeedTest() {
  const { t } = useTranslation();
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<{
    ping: number | null;
    download: number | null;
  }>({ ping: null, download: null });
  const [progress, setProgress] = useState(0);

  const testSpeed = async () => {
    setTesting(true);
    setProgress(0);
    setResults({ ping: null, download: null });

    try {
      // 1. Ping Test
      const pingStart = performance.now();
      await fetch("https://www.google.com/favicon.ico", {
        mode: "no-cors",
        cache: "no-store",
      });
      const pingEnd = performance.now();
      const ping = Math.round(pingEnd - pingStart);
      setResults((prev) => ({ ...prev, ping }));
      setProgress(30);

      // 2. Download Test (Using a 5MB equivalent file from a reliable CDN or generated blob)
      // We'll use a public image from specific fast CDN
      const imageAddr =
        "https://upload.wikimedia.org/wikipedia/commons/2/2d/Snake_River_%285mb%29.jpg";
      const downloadSize = 5242880; // ~5MB

      const startTime = performance.now();
      const download = new Image();
      download.onload = () => {
        const endTime = performance.now();
        const duration = (endTime - startTime) / 1000; // seconds
        const bitsLoaded = downloadSize * 8;
        const speedBps = bitsLoaded / duration;
        const speedMbps = (speedBps / (1024 * 1024)).toFixed(2);

        setResults((prev) => ({ ...prev, download: parseFloat(speedMbps) }));
        setTesting(false);
        setProgress(100);
      };

      download.onerror = () => {
        setTesting(false);
        setProgress(0);
      };

      // Cache buster
      download.src = imageAddr + "?n=" + Math.random();

      // Simulate progress while downloading
      let currentProgress = 30;
      const interval = setInterval(() => {
        if (currentProgress < 90) {
          currentProgress += 5;
          setProgress(currentProgress);
        } else {
          clearInterval(interval);
        }
      }, 200);
    } catch (e) {
      console.error(e);
      setTesting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12 animate-in fade-in zoom-in duration-500">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
          {t("speedTest.title")}
        </h1>
        <p className="text-xl text-app-text-sub max-w-2xl mx-auto">
          {t("speedTest.description")}
        </p>
      </div>

      <div className="w-full max-w-xl mx-auto p-8 rounded-3xl bg-app-panel border border-app-border shadow-2xl relative overflow-hidden">
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-12">
          {/* Speed Display */}
          <div className="relative group cursor-default">
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative w-64 h-64 rounded-full border-8 border-app-border bg-app-bg flex flex-col items-center justify-center shadow-inner">
              {testing ? (
                <>
                  <Activity className="w-12 h-12 text-cyan-400 animate-bounce mb-2" />
                  <span className="text-4xl font-mono font-bold text-app-text tabular-nums">
                    {progress === 100 ? results.download : "..."}
                  </span>
                  <span className="text-sm text-app-text-sub uppercase tracking-wider mt-1">
                    {t("speedTest.mbps")}
                  </span>
                </>
              ) : results.download ? (
                <>
                  <Wifi className="w-12 h-12 text-green-500 mb-2" />
                  <span className="text-5xl font-mono font-bold text-green-500 tabular-nums">
                    {results.download}
                  </span>
                  <span className="text-sm text-app-text-sub uppercase tracking-wider mt-1">
                    {t("speedTest.mbps")}
                  </span>
                </>
              ) : (
                <>
                  <Wifi className="w-16 h-16 text-app-text-sub opacity-50 mb-2" />
                  <span className="text-lg text-app-text-sub">
                    {t("common.press")} Start
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-8 w-full max-w-sm">
            <div className="flex flex-col items-center p-4 rounded-2xl bg-app-bg border border-app-border">
              <span className="flex items-center gap-2 text-xs font-medium text-app-text-sub uppercase tracking-wider mb-1">
                <Activity className="w-3 h-3" />
                {t("speedTest.ping")}
              </span>
              <span className="text-2xl font-bold font-mono">
                {results.ping !== null ? results.ping : "--"}
                <span className="text-sm text-app-text-sub ml-1 font-normal">
                  {t("speedTest.ms")}
                </span>
              </span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-2xl bg-app-bg border border-app-border">
              <span className="flex items-center gap-2 text-xs font-medium text-app-text-sub uppercase tracking-wider mb-1">
                <Download className="w-3 h-3" />
                {t("speedTest.download")}
              </span>
              <span className="text-2xl font-bold font-mono">
                {results.download !== null ? results.download : "--"}
                <span className="text-sm text-app-text-sub ml-1 font-normal">
                  {t("speedTest.mbps")}
                </span>
              </span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={testSpeed}
            disabled={testing}
            className={`
                    relative px-12 py-4 rounded-full font-bold text-lg tracking-wide transition-all duration-300
                    ${
                      testing
                        ? "bg-app-border text-app-text-sub cursor-not-allowed"
                        : "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-105 active:scale-95"
                    }
                `}
          >
            {testing ? (
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
        * Estimates are based on HTTP download speed from a public CDN. Real
        connection speed may vary based on route and server load.
      </p>
    </div>
  );
}
