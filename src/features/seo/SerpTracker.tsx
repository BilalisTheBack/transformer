import { useState } from "react";
import {
  Search,
  Globe,
  TrendingUp,
  TrendingDown,
  Target,
  MapPin,
  Monitor,
  ExternalLink,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface SerpResult {
  pos: number;
  title: string;
  url: string;
  snippet: string;
  change: number;
}

export default function SerpTracker() {
  const { t } = useTranslation();
  const [keyword, setKeyword] = useState("");
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SerpResult[] | null>(null);

  const simulateSearch = () => {
    if (!keyword) return;
    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const mockResults: SerpResult[] = [
        {
          pos: 1,
          title: "The Ultimate Guide to " + keyword,
          url: "https://example.com/guide",
          snippet:
            "Discover more about " +
            keyword +
            " in our comprehensive guide covering basics to advanced topics...",
          change: 0,
        },
        {
          pos: 2,
          title: keyword + " Tools | Premium Utilities",
          url: "https://" + (domain || "yourdomain.com"),
          snippet:
            "Looking for " +
            keyword +
            "? Our suite provides everything you need to optimize and transform your workflow.",
          change: 1,
        },
        {
          pos: 3,
          title: "What is " + keyword + "?",
          url: "https://wikipedia.org/wiki/" + keyword,
          snippet:
            keyword +
            " is a concept that has gained significant traction in recent years due to its impact on productivity.",
          change: -1,
        },
        {
          pos: 4,
          title: "Top 10 " + keyword + " Alternatives for 2026",
          url: "https://reviewsite.net/best-tools",
          snippet:
            "We compared the best " +
            keyword +
            " solutions available today. Here are our top picks for scaling your business.",
          change: 2,
        },
        {
          pos: 5,
          title: keyword + " Discussion | Reddit",
          url: "https://reddit.com/r/" + keyword,
          snippet:
            "350 comments - Does anyone have experience with " +
            keyword +
            " implementation on large scale projects?",
          change: 0,
        },
      ];
      setResults(mockResults);
      setLoading(false);
    }, 1200);
  };

  const domainMatch = results?.find((r) => r.url.includes(domain));

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
            <Search className="w-6 h-6 text-white" />
          </div>
          <span className="gradient-text-optimized">
            {t("seoGrowth.serp.title")}
          </span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("seoGrowth.serp.description")}
        </p>
      </header>

      <div className="bg-app-panel border border-app-border rounded-2xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-app-text-sub" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder={t("seoGrowth.serp.keyword")}
              className="w-full bg-app-bg border border-app-border rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-app-primary outline-none"
            />
          </div>
          <div className="md:col-span-4 relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-app-text-sub" />
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder={t("seoGrowth.serp.domain")}
              className="w-full bg-app-bg border border-app-border rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-app-primary outline-none"
            />
          </div>
          <div className="md:col-span-3">
            <button
              onClick={simulateSearch}
              disabled={loading || !keyword}
              className="w-full h-full bg-app-primary text-white rounded-xl font-bold hover:bg-app-primary/90 transition-all shadow-lg shadow-app-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <TrendingUp className="w-5 h-5" />
              {loading ? "..." : t("seoGrowth.serp.analyze")}
            </button>
          </div>
        </div>
      </div>

      {results && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Results */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-semibold text-lg">
                {t("seoGrowth.serp.result")}
              </h3>
              <div className="flex gap-4 text-xs text-app-text-sub font-medium">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> US - English
                </span>
                <span className="flex items-center gap-1">
                  <Monitor className="w-3 h-3" /> {t("seoGrowth.serp.device")}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {results.map((r) => (
                <div
                  key={r.pos}
                  className={`bg-app-panel border rounded-xl p-5 shadow-sm transition-all hover:border-app-primary/30 ${
                    domain && r.url.includes(domain)
                      ? "border-app-primary/50 ring-1 ring-app-primary/20"
                      : "border-app-border"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 pr-4">
                      <div className="flex items-center gap-2 text-xs text-app-text-sub whitespace-nowrap overflow-hidden text-ellipsis mb-1">
                        <Globe className="w-3 h-3" />
                        {r.url}
                        <ExternalLink className="w-3 h-3 opacity-50" />
                      </div>
                      <h4 className="text-blue-500 dark:text-blue-400 text-lg font-medium hover:underline cursor-pointer">
                        {r.title}
                      </h4>
                      <p className="text-sm text-app-text-sub line-clamp-2 leading-relaxed">
                        {r.snippet}
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-2xl font-black text-app-text-passive">
                        #{r.pos}
                      </span>
                      {r.change !== 0 && (
                        <div
                          className={`flex items-center gap-0.5 text-[10px] font-bold ${
                            r.change > 0 ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {r.change > 0 ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {Math.abs(r.change)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Analysis Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-app-panel border border-app-border rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-app-primary" />
                {t("seoGrowth.serp.config")}
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-app-text-sub">
                    {t("seoGrowth.serp.rank")}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      domainMatch
                        ? "bg-green-500/10 text-green-500"
                        : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {domainMatch ? "ON PAGE 1" : "NOT FOUND"}
                  </span>
                </div>
                {domainMatch && (
                  <div className="p-4 bg-app-primary/5 border border-app-primary/10 rounded-xl space-y-1">
                    <p className="text-xs text-app-text-sub">Position</p>
                    <p className="text-2xl font-black text-app-primary">
                      #{domainMatch.pos}
                    </p>
                    <p className="text-[10px] text-green-500 font-bold flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      UP THIS WEEK
                    </p>
                  </div>
                )}
                <div className="pt-4 border-t border-app-border text-center">
                  <p className="text-xs text-app-text-sub italic">
                    {t("seoGrowth.serp.readyDesc")}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group">
              <TrendingUp className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform" />
              <div className="relative z-10 space-y-4">
                <h4 className="font-bold flex items-center gap-2">
                  <Monitor className="w-4 h-4" />
                  Growth Insights
                </h4>
                <p className="text-sm text-blue-100 leading-relaxed">
                  Focus on adding more rich media to your page. SERPs are
                  favoring visual content.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
