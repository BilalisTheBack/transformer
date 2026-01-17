import { useState } from "react";
import {
  Link as LinkIcon,
  Search,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Target,
  BarChart,
  FileText,
  MessageSquare,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface Backlink {
  url: string;
  type: "dofollow" | "nofollow" | "ugc" | "sponsored";
  authority: number;
  anchor: string;
  status: "active" | "lost";
}

export default function BacklinkAnalyzer() {
  const { t } = useTranslation();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Backlink[] | null>(null);

  const analyzeBacklinks = () => {
    if (!url) return;
    setLoading(true);

    // Simulated Analysis
    setTimeout(() => {
      const mockLinks: Backlink[] = [
        {
          url: "https://techcrunch.com/article",
          type: "dofollow",
          authority: 92,
          anchor: "premium developer tools",
          status: "active",
        },
        {
          url: "https://medium.com/@devblog",
          type: "nofollow",
          authority: 85,
          anchor: "productivity suite",
          status: "active",
        },
        {
          url: "https://stackoverflow.com/q/123",
          type: "ugc",
          authority: 95,
          anchor: "The Transformer",
          status: "active",
        },
        {
          url: "https://software-reviews.net",
          type: "sponsored",
          authority: 64,
          anchor: "best online converters",
          status: "active",
        },
        {
          url: "https://github.com/trending",
          type: "dofollow",
          authority: 98,
          anchor: "open source project",
          status: "lost",
        },
      ];
      setResults(mockLinks);
      setLoading(false);
    }, 1200);
  };

  const stats = results
    ? {
        doFollow: results.filter((r) => r.type === "dofollow").length,
        noFollow: results.filter((r) => r.type === "nofollow").length,
        avgAuth: Math.round(
          results.reduce((acc, r) => acc + r.authority, 0) / results.length
        ),
      }
    : null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
            <LinkIcon className="w-6 h-6 text-white" />
          </div>
          <span className="gradient-text-optimized">
            {t("seoGrowth.backlink.title")}
          </span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("seoGrowth.backlink.description")}
        </p>
      </header>

      <div className="bg-app-panel border border-app-border rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-app-text-sub" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={t("seoGrowth.backlink.placeholder")}
              className="w-full bg-app-bg border border-app-border rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-app-primary outline-none"
            />
          </div>
          <button
            onClick={analyzeBacklinks}
            disabled={loading || !url}
            className="px-8 py-3 bg-app-primary text-white rounded-xl font-bold hover:bg-app-primary/90 transition-all shadow-lg shadow-app-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? "..." : t("seoGrowth.backlink.analyze")}
          </button>
        </div>
      </div>

      {results && stats && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Dashboard Stats */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-app-panel border border-app-border rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold mb-6 flex items-center gap-2">
                <BarChart className="w-5 h-5 text-app-primary" />
                {t("seoGrowth.backlink.config")}
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-app-text-sub">Authority</span>
                    <span className="font-black text-app-primary">
                      {stats.avgAuth}/100
                    </span>
                  </div>
                  <div className="h-2 w-full bg-app-bg rounded-full overflow-hidden border border-app-border">
                    <div
                      className="h-full bg-app-primary"
                      style={{ width: `${stats.avgAuth}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-app-bg border border-app-border rounded-xl">
                    <p className="text-[10px] font-bold text-app-text-sub uppercase mb-1">
                      DoFollow
                    </p>
                    <p className="text-xl font-black text-emerald-500">
                      {stats.doFollow}
                    </p>
                  </div>
                  <div className="p-4 bg-app-bg border border-app-border rounded-xl">
                    <p className="text-[10px] font-bold text-app-text-sub uppercase mb-1">
                      NoFollow
                    </p>
                    <p className="text-xl font-black text-amber-500">
                      {stats.noFollow}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl space-y-2 text-center">
                  <p className="text-xs text-app-text-sub italic">
                    {t("seoGrowth.backlink.readyDesc")}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-xl shadow-indigo-500/20 space-y-4">
              <h4 className="font-bold flex items-center gap-2">
                <Target className="w-5 h-5" />
                Strategy
              </h4>
              <p className="text-sm opacity-90 leading-relaxed">
                Prioritize gaining links from high authority domains to boost
                your SEO value significantly.
              </p>
            </div>
          </div>

          {/* Detailed Links */}
          <div className="lg:col-span-8 space-y-4">
            <h3 className="font-semibold text-lg px-2 flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-app-primary" />
              {t("seoGrowth.backlink.result")}
            </h3>

            <div className="space-y-3">
              {results.map((link, idx) => (
                <div
                  key={idx}
                  className="bg-app-panel border border-app-border rounded-xl p-4 transition-all hover:bg-app-bg group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase text-app-text-sub mb-1">
                        {link.status === "active" ? (
                          <ShieldCheck className="w-3 h-3 text-green-500" />
                        ) : (
                          <ShieldAlert className="w-3 h-3 text-red-500" />
                        )}
                        {link.status} Link
                      </div>
                      <h4 className="text-sm font-bold truncate group-hover:text-app-primary transition-colors">
                        {link.url}
                      </h4>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1 text-[10px] text-app-text-sub">
                          <MessageSquare className="w-3 h-3" />
                          Anchor:{" "}
                          <span className="font-mono bg-app-bg px-1 rounded">
                            {link.anchor}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-app-text-sub">
                          <FileText className="w-3 h-3" />
                          Authority:{" "}
                          <span className="font-bold">{link.authority}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                          link.type === "dofollow"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : link.type === "sponsored"
                            ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                            : "bg-app-bg text-app-text-sub border-app-border"
                        }`}
                      >
                        {link.type}
                      </span>
                      <button className="p-2 bg-app-bg border border-app-border rounded-lg hover:bg-app-primary hover:text-white hover:border-app-primary transition-all">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
