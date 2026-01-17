import { useState } from "react";
import {
  Search,
  Terminal,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  BarChart3,
  Cpu,
  Brain,
  Sparkles,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface LogEntry {
  level: "info" | "warn" | "error" | "debug";
  message: string;
  timestamp: string;
}

export default function AiLogAnalyzer() {
  const { t } = useTranslation();
  const [logs, setLogs] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<{
    summary: string;
    metrics: { errorRate: string; avgResponse: string; load: string };
    recommendations: string[];
    parsed: LogEntry[];
  } | null>(null);

  const analyzeLogs = () => {
    if (!logs) return;
    setLoading(true);

    // Simulated AI Log Deep Analysis
    setTimeout(() => {
      setAnalysis({
        summary:
          "Detected a recurring pattern of database connection timeouts during the 14:00 - 14:30 interval. This correlates with a 300% spike in traffic on the /api/orders endpoint.",
        metrics: {
          errorRate: "4.2%",
          avgResponse: "840ms",
          load: "CRITICAL",
        },
        recommendations: [
          "Scale up your database read replicas.",
          "Implement request throttling on the /api/orders endpoint.",
          "Review SQL index health for the 'orders' table.",
        ],
        parsed: [
          {
            level: "info",
            message: "Server started on port 3000",
            timestamp: "14:00:01",
          },
          {
            level: "warn",
            message: "High memory usage detected (85%)",
            timestamp: "14:15:22",
          },
          {
            level: "error",
            message: "DB Connection Timeout: Pool exhausted",
            timestamp: "14:22:45",
          },
          {
            level: "error",
            message: "504 Gateway Timeout on /api/orders",
            timestamp: "14:22:50",
          },
          {
            level: "debug",
            message: "Cleaning up stale connections",
            timestamp: "14:23:10",
          },
        ],
      });
      setLoading(false);
    }, 1800);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
            <Search className="w-6 h-6 text-white" />
          </div>
          <span className="gradient-text-optimized">
            {t("aiInsights.logAnalyzer.title")}
          </span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("aiInsights.logAnalyzer.description")}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-app-panel border border-app-border rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-app-text-sub uppercase tracking-widest flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                {t("aiInsights.logAnalyzer.config")}
              </h2>
              <button
                onClick={() => setLogs("")}
                className="text-[10px] font-bold text-app-primary hover:underline"
              >
                {t("securityPro.rateLimit.clear")}
              </button>
            </div>
            <textarea
              value={logs}
              onChange={(e) => setLogs(e.target.value)}
              placeholder={t("aiInsights.logAnalyzer.placeholder")}
              className="w-full h-96 bg-app-bg border-2 border-app-border rounded-xl p-4 font-mono text-[10px] resize-none focus:ring-4 focus:ring-app-primary/10 focus:border-app-primary outline-none transition-all placeholder:opacity-30 scrollbar-thin"
            />
            <button
              onClick={analyzeLogs}
              disabled={loading || !logs}
              className="w-full py-4 bg-app-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-app-primary/20 disabled:opacity-50"
            >
              {loading ? (
                <Sparkles className="w-5 h-5 animate-spin" />
              ) : (
                <Brain className="w-5 h-5" />
              )}
              {loading ? "..." : t("aiInsights.logAnalyzer.analyze")}
            </button>
          </div>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-7 space-y-6">
          {analysis ? (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-app-panel border border-app-border rounded-2xl p-4 text-center">
                  <p className="text-[10px] font-black text-app-text-sub uppercase mb-1">
                    Error
                  </p>
                  <p className="text-xl font-black text-rose-500">
                    {analysis.metrics.errorRate}
                  </p>
                </div>
                <div className="bg-app-panel border border-app-border rounded-2xl p-4 text-center">
                  <p className="text-[10px] font-black text-app-text-sub uppercase mb-1">
                    Resp
                  </p>
                  <p className="text-xl font-black text-app-primary">
                    {analysis.metrics.avgResponse}
                  </p>
                </div>
                <div className="bg-app-panel border border-app-border rounded-2xl p-4 text-center">
                  <p className="text-[10px] font-black text-app-text-sub uppercase mb-1">
                    Load
                  </p>
                  <p className="text-xl font-black text-red-500">
                    {analysis.metrics.load}
                  </p>
                </div>
              </div>

              {/* Summary Card */}
              <div className="bg-app-panel border border-app-border rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <BarChart3 className="w-24 h-24" />
                </div>
                <div className="relative z-10 space-y-4">
                  <h3 className="font-bold flex items-center gap-2">
                    <Brain className="w-5 h-5 text-app-primary" />
                    {t("aiInsights.logAnalyzer.result")}
                  </h3>
                  <p className="text-sm text-app-text-sub leading-relaxed">
                    {analysis.summary}
                  </p>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-app-panel border border-app-border rounded-2xl p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-emerald-500" />
                  Tips
                </h3>
                <div className="space-y-2">
                  {analysis.recommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 bg-app-bg border border-app-border rounded-xl text-xs"
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                      {rec}
                    </div>
                  ))}
                </div>
              </div>

              {/* Parsed Visualizer */}
              <div className="bg-app-panel border border-app-border rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-app-border bg-app-bg/50 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Recognition
                  </span>
                  <div className="flex gap-2">
                    <Filter className="w-3 h-3 opacity-50" />
                    <Activity className="w-3 h-3 opacity-50" />
                  </div>
                </div>
                <div className="divide-y divide-app-border">
                  {analysis.parsed.map((entry, idx) => (
                    <div
                      key={idx}
                      className="p-4 flex items-start gap-4 hover:bg-app-bg/50 transition-colors"
                    >
                      <div className="mt-1">
                        {entry.level === "error" ? (
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        ) : (
                          <Clock className="w-4 h-4 text-app-text-sub" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-3">
                          <span
                            className={`text-[10px] font-black uppercase ${
                              entry.level === "error"
                                ? "text-red-500"
                                : entry.level === "warn"
                                ? "text-amber-500"
                                : "text-blue-500"
                            }`}
                          >
                            {entry.level}
                          </span>
                          <span className="text-[10px] font-mono text-app-text-sub">
                            {entry.timestamp}
                          </span>
                        </div>
                        <p className="text-xs font-mono break-all">
                          {entry.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full border-2 border-dashed border-app-border rounded-2xl flex flex-col items-center justify-center p-12 text-center space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-app-primary/10 rounded-full blur-2xl animate-pulse" />
                <div className="relative p-6 bg-app-panel rounded-3xl border border-app-border shadow-xl">
                  <Activity className="w-12 h-12 text-app-primary opacity-30" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  {t("aiInsights.logAnalyzer.ready")}
                </h3>
                <p className="text-sm text-app-text-sub max-w-sm mx-auto mt-2">
                  {t("aiInsights.logAnalyzer.readyDesc")}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
