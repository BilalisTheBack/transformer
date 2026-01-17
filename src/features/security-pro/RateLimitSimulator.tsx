import { useState, useEffect, useMemo, useRef } from "react";
import {
  Activity,
  Zap,
  ShieldCheck,
  ShieldAlert,
  Settings2,
  Play,
  RotateCcw,
  BarChart3,
  Clock,
  Layers,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface RequestLog {
  id: number;
  timestamp: number;
  status: "allowed" | "blocked" | "burst";
}

export default function RateLimitSimulator() {
  const { t } = useTranslation();

  // Configuration
  const [algorithm, setAlgorithm] = useState<"fixed-window" | "token-bucket">(
    "token-bucket"
  );
  const [limit, setLimit] = useState(10); // Requests per window
  const [windowSize, setWindowSize] = useState(10); // Seconds
  const [burstCapacity, setBurstCapacity] = useState(5);

  // Simulation State
  const [isRunning, setIsRunning] = useState(false);
  const [requests, setRequests] = useState<RequestLog[]>([]);
  const [tokens, setTokens] = useState(10);
  const [nextRefresh, setNextRefresh] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastRequestTimeRef = useRef<number>(Date.now());

  // Derived Stats
  const stats = useMemo(() => {
    const total = requests.length;
    const allowed = requests.filter(
      (r) => r.status === "allowed" || r.status === "burst"
    ).length;
    const blocked = requests.filter((r) => r.status === "blocked").length;
    const rate = total > 0 ? (allowed / total) * 100 : 100;

    return { total, allowed, blocked, rate };
  }, [requests]);

  // Token Bucket Logic
  useEffect(() => {
    if (!isRunning || algorithm !== "token-bucket") return;

    const interval = setInterval(() => {
      setTokens((prev) => {
        const refillRate = limit / windowSize; // Tokens per second
        const newValue = Math.min(
          prev + refillRate / 10,
          limit + burstCapacity
        );
        return newValue;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, algorithm, limit, windowSize, burstCapacity]);

  const handleRequest = () => {
    const now = Date.now();
    let status: "allowed" | "blocked" | "burst" = "blocked";

    if (algorithm === "token-bucket") {
      if (tokens >= 1) {
        status = tokens > limit ? "burst" : "allowed";
        setTokens((prev) => prev - 1);
      }
    } else {
      // Fixed Window logic
      const currentWindowStart =
        Math.floor(now / (windowSize * 1000)) * (windowSize * 1000);
      const requestsInWindow = requests.filter(
        (r) =>
          r.timestamp >= currentWindowStart &&
          (r.status === "allowed" || r.status === "burst")
      ).length;

      if (requestsInWindow < limit) {
        status = "allowed";
      }
    }

    const newRequest: RequestLog = {
      id: now,
      timestamp: now,
      status,
    };

    setRequests((prev) => [newRequest, ...prev].slice(0, 50));
  };

  const reset = () => {
    setRequests([]);
    setTokens(limit);
    setIsRunning(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <div className="p-2 bg-red-600 rounded-lg shadow-lg shadow-red-500/20">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <span className="gradient-text-optimized">
            {t("securityPro.rateLimit.title")}
          </span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("securityPro.rateLimit.description")}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Settings Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-app-panel border border-app-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-app-primary" />
              {t("securityPro.rateLimit.config")}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-app-text-sub mb-2">
                  {t("securityPro.rateLimit.algorithm")}
                </label>
                <select
                  value={algorithm}
                  onChange={(e) => setAlgorithm(e.target.value as any)}
                  className="w-full bg-app-bg border border-app-border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-app-primary outline-none"
                >
                  <option value="token-bucket">
                    {t("securityPro.rateLimit.tokenBucket")}
                  </option>
                  <option value="fixed-window">
                    {t("securityPro.rateLimit.fixedWindow")}
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-app-text-sub mb-2">
                  {t("securityPro.rateLimit.limit")} ({limit} requests)
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={limit}
                  onChange={(e) => setLimit(parseInt(e.target.value))}
                  className="w-full h-2 bg-app-bg rounded-lg appearance-none cursor-pointer accent-app-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-app-text-sub mb-2">
                  {t("securityPro.rateLimit.window")} ({windowSize}s)
                </label>
                <input
                  type="range"
                  min="1"
                  max="60"
                  value={windowSize}
                  onChange={(e) => setWindowSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-app-bg rounded-lg appearance-none cursor-pointer accent-app-primary"
                />
              </div>

              {algorithm === "token-bucket" && (
                <div>
                  <label className="block text-sm font-medium text-app-text-sub mb-2">
                    {t("securityPro.rateLimit.burst")} (+{burstCapacity})
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={burstCapacity}
                    onChange={(e) => setBurstCapacity(parseInt(e.target.value))}
                    className="w-full h-2 bg-app-bg rounded-lg appearance-none cursor-pointer accent-app-primary"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Visualization of State */}
          <div className="bg-app-panel border border-app-border rounded-2xl p-6 shadow-sm overflow-hidden relative">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Layers className="w-5 h-5 text-app-primary" />
              {t("securityPro.rateLimit.liveState")}
            </h2>

            {algorithm === "token-bucket" ? (
              <div className="space-y-6">
                <div className="relative h-4 w-full bg-app-bg rounded-full overflow-hidden border border-app-border">
                  <div
                    className="absolute inset-y-0 left-0 bg-app-primary transition-all duration-300 shadow-[0_0_10px_rgba(var(--app-primary-rgb),0.5)]"
                    style={{
                      width: `${(tokens / (limit + burstCapacity)) * 100}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span>
                    {t("securityPro.rateLimit.tokens")}: {tokens.toFixed(1)}
                  </span>
                  <span>
                    {t("securityPro.rateLimit.max")}: {limit + burstCapacity}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-app-text-sub text-sm">
                {t("securityPro.rateLimit.fixedActive")}
                <br />
                {t("securityPro.rateLimit.nextReset", { s: windowSize })}
              </div>
            )}
          </div>
        </div>

        {/* Action & Stats Panel */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-app-panel border border-app-border rounded-2xl p-4 text-center">
              <div className="text-xs text-app-text-sub mb-1 uppercase tracking-wider font-bold">
                {t("securityPro.rateLimit.stats.total")}
              </div>
              <div className="text-2xl font-bold">{stats.total}</div>
            </div>
            <div className="bg-app-panel border border-app-border rounded-2xl p-4 text-center">
              <div className="text-xs text-app-text-sub mb-1 uppercase tracking-wider font-bold">
                {t("securityPro.rateLimit.stats.allowed")}
              </div>
              <div className="text-2xl font-bold text-green-500">
                {stats.allowed}
              </div>
            </div>
            <div className="bg-app-panel border border-app-border rounded-2xl p-4 text-center">
              <div className="text-xs text-app-text-sub mb-1 uppercase tracking-wider font-bold">
                {t("securityPro.rateLimit.stats.blocked")}
              </div>
              <div className="text-2xl font-bold text-red-500">
                {stats.blocked}
              </div>
            </div>
            <div className="bg-app-panel border border-app-border rounded-2xl p-4 text-center">
              <div className="text-xs text-app-text-sub mb-1 uppercase tracking-wider font-bold">
                {t("securityPro.rateLimit.stats.success")}
              </div>
              <div className="text-2xl font-bold text-app-primary">
                {stats.rate.toFixed(1)}%
              </div>
            </div>
          </div>

          <div className="bg-app-panel border border-app-border rounded-2xl p-8 flex flex-col items-center justify-center space-y-6 min-h-[300px] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-app-primary/5 via-transparent to-transparent pointer-events-none" />

            <button
              onClick={handleRequest}
              className="group relative w-24 h-24 bg-app-primary text-white rounded-full shadow-2xl shadow-app-primary/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-10"
            >
              <Zap className="w-10 h-10 group-hover:animate-pulse" />
              <div className="absolute -inset-4 bg-app-primary/20 rounded-full animate-ping opacity-20 pointer-events-none" />
            </button>

            <div className="text-center space-y-2">
              <p className="font-bold text-xl">
                {t("securityPro.rateLimit.fire")}
              </p>
              <p className="text-app-text-sub text-sm">
                {t("securityPro.rateLimit.fireDesc")}
              </p>
            </div>

            <div className="flex gap-4 w-full max-w-sm">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl border font-bold transition-all ${
                  isRunning
                    ? "bg-red-500/10 border-red-500 text-red-500 hover:bg-red-500/20"
                    : "bg-green-500/10 border-green-500 text-green-500 hover:bg-green-500/20"
                }`}
              >
                {isRunning ? (
                  <RotateCcw className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                {isRunning
                  ? t("securityPro.rateLimit.stop")
                  : t("securityPro.rateLimit.start")}
              </button>
              <button
                onClick={reset}
                className="px-6 py-3 bg-app-bg border border-app-border rounded-xl hover:bg-app-border transition-all"
              >
                {t("securityPro.rateLimit.clear")}
              </button>
            </div>
          </div>

          <div className="bg-app-panel border border-app-border rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-app-border flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-app-primary" />
                {t("securityPro.rateLimit.logs")}
              </h3>
            </div>
            <div className="divide-y divide-app-border max-h-[240px] overflow-y-auto no-scrollbar">
              {requests.length === 0 ? (
                <div className="p-12 text-center text-app-text-sub">
                  {t("securityPro.rateLimit.waiting")}
                </div>
              ) : (
                requests.map((r) => (
                  <div
                    key={r.id}
                    className="px-6 py-3 flex items-center justify-between animate-in slide-in-from-left-4 duration-300"
                  >
                    <div className="flex items-center gap-4">
                      {r.status === "allowed" && (
                        <ShieldCheck className="w-5 h-5 text-green-500" />
                      )}
                      {r.status === "burst" && (
                        <Zap className="w-5 h-5 text-yellow-500" />
                      )}
                      {r.status === "blocked" && (
                        <ShieldAlert className="w-5 h-5 text-red-500" />
                      )}
                      <span className="text-sm font-medium">
                        Request Simulation
                      </span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          r.status === "allowed"
                            ? "bg-green-500/10 text-green-500"
                            : r.status === "burst"
                            ? "bg-yellow-500/10 text-yellow-500"
                            : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {r.status}
                      </span>
                      <span className="text-xs text-app-text-sub flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {new Date(r.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
