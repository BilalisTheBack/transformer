import { useState } from "react";
import {
  MessageSquareCode,
  Terminal,
  Brain,
  ShieldCheck,
  Globe,
  Zap,
  ArrowRight,
  Sparkles,
  Link,
  Cpu,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AiApiExplainer() {
  const { t } = useTranslation();
  const [endpoint, setEndpoint] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<{
    purpose: string;
    auth: string;
    example: string;
    security: string[];
    tips: string[];
  } | null>(null);

  const explainApi = () => {
    if (!endpoint) return;
    setLoading(true);

    // Simulated AI API Reasoning
    setTimeout(() => {
      setAnalysis({
        purpose:
          "This endpoint handles the batch creation of user identities. It is likely used for syncing large datasets from external CRMs.",
        auth: "Requires OAuth 2.0 with the 'users.write' scope. Standard Bearer token authentication via Authorization header.",
        example:
          'POST /v1/users/batch\nHost: api.provider.com\nContent-Type: application/json\n\n{\n  "users": [{ "id": "123", "role": "member" }]\n}',
        security: [
          "Implements Rate Limiting: 100 req/min.",
          "Strict JSON Schema Validation active.",
          "TLS 1.3 enforced for all calls.",
        ],
        tips: [
          "Batch size should not exceed 500 items per request.",
          "Use exponential backoff for 429 Too Many Requests errors.",
          "Include a correlation ID for better cross-service tracing.",
        ],
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <div className="p-2 bg-emerald-600 rounded-lg shadow-lg shadow-emerald-500/20">
            <MessageSquareCode className="w-6 h-6 text-white" />
          </div>
          <span className="gradient-text-optimized">
            {t("aiInsights.apiExplainer.title")}
          </span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("aiInsights.apiExplainer.description")}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-app-panel border border-app-border rounded-2xl p-6 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-app-text-sub uppercase tracking-wider">
                {t("aiInsights.apiExplainer.config")}
              </label>
              <textarea
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                placeholder={t("aiInsights.apiExplainer.placeholder")}
                className="w-full h-80 bg-app-bg border-2 border-app-border rounded-xl p-4 font-mono text-xs resize-none focus:ring-4 focus:ring-app-primary/10 focus:border-app-primary outline-none transition-all placeholder:opacity-30"
              />
            </div>
            <button
              onClick={explainApi}
              disabled={loading || !endpoint}
              className="w-full py-4 bg-app-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-app-primary/20 disabled:opacity-50"
            >
              {loading ? (
                <Sparkles className="w-5 h-5 animate-spin" />
              ) : (
                <Brain className="w-5 h-5" />
              )}
              {loading ? "..." : t("aiInsights.apiExplainer.analyze")}
            </button>
          </div>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-7 space-y-6">
          {analysis ? (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
              {/* Summary Section */}
              <div className="bg-app-panel border border-app-border rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Globe className="w-24 h-24 text-app-primary" />
                </div>
                <div className="space-y-6 relative z-10">
                  <div className="space-y-2">
                    <h3 className="font-bold flex items-center gap-2">
                      <Zap className="w-5 h-5 text-app-primary" />
                      {t("aiInsights.apiExplainer.result")}
                    </h3>
                    <p className="text-sm text-app-text-sub leading-relaxed italic">
                      {analysis.purpose}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-bold flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-500" />
                      Security
                    </h3>
                    <div className="p-4 bg-app-bg border border-app-border rounded-xl space-y-3">
                      <p className="text-xs font-mono text-app-primary">
                        {analysis.auth}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-bold flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-app-text-sub" />
                      Example
                    </h3>
                    <div className="bg-gray-950 rounded-xl p-4 border border-white/5 relative group">
                      <pre className="text-blue-300 font-mono text-[10px] overflow-x-auto whitespace-pre-wrap">
                        {analysis.example}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-app-panel border border-app-border rounded-2xl p-6">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-app-text-sub mb-4 flex items-center gap-2">
                    <Cpu className="w-4 h-4" /> Tips
                  </h4>
                  <ul className="space-y-2">
                    {analysis.tips.map((t, i) => (
                      <li
                        key={i}
                        className="text-[11px] text-app-text-sub flex items-start gap-2"
                      >
                        <ArrowRight className="w-3 h-3 text-app-primary shrink-0 mt-0.5" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full border-2 border-dashed border-app-border rounded-2xl flex flex-col items-center justify-center p-12 text-center space-y-6">
              <div className="p-8 bg-app-panel rounded-full border border-app-border shadow-2xl animate-pulse">
                <MessageSquareCode className="w-12 h-12 text-emerald-500 opacity-20" />
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  {t("aiInsights.apiExplainer.ready")}
                </h3>
                <p className="text-app-text-sub text-sm max-w-sm mx-auto mt-2">
                  {t("aiInsights.apiExplainer.readyDesc")}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
