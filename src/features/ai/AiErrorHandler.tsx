import { useState } from "react";
import {
  Brain,
  Terminal,
  Search,
  CheckCircle2,
  MessageSquare,
  FileCode,
  ArrowRight,
  Zap,
  Sparkles,
  Lightbulb,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AiErrorHandler() {
  const { t } = useTranslation();
  const [errorInput, setErrorInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [solution, setSolution] = useState<{
    explanation: string;
    code: string;
    tips: string[];
  } | null>(null);

  const solveError = () => {
    if (!errorInput) return;
    setLoading(true);

    // Simulated AI Processing
    setTimeout(() => {
      setSolution({
        explanation:
          "This error typically occurs when personal access tokens lack the necessary scopes or the API endpoint has changed. In your specific case, it seems like a CORS policy restriction during the preflight request.",
        code: "const response = await fetch(url, {\n  mode: 'cors',\n  headers: {\n    'Authorization': `Bearer ${token}`,\n    'Content-Type': 'application/json'\n  }\n});",
        tips: [
          "Check if your domain is whitelisted in the API provider dashboard.",
          "Ensure the token isn't expired or revoked.",
          "Try using a proxy server for local development to bypass CORS.",
        ],
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <div className="p-2 bg-rose-600 rounded-lg shadow-lg shadow-rose-500/20">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <span className="gradient-text-optimized">
            {t("aiInsights.errorSolver.title")}
          </span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("aiInsights.errorSolver.description")}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-app-panel border border-app-border rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-app-text-sub uppercase tracking-widest flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                {t("aiInsights.errorSolver.config")}
              </h2>
              <button
                onClick={() => setErrorInput("")}
                className="text-[10px] font-bold text-app-primary hover:underline"
              >
                {t("securityPro.rateLimit.clear")}
              </button>
            </div>
            <textarea
              value={errorInput}
              onChange={(e) => setErrorInput(e.target.value)}
              placeholder={t("aiInsights.errorSolver.placeholder")}
              className="w-full h-80 bg-app-bg border-2 border-app-border rounded-xl p-4 font-mono text-xs resize-none focus:ring-4 focus:ring-app-primary/10 focus:border-app-primary outline-none transition-all placeholder:opacity-30"
            />
            <button
              onClick={solveError}
              disabled={loading || !errorInput}
              className="w-full py-4 bg-app-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-app-primary/20 disabled:opacity-50"
            >
              {loading ? (
                <Sparkles className="w-5 h-5 animate-spin" />
              ) : (
                <Brain className="w-5 h-5" />
              )}
              {loading ? "..." : t("aiInsights.errorSolver.analyze")}
            </button>
          </div>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-7">
          {solution ? (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
              <div className="bg-app-panel border border-app-border rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Zap className="w-24 h-24 text-app-primary" />
                </div>

                <div className="space-y-6 relative z-10">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Search className="w-5 h-5 text-app-primary" />
                      {t("aiInsights.errorSolver.result")}
                    </h3>
                    <p className="text-app-text-sub text-sm leading-relaxed italic">
                      {solution.explanation}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-app-text-sub uppercase tracking-wider flex items-center gap-2">
                        <FileCode className="w-4 h-4" />
                        Fix
                      </h3>
                    </div>
                    <div className="bg-gray-950 rounded-xl p-4 border border-white/5 relative group">
                      <pre className="text-blue-300 font-mono text-xs overflow-x-auto">
                        {solution.code}
                      </pre>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-app-text-sub uppercase tracking-wider flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      Steps
                    </h3>
                    <div className="space-y-2">
                      {solution.tips.map((tip, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-3 bg-app-bg border border-app-border rounded-xl text-xs text-app-text-sub"
                        >
                          <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                          {tip}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-rose-600/10 to-indigo-600/10 border border-app-primary/10 rounded-2xl p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-xl">
                    <MessageSquare className="w-6 h-6 text-app-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Stuck?</p>
                    <p className="text-xs text-app-text-sub">
                      Try more detail.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] border-2 border-dashed border-app-border rounded-2xl flex flex-col items-center justify-center p-12 text-center space-y-4">
              <div className="p-6 bg-app-panel rounded-full animate-pulse">
                <Sparkles className="w-12 h-12 text-app-primary opacity-20" />
              </div>
              <div>
                <h3 className="text-lg font-bold">
                  {t("aiInsights.errorSolver.ready")}
                </h3>
                <p className="text-sm text-app-text-sub max-w-xs mx-auto mt-2">
                  {t("aiInsights.errorSolver.readyDesc")}
                </p>
              </div>
              <div className="flex gap-2">
                {["TypeError", "CORS", "NullPointer"].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-app-bg border border-app-border rounded-full text-[10px] font-bold text-app-text-sub"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
