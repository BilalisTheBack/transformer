import { useState } from "react";
import {
  Regex,
  Search,
  Brain,
  CheckCircle2,
  MessageSquare,
  Info,
  ChevronRight,
  Sparkles,
  Layers,
  Code,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface RegexStep {
  token: string;
  description: string;
}

export default function AiRegexExplainer() {
  const { t } = useTranslation();
  const [regex, setRegex] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<{
    summary: string;
    steps: RegexStep[];
    examples: { valid: string[]; invalid: string[] };
  } | null>(null);

  const explainRegex = () => {
    if (!regex) return;
    setLoading(true);

    // Simulated AI Regex Breakdown
    setTimeout(() => {
      setAnalysis({
        summary:
          "This regex validates a complex password requirement. It enforces specific length, character variety, and avoids common sequences.",
        steps: [
          { token: "^", description: "Start of string anchor." },
          {
            token: "(?=.*[A-Z])",
            description:
              "Positive lookahead for at least one uppercase letter.",
          },
          {
            token: "(?=.*[a-z])",
            description:
              "Positive lookahead for at least one lowercase letter.",
          },
          {
            token: "(?=.*\\d)",
            description: "Positive lookahead for at least one numeric digit.",
          },
          {
            token: ".{8,}",
            description:
              "Matches any character (except newline) for a minimum of 8 times.",
          },
          { token: "$", description: "End of string anchor." },
        ],
        examples: {
          valid: ["Password123!", "Admin_2026", "SecureKey#1"],
          invalid: ["password", "12345678", "SHORT", "no_numbers_here"],
        },
      });
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <div className="p-2 bg-fuchsia-600 rounded-lg shadow-lg shadow-fuchsia-500/20">
            <Regex className="w-6 h-6 text-white" />
          </div>
          <span className="gradient-text-optimized">
            {t("aiInsights.regexExplainer.title")}
          </span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("aiInsights.regexExplainer.description")}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-12">
          <div className="bg-app-panel border border-app-border rounded-2xl p-8 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-app-text-sub uppercase tracking-wider">
                {t("aiInsights.regexExplainer.config")}
              </label>
              <div className="relative">
                <Code className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-app-primary opacity-50" />
                <input
                  type="text"
                  value={regex}
                  onChange={(e) => setRegex(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && explainRegex()}
                  placeholder={t("aiInsights.regexExplainer.placeholder")}
                  className="w-full bg-app-bg border-2 border-app-border rounded-xl pl-14 pr-32 py-5 text-xl font-mono focus:ring-4 focus:ring-app-primary/10 focus:border-app-primary outline-none transition-all placeholder:opacity-30"
                />
                <button
                  onClick={explainRegex}
                  disabled={loading || !regex}
                  className="absolute right-3 top-3 bottom-3 px-8 bg-app-primary text-white rounded-lg font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-app-primary/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <Sparkles className="w-4 h-4 animate-spin" />
                  ) : (
                    <Brain className="w-4 h-4" />
                  )}
                  {loading ? "..." : t("aiInsights.regexExplainer.analyze")}
                </button>
              </div>
            </div>
          </div>
        </div>

        {analysis && (
          <>
            {/* Logic Breakdown */}
            <div className="lg:col-span-8 space-y-6 animate-in slide-in-from-left-8 duration-500">
              <div className="bg-app-panel border border-app-border rounded-2xl p-8">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-app-primary" />
                  Steps
                </h3>
                <div className="space-y-2">
                  {analysis.steps.map((step, i) => (
                    <div
                      key={i}
                      className="group flex items-start gap-4 p-4 bg-app-bg border border-app-border rounded-xl hover:border-app-primary/30 transition-all"
                    >
                      <div className="px-3 py-1 bg-gray-900 border border-white/5 rounded-lg font-mono text-sm text-fuchsia-400 min-w-[80px] text-center shrink-0">
                        {step.token}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-app-text-sub opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-app-panel border border-app-border rounded-2xl p-8">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-app-primary" />
                  {t("aiInsights.regexExplainer.result")}
                </h3>
                <div className="p-4 bg-app-bg border-l-4 border-app-primary rounded-r-xl">
                  <p className="text-sm text-app-text-sub leading-relaxed italic">
                    {analysis.summary}
                  </p>
                </div>
              </div>
            </div>

            {/* Test Cases */}
            <div className="lg:col-span-4 space-y-6 animate-in slide-in-from-right-8 duration-500">
              <div className="bg-app-panel border border-app-border rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Valid
                </h3>
                <div className="space-y-2">
                  {analysis.examples.valid.map((ex, i) => (
                    <div
                      key={i}
                      className="px-4 py-2 bg-green-500/5 border border-green-500/10 rounded-lg font-mono text-xs text-green-500"
                    >
                      {ex}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-app-panel border border-app-border rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold mb-4 flex items-center gap-2 text-red-500">
                  <Info className="w-4 h-4" />
                  Invalid
                </h3>
                <div className="space-y-2">
                  {analysis.examples.invalid.map((ex, i) => (
                    <div
                      key={i}
                      className="px-4 py-2 bg-red-500/5 border border-red-500/10 rounded-lg font-mono text-xs text-red-400"
                    >
                      {ex}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {!analysis && (
          <div className="lg:col-span-12 py-20 text-center space-y-6 border-2 border-dashed border-app-border rounded-2xl">
            <div className="w-20 h-20 bg-app-panel rounded-full flex items-center justify-center mx-auto shadow-lg">
              <Regex className="w-10 h-10 text-app-primary opacity-20" />
            </div>
            <div>
              <h3 className="text-xl font-bold">
                {t("aiInsights.regexExplainer.ready")}
              </h3>
              <p className="text-app-text-sub text-sm max-w-md mx-auto mt-2">
                {t("aiInsights.regexExplainer.readyDesc")}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
