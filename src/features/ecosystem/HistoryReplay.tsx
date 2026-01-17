import { useState } from "react";
import {
  History,
  RotateCcw,
  Trash2,
  Search,
  Clock,
  Filter,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Calendar,
  Layers,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface HistoryItem {
  id: string;
  tool: string;
  category: string;
  timestamp: string;
  status: "success" | "failed";
  summary: string;
}

export default function HistoryReplay() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: "1",
      tool: "API Tester",
      category: "Live Tools",
      timestamp: "14:35",
      status: "success",
      summary: "POST /v1/users returned 201",
    },
    {
      id: "2",
      tool: "JWT Validator",
      category: "Security Pro",
      timestamp: "14:12",
      status: "success",
      summary: "HS256 signature verified locally",
    },
    {
      id: "3",
      tool: "Image Compressor",
      category: "Visual Tools",
      timestamp: "13:55",
      status: "success",
      summary: "Reduced logo.png by 64%",
    },
    {
      id: "4",
      tool: "SERP Tracker",
      category: "SEO & Growth",
      timestamp: "12:40",
      status: "failed",
      summary: "CORS timeout on mobile simulation",
    },
    {
      id: "5",
      tool: "Regex Explainer",
      category: "AI Insights",
      timestamp: "Yesterday",
      status: "success",
      summary: "Explained email validation logic",
    },
  ]);

  const clearHistory = () => {
    if (confirm("Clear all tool history?")) {
      setHistory([]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <div className="p-2 bg-slate-600 rounded-lg shadow-lg shadow-slate-500/20">
            <History className="w-6 h-6 text-white" />
          </div>
          <span className="gradient-text-optimized">
            {t("ecosystem.history.title")}
          </span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("ecosystem.history.description")}
        </p>
      </header>

      <div className="bg-app-panel border border-app-border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-app-text-sub" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("home.searchPlaceholder")}
            className="w-full bg-app-bg border border-app-border rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-app-primary outline-none"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-4 py-3 bg-app-bg border border-app-border rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-app-panel transition-all">
            <Filter className="w-4 h-4" />
            {t("home.filters")}
          </button>
          <button
            onClick={clearHistory}
            className="flex-1 md:flex-none px-4 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            {t("securityPro.rateLimit.clear")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12 space-y-4">
          {history.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-app-border rounded-2xl space-y-4">
              <History className="w-12 h-12 mx-auto text-app-text-sub opacity-20" />
              <p className="text-app-text-sub font-medium">
                {t("ecosystem.history.noHistory")}
              </p>
            </div>
          ) : (
            <div className="bg-app-panel border border-app-border rounded-2xl overflow-hidden divide-y divide-app-border shadow-sm">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="group p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-app-bg/50 transition-all"
                >
                  <div className="flex items-start gap-5">
                    <div
                      className={`mt-1 p-2 rounded-xl ${
                        item.status === "success"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {item.status === "success" ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <RotateCcw className="w-5 h-5" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-bold text-lg">{item.tool}</h4>
                        <span className="px-2 py-0.5 bg-app-bg border border-app-border rounded text-[10px] font-bold text-app-text-sub uppercase tracking-widest leading-none">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-sm text-app-text-sub leading-relaxed">
                        {item.summary}
                      </p>
                      <div className="flex items-center gap-4 pt-2 text-[10px] text-app-text-sub font-bold uppercase tracking-tighter">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {item.timestamp}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Jan 13, 2026
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="flex-1 md:flex-none px-6 py-2.5 bg-app-primary text-white rounded-xl font-bold text-xs hover:scale-[1.05] active:scale-95 transition-all shadow-lg shadow-app-primary/20 flex items-center justify-center gap-2">
                      {t("ecosystem.history.replay")}
                    </button>
                    <button className="p-2.5 bg-app-bg border border-app-border rounded-xl hover:bg-app-panel transition-all text-app-text-sub">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <ChevronRight className="w-5 h-5 text-app-text-sub opacity-20 group-hover:opacity-100 transition-opacity hidden md:block" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Global Statistics */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-app-panel border border-app-border rounded-2xl p-6 shadow-sm flex items-center gap-5">
            <div className="p-4 bg-app-primary/10 rounded-2xl">
              <Zap className="w-8 h-8 text-app-primary" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-app-text-sub tracking-widest uppercase">
                {t("ecosystem.history.stats")}
              </p>
              <p className="text-3xl font-black">124</p>
            </div>
          </div>
          <div className="bg-app-panel border border-app-border rounded-2xl p-6 shadow-sm flex items-center gap-5">
            <div className="p-4 bg-emerald-500/10 rounded-2xl">
              <Layers className="w-8 h-8 text-emerald-500" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-app-text-sub tracking-widest uppercase">
                Data
              </p>
              <p className="text-3xl font-black">2.4 GB</p>
            </div>
          </div>
          <div className="bg-app-panel border border-app-border rounded-2xl p-6 shadow-sm flex items-center gap-5">
            <div className="p-4 bg-amber-500/10 rounded-2xl">
              <RotateCcw className="w-8 h-8 text-amber-500" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-app-text-sub tracking-widest uppercase">
                Saved
              </p>
              <p className="text-3xl font-black">~14 hrs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
