import { useState } from "react";
import {
  BarChart3,
  Lightbulb,
  Target,
  ShoppingBag,
  HelpCircle,
  Navigation,
  FileText,
  TrendingUp,
  Brain,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface IntentResult {
  keyword: string;
  intent: "Informational" | "Navigational" | "Transactional" | "Commercial";
  score: number;
  description: string;
}

export default function KeywordIntent() {
  const { t } = useTranslation();
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<IntentResult | null>(null);
  const [history, setHistory] = useState<IntentResult[]>([]);

  const analyzeIntent = () => {
    if (!keyword) return;

    // Simulated NLP Logic
    let intent: IntentResult["intent"] = "Informational";
    let score = 70 + Math.random() * 25;
    let description =
      "Users are looking for answers or general information about this topic.";

    const kw = keyword.toLowerCase();
    if (
      kw.includes("buy") ||
      kw.includes("price") ||
      kw.includes("cheap") ||
      kw.includes("order")
    ) {
      intent = "Transactional";
      description =
        "Strong purchase intent. Users are ready to buy or complete an action.";
    } else if (
      kw.includes("vs") ||
      kw.includes("best") ||
      kw.includes("review") ||
      kw.includes("top")
    ) {
      intent = "Commercial";
      description =
        "Users are investigating products or services before making a decision.";
    } else if (
      kw.includes("login") ||
      kw.includes("brand") ||
      kw.includes("official") ||
      kw.includes(".com")
    ) {
      intent = "Navigational";
      description =
        "Users are trying to find a specific website or physical location.";
    }

    const result: IntentResult = {
      keyword,
      intent,
      score: Math.round(score),
      description,
    };

    setResults(result);
    setHistory((prev) => [result, ...prev].slice(0, 5));
    setKeyword("");
  };

  const intentIcons = {
    Informational: <HelpCircle className="w-5 h-5" />,
    Navigational: <Navigation className="w-5 h-5" />,
    Transactional: <ShoppingBag className="w-5 h-5" />,
    Commercial: <Target className="w-5 h-5" />,
  };

  const intentColors = {
    Informational: "bg-blue-500",
    Navigational: "bg-purple-500",
    Transactional: "bg-emerald-500",
    Commercial: "bg-amber-500",
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <div className="p-2 bg-purple-600 rounded-lg shadow-lg shadow-purple-500/20">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <span className="gradient-text-optimized">
            {t("seoGrowth.keywordIntent.title")}
          </span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("seoGrowth.keywordIntent.description")}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input & Active Result */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-app-panel border border-app-border rounded-2xl p-8 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-app-text-sub uppercase tracking-wider">
                {t("seoGrowth.keywordIntent.config")}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && analyzeIntent()}
                  placeholder={t("seoGrowth.keywordIntent.placeholder")}
                  className="w-full bg-app-bg border-2 border-app-border rounded-xl px-4 py-4 pr-32 text-lg focus:ring-4 focus:ring-app-primary/10 focus:border-app-primary outline-none transition-all"
                />
                <button
                  onClick={analyzeIntent}
                  disabled={!keyword}
                  className="absolute right-2 top-2 bottom-2 px-6 bg-app-primary text-white rounded-lg font-bold hover:bg-app-primary/90 transition-all disabled:opacity-50"
                >
                  {t("seoGrowth.keywordIntent.analyze")}
                </button>
              </div>
            </div>

            {results ? (
              <div className="p-8 bg-app-bg border border-app-border rounded-2xl space-y-8 animate-in zoom-in-95 duration-300">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div
                    className={`w-32 h-32 rounded-full border-8 border-app-border flex flex-col items-center justify-center relative`}
                  >
                    <div
                      className={`absolute inset-0 rounded-full border-8 ${
                        intentColors[results.intent]
                      } opacity-20`}
                    />
                    <span className="text-3xl font-black">
                      {results.score}%
                    </span>
                    <span className="text-[10px] font-bold opacity-60">
                      PROBABILITY
                    </span>
                  </div>
                  <div className="flex-1 space-y-4 text-center md:text-left">
                    <div>
                      <h3 className="text-2xl font-bold flex items-center justify-center md:justify-start gap-3">
                        <span
                          className={`p-2 rounded-lg text-white ${
                            intentColors[results.intent]
                          }`}
                        >
                          {intentIcons[results.intent]}
                        </span>
                        {t(
                          `seoGrowth.keywordIntent.intent.${
                            results.intent === "Informational"
                              ? "info"
                              : results.intent === "Navigational"
                              ? "nav"
                              : results.intent === "Transactional"
                              ? "trans"
                              : "comm"
                          }`
                        )}
                      </h3>
                      <p className="text-app-text-sub mt-2 leading-relaxed">
                        Query:{" "}
                        <span className="text-app-primary font-mono italic">
                          "{results.keyword}"
                        </span>
                      </p>
                    </div>
                    <div className="p-4 bg-app-panel rounded-xl border border-app-border inline-block">
                      <p className="text-sm leading-relaxed italic">
                        {results.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-app-panel border border-app-border rounded-xl space-y-2">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <p className="text-xs font-bold uppercase text-app-text-sub">
                      Content Strategy
                    </p>
                    <p className="text-sm font-medium">
                      {results.intent === "Informational"
                        ? "Guides, Tutorials"
                        : results.intent === "Commercial"
                        ? "Best of lists, Comparisons"
                        : results.intent === "Transactional"
                        ? "Product pages, Sales"
                        : "Home page, Store finder"}
                    </p>
                  </div>
                  <div className="p-4 bg-app-panel border border-app-border rounded-xl space-y-2">
                    <ShoppingBag className="w-5 h-5 text-emerald-500" />
                    <p className="text-xs font-bold uppercase text-app-text-sub">
                      Ad Strategy
                    </p>
                    <p className="text-sm font-medium">
                      {results.intent === "Transactional"
                        ? "High CPC Target"
                        : "Brand awareness"}
                    </p>
                  </div>
                  <div className="p-4 bg-app-panel border border-app-border rounded-xl space-y-2">
                    <TrendingUp className="w-5 h-5 text-app-primary" />
                    <p className="text-xs font-bold uppercase text-app-text-sub">
                      Engagement
                    </p>
                    <p className="text-sm font-medium">High potential</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-app-text-sub border-2 border-app-border border-dashed rounded-2xl p-8 text-center space-y-4">
                <Brain className="w-12 h-12 opacity-10 animate-pulse" />
                <p>{t("seoGrowth.keywordIntent.readyDesc")}</p>
              </div>
            )}
          </div>
        </div>

        {/* History & Tips */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-app-panel border border-app-border rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-app-primary" />
              {t("seoGrowth.keywordIntent.history")}
            </h3>
            <div className="space-y-3">
              {history.length === 0 ? (
                <p className="text-xs text-app-text-sub italic">
                  No history yet.
                </p>
              ) : (
                history.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-app-bg border border-app-border rounded-xl"
                  >
                    <div className="min-w-0 mr-4">
                      <p className="text-sm font-medium truncate">
                        {h.keyword}
                      </p>
                      <p className="text-[10px] font-bold opacity-60 uppercase">
                        {h.intent}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] text-white ${
                        intentColors[h.intent]
                      }`}
                    >
                      {h.score}%
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-pink-700 rounded-2xl p-6 text-white shadow-xl shadow-purple-500/20 space-y-4">
            <h4 className="font-bold flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              {t("seoGrowth.keywordIntent.tips")}
            </h4>
            <p className="text-sm opacity-90 leading-relaxed">
              {t("seoGrowth.keywordIntent.tipsDesc")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
