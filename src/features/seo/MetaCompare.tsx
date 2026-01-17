import { useState } from "react";
import {
  TrendingUp,
  Search,
  Trash2,
  Plus,
  Globe,
  AlertCircle,
  Target,
  BarChart3,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface Competitor {
  id: string;
  url: string;
  meta: {
    title: string;
    description: string;
    h1: string;
    keywords: string[];
  } | null;
  loading: boolean;
}

export default function MetaCompare() {
  const { t } = useTranslation();
  const [competitors, setCompetitors] = useState<Competitor[]>([
    { id: "1", url: "https://competitor.com", meta: null, loading: false },
  ]);
  const [newUrl, setNewUrl] = useState("");

  const addCompetitor = () => {
    if (!newUrl) return;
    const id = Math.random().toString(36).substr(2, 9);
    setCompetitors([
      ...competitors,
      { id, url: newUrl, meta: null, loading: false },
    ]);
    setNewUrl("");
  };

  const removeCompetitor = (id: string) => {
    setCompetitors(competitors.filter((c) => c.id !== id));
  };

  const analyzeCompetitor = (id: string) => {
    setCompetitors((prev) =>
      prev.map((c) => (c.id === id ? { ...c, loading: true } : c))
    );

    // Simulated Analysis
    setTimeout(() => {
      setCompetitors((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                loading: false,
                meta: {
                  title: "Premium Developer Tools | Best Utilities 2026",
                  description:
                    "Explore our enterprise-grade developer productivity suite. Secure, fast, and local processing for all your conversion needs.",
                  h1: "Transform Your Workflow",
                  keywords: [
                    "developer tools",
                    "JSON converter",
                    "productivity",
                    "utilities",
                  ],
                },
              }
            : c
        )
      );
    }, 1500);
  };

  const analyzeAll = () => {
    competitors.forEach((c) => analyzeCompetitor(c.id));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <div className="p-2 bg-cyan-600 rounded-lg shadow-lg shadow-cyan-500/20">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <span className="gradient-text-optimized">
            {t("seoGrowth.metaCompare.title")}
          </span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("seoGrowth.metaCompare.description")}
        </p>
      </header>

      {/* Input Section */}
      <div className="bg-app-panel border border-app-border rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-app-text-sub" />
            <input
              type="text"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder={t("seoGrowth.metaCompare.placeholder")}
              className="w-full bg-app-bg border border-app-border rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-app-primary outline-none"
            />
          </div>
          <button
            onClick={addCompetitor}
            className="px-6 py-3 bg-app-bg border border-app-border rounded-xl font-bold hover:bg-app-border transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {t("seoGrowth.metaCompare.add")}
          </button>
          <button
            onClick={analyzeAll}
            className="px-8 py-3 bg-app-primary text-white rounded-xl font-bold hover:bg-app-primary/90 transition-all shadow-lg shadow-app-primary/20 flex items-center justify-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            {t("seoGrowth.metaCompare.analyze")}
          </button>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {competitors.map((c) => (
          <div
            key={c.id}
            className="bg-app-panel border border-app-border rounded-2xl overflow-hidden flex flex-col shadow-sm group"
          >
            <div className="p-4 border-b border-app-border bg-app-bg/50 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <Globe className="w-4 h-4 text-app-primary shrink-0" />
                <span className="text-sm font-semibold truncate text-app-text-sub">
                  {c.url}
                </span>
              </div>
              <button
                onClick={() => removeCompetitor(c.id)}
                className="p-1.5 hover:bg-red-500/10 text-app-text-sub hover:text-red-500 rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 flex-1 space-y-6">
              {!c.meta && !c.loading && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                  <Target className="w-12 h-12 opacity-10" />
                  <p className="text-xs text-app-text-sub px-4">
                    {t("seoGrowth.metaCompare.readyDesc")}
                  </p>
                  <button
                    onClick={() => analyzeCompetitor(c.id)}
                    className="px-4 py-2 text-xs font-bold text-app-primary bg-app-primary/10 rounded-lg hover:bg-app-primary/20 transition-all"
                  >
                    {t("seoGrowth.metaCompare.analyze")}
                  </button>
                </div>
              )}

              {c.loading && (
                <div className="h-full flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="w-8 h-8 border-2 border-app-primary/20 border-t-app-primary rounded-full animate-spin" />
                  <p className="text-xs text-app-text-sub font-medium animate-pulse">
                    ...
                  </p>
                </div>
              )}

              {c.meta && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  {/* Title */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-app-text-sub uppercase tracking-widest">
                        {t("seoGrowth.metaCompare.result")}
                      </span>
                    </div>
                    <div className="p-3 bg-app-bg rounded-xl border border-app-border">
                      <p className="text-blue-500 text-sm font-medium leading-tight">
                        {c.meta.title}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-app-text-sub uppercase tracking-widest">
                      Description
                    </span>
                    <p className="text-xs text-app-text-sub leading-relaxed italic">
                      {c.meta.description}
                    </p>
                  </div>

                  {/* H1 */}
                  <div className="p-4 bg-app-bg/50 border border-app-border rounded-xl space-y-2">
                    <span className="text-[10px] font-bold text-app-text-sub uppercase tracking-widest">
                      H1 Header
                    </span>
                    <p className="text-sm font-bold truncate">{c.meta.h1}</p>
                  </div>

                  {/* Keywords */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-app-text-sub uppercase tracking-widest">
                      Keywords
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {c.meta.keywords.map((kw) => (
                        <span
                          key={kw}
                          className="px-2 py-1 bg-app-primary/10 text-app-primary text-[10px] font-bold rounded-lg border border-app-primary/10"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Placeholder for Adding */}
        <button
          onClick={() => {}}
          className="border-2 border-dashed border-app-border rounded-2xl flex flex-col items-center justify-center p-12 text-app-text-sub hover:border-app-primary/50 hover:bg-app-primary/5 transition-all group min-h-[400px]"
        >
          <div className="p-4 bg-app-bg border border-app-border rounded-full mb-4 group-hover:scale-110 transition-transform">
            <Plus className="w-8 h-8 opacity-20" />
          </div>
          <p className="font-bold">{t("seoGrowth.metaCompare.add")}</p>
        </button>
      </div>
    </div>
  );
}
