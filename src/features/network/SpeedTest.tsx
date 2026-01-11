import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  Activity,
  Download,
  RefreshCw,
  Upload,
  Wifi,
  Zap,
  Globe,
  MapPin,
  Server,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NetworkInfo {
  ip: string;
  isp: string;
  city: string;
  country_name: string;
  org: string;
}

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

  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [liveSpeed, setLiveSpeed] = useState(0);
  const [progress, setProgress] = useState(0);

  // Fetch Network Identity
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        setNetworkInfo(data);
      } catch (e) {
        console.error("Identity fetch failed", e);
      }
    };
    fetchInfo();
  }, []);

  const testPing = useCallback(async () => {
    setStatus("ping");
    const pings: number[] = [];
    for (let i = 0; i < 8; i++) {
      const start = performance.now();
      try {
        await fetch("https://www.google.com/favicon.ico", {
          mode: "no-cors",
          cache: "no-store",
        });
        const end = performance.now();
        pings.push(end - start);
      } catch (e) {
        pings.push(50); // Fallback
      }
      setProgress((i + 1) * 2.5); // Up to 20%
      await new Promise((r) => setTimeout(r, 100));
    }

    const avgPing = Math.round(pings.reduce((a, b) => a + b, 0) / pings.length);
    const jitter = Math.round(
      pings.reduce((acc, curr) => acc + Math.abs(curr - avgPing), 0) /
        pings.length
    );

    setResults((prev) => ({ ...prev, ping: avgPing, jitter }));
    return true;
  }, []);

  const testDownload = useCallback(async () => {
    setStatus("download");
    const testFile =
      "https://upload.wikimedia.org/wikipedia/commons/3/3e/Tokyo_Sky_Tree_2012.JPG"; // Large high-res image
    const fileSize = 8 * 1024 * 1024; // Approx 8MB for a decent sample

    const startTime = performance.now();
    try {
      const response = await fetch(testFile + "?t=" + Date.now(), {
        cache: "no-store",
      });
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader");

      let receivedLength = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        receivedLength += value.length;
        const currentProgress = (receivedLength / fileSize) * 100;
        setProgress(20 + currentProgress * 0.4); // 20% to 60%

        const elapsed = (performance.now() - startTime) / 1000;
        const speedMbps = (receivedLength * 8) / (1024 * 1024) / elapsed;
        setLiveSpeed(parseFloat(speedMbps.toFixed(2)));
      }

      const totalTime = (performance.now() - startTime) / 1000;
      const finalSpeed = (receivedLength * 8) / (1024 * 1024) / totalTime;
      setResults((prev) => ({
        ...prev,
        download: parseFloat(finalSpeed.toFixed(2)),
      }));
    } catch (e) {
      console.error("DL Error", e);
    }
    return true;
  }, []);

  const testUpload = useCallback(async () => {
    setStatus("upload");
    setLiveSpeed(0);

    // 10MB Payload for high accuracy on modern connections
    const size = 10 * 1024 * 1024;
    const data = new Uint8Array(size);
    window.crypto.getRandomValues(data);
    const blob = new Blob([data]);

    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      const startTime = performance.now();

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = (e.loaded / e.total) * 100;
          setProgress(60 + percent * 0.4); // 60% to 100%
          const elapsed = (performance.now() - startTime) / 1000;
          const speedMbps = (e.loaded * 8) / (1024 * 1024) / elapsed;
          setLiveSpeed(parseFloat(speedMbps.toFixed(2)));
        }
      };

      xhr.onload = () => {
        const totalTime = (performance.now() - startTime) / 1000;
        const finalSpeed = (size * 8) / (1024 * 1024) / totalTime;
        setResults((prev) => ({
          ...prev,
          upload: parseFloat(finalSpeed.toFixed(2)),
        }));
        setLiveSpeed(parseFloat(finalSpeed.toFixed(2)));
        setStatus("idle");
        setProgress(100);
        resolve(true);
      };

      xhr.onerror = () => {
        setStatus("idle");
        resolve(false);
      };

      xhr.open("POST", "https://httpbin.org/post"); // Echo server
      xhr.send(blob);
    });
  }, []);

  const startTest = async () => {
    setResults({ ping: null, jitter: null, download: null, upload: null });
    setProgress(0);
    setLiveSpeed(0);

    await testPing();
    await testDownload();
    await testUpload();
  };

  const currentPrimarySpeed =
    status === "idle" ? results.download || 0 : liveSpeed;

  return (
    <div className="flex flex-col items-center max-w-5xl mx-auto space-y-8 p-4 md:p-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black tracking-tighter premium-gradient"
        >
          {t("speedTest.title")}
        </motion.h1>
        <p className="text-app-text-sub text-lg max-w-xl mx-auto">
          {t("speedTest.description")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
        {/* Left: Identity & Info */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-3xl bg-app-panel border border-app-border shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Globe className="w-20 h-20 text-app-primary" />
            </div>
            <h3 className="text-sm font-bold text-app-primary uppercase tracking-widest mb-6 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              {t("speedTest.networkInfo")}
            </h3>

            <div className="space-y-5">
              <InfoRow
                icon={Server}
                label={t("speedTest.isp")}
                value={networkInfo?.isp || networkInfo?.org || "..."}
              />
              <InfoRow
                icon={ShieldCheck}
                label={t("speedTest.ip")}
                value={networkInfo?.ip || "..."}
              />
              <InfoRow
                icon={MapPin}
                label={t("speedTest.location")}
                value={
                  networkInfo
                    ? `${networkInfo.city}, ${networkInfo.country_name}`
                    : "..."
                }
              />
            </div>
          </motion.div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-2 gap-4">
            <StatBox
              label={t("speedTest.ping")}
              value={results.ping}
              unit="ms"
              icon={Activity}
              color="text-yellow-400"
              loading={status === "ping"}
            />
            <StatBox
              label={t("speedTest.jitter")}
              value={results.jitter}
              unit="ms"
              icon={Zap}
              color="text-orange-400"
              loading={status === "ping"}
            />
          </div>
        </div>

        {/* Center: Major Gauge */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center p-8 rounded-3xl bg-app-panel/50 border border-app-border backdrop-blur-xl shadow-2xl relative">
          {/* Scientific Grid Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,212,255,0.05),transparent_70%)]" />

          <div className="relative w-72 h-72 md:w-96 md:h-96">
            {/* Progress SVG */}
            <svg
              className="absolute inset-0 w-full h-full -rotate-90 scale-x-[-1]"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-app-border/20"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#gaugeGradient)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="283"
                initial={{ strokeDashoffset: 283 }}
                animate={{
                  strokeDashoffset:
                    283 - (283 * (status === "idle" ? 100 : progress)) / 100,
                }}
                transition={{ type: "spring", stiffness: 50 }}
              />
              <defs>
                <linearGradient
                  id="gaugeGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>

            {/* Live Counter */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={status}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                >
                  {status === "download" && (
                    <Download className="w-8 h-8 text-cyan-400 animate-bounce" />
                  )}
                  {status === "upload" && (
                    <Upload className="w-8 h-8 text-purple-400 animate-bounce" />
                  )}
                  {status === "idle" && results.download && (
                    <Wifi className="w-10 h-10 text-green-500" />
                  )}
                  {status === "idle" && !results.download && (
                    <Zap className="w-10 h-10 text-app-text-sub opacity-30" />
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex flex-col items-center">
                <span className="text-7xl md:text-8xl font-black font-mono tracking-tighter tabular-nums premium-gradient">
                  {Math.round(currentPrimarySpeed)}
                </span>
                <span className="text-xl font-bold text-app-text-sub uppercase tracking-widest -mt-2">
                  {t("speedTest.mbps")}
                </span>
              </div>
            </div>
          </div>

          {/* Action Area */}
          <div className="mt-12 w-full max-w-md space-y-6 text-center">
            <button
              onClick={startTest}
              disabled={status !== "idle"}
              className={`
                 w-full py-5 rounded-2xl font-black text-xl tracking-tighter transition-all duration-300 relative overflow-hidden group
                 ${
                   status !== "idle"
                     ? "bg-app-border text-app-text-sub cursor-not-allowed"
                     : "bg-white dark:bg-app-text text-app-bg hover:scale-[1.02] shadow-xl hover:shadow-cyan-500/20 active:scale-95"
                 }
               `}
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {status !== "idle" ? (
                  <>
                    <RefreshCw className="w-6 h-6 animate-spin" />
                    {t("speedTest.progress")}
                  </>
                ) : results.download ? (
                  t("speedTest.restart")
                ) : (
                  t("speedTest.start")
                )}
              </div>
              {status === "idle" && (
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </button>

            {/* Sub-results */}
            <div className="flex justify-center gap-12">
              <div className="text-center group">
                <p className="text-xs font-bold text-app-text-sub uppercase tracking-widest transition-colors group-hover:text-cyan-400">
                  {t("speedTest.download")}
                </p>
                <p className="text-2xl font-mono font-bold text-app-text">
                  {results.download || "--"}
                </p>
              </div>
              <div className="text-center group">
                <p className="text-xs font-bold text-app-text-sub uppercase tracking-widest transition-colors group-hover:text-purple-400">
                  {t("speedTest.upload")}
                </p>
                <p className="text-2xl font-mono font-bold text-app-text">
                  {results.upload || "--"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-app-text-sub opacity-40 max-w-sm text-center italic">
        {t("speedTest.disclaimer")}
      </p>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="p-2 rounded-xl bg-app-bg border border-app-border">
        <Icon className="w-5 h-5 text-app-primary" />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-[10px] text-app-text-sub uppercase font-bold tracking-widest">
          {label}
        </span>
        <span className="text-sm font-semibold truncate text-app-text">
          {value}
        </span>
      </div>
    </div>
  );
}

function StatBox({ label, value, unit, icon: Icon, color, loading }: any) {
  return (
    <div
      className={`p-4 rounded-3xl bg-app-panel border border-app-border shadow-lg transition-all ${
        loading ? "ring-2 ring-app-primary ring-opacity-50" : ""
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`w-3 h-3 ${color}`} />
        <span className="text-[10px] font-bold text-app-text-sub uppercase tracking-widest">
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span
          className={`text-xl font-black font-mono ${
            value ? "text-app-text" : "text-app-text-sub"
          }`}
        >
          {value || "--"}
        </span>
        <span className="text-[10px] text-app-text-sub font-bold">{unit}</span>
      </div>
    </div>
  );
}
