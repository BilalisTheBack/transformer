import { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  ShieldCheck as ShieldIcon,
  CheckCircle2,
  XCircle,
  Info,
  ChevronRight,
  Target,
} from "lucide-react";

interface HeaderResult {
  header: string;
  status: "pass" | "fail" | "warning";
  value: string | null;
  desc: string;
  recommendation?: string;
}

export default function SecurityHeaders() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<HeaderResult[] | null>(null);

  const analyzeHeaders = async () => {
    if (!url) return;
    setLoading(true);

    // Simulation logic for a pro feel
    await new Promise((r) => setTimeout(r, 2000));

    const mockAnalysis: HeaderResult[] = [
      {
        header: "Strict-Transport-Security (HSTS)",
        status: "pass",
        value: "max-age=63072000; includeSubDomains; preload",
        desc: "Enforces secure (HTTPS) connections to the server.",
      },
      {
        header: "Content-Security-Policy (CSP)",
        status: "warning",
        value:
          "default-src 'self' 'unsafe-inline' scripts.example.com; img-src *;",
        desc: "Controls what resources the browser is allowed to load.",
        recommendation: "Avoid 'unsafe-inline' to prevent XSS attacks.",
      },
      {
        header: "X-Frame-Options",
        status: "pass",
        value: "DENY",
        desc: "Prevents the site from being embedded in frames/iframes (Anti-Clickjacking).",
      },
      {
        header: "X-Content-Type-Options",
        status: "pass",
        value: "nosniff",
        desc: "Prevents the browser from interpreting files as something else.",
      },
      {
        header: "Referrer-Policy",
        status: "fail",
        value: null,
        desc: "Controls how much referrer information the browser includes with requests.",
        recommendation:
          "Use 'strict-origin-when-cross-origin' for better privacy.",
      },
      {
        header: "Permissions-Policy",
        status: "fail",
        value: null,
        desc: "Allows a site to control which browser features (Camera, Geolocation) can be used.",
        recommendation:
          "Implement to restrict access to sensitive browser APIs.",
      },
    ];

    setResults(mockAnalysis);
    setLoading(false);
  };

  const getGrade = () => {
    if (!results) return "";
    const passes = results.filter((r) => r.status === "pass").length;
    if (passes >= 5) return "A+";
    if (passes >= 4) return "B";
    if (passes >= 3) return "C";
    return "F";
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold gradient-text-optimized">
          Security Headers Analyzer
        </h1>
        <p className="text-app-text-sub">
          Identify vulnerabilities by analyzing your website's HTTP security
          headers.
        </p>
      </div>

      {/* URL Input */}
      <div className="bg-app-panel border border-app-border p-4 rounded-3xl shadow-2xl flex gap-3">
        <div className="flex-1 relative">
          <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-app-primary" />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://your-site.com"
            className="w-full bg-app-bg border border-app-border rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-app-primary/50 transition-all font-bold"
          />
        </div>
        <button
          onClick={analyzeHeaders}
          disabled={loading || !url}
          className="bg-app-primary hover:bg-app-primary-hover disabled:opacity-50 text-white px-10 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-app-primary/20"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <span>Scan URL</span>
          )}
        </button>
      </div>

      {!results && !loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 opacity-20 grayscale pointer-events-none">
          <div className="h-64 bg-app-panel border border-app-border rounded-[40px] border-dashed flex items-center justify-center">
            <ShieldIcon className="w-20 h-20" />
          </div>
          <div className="space-y-4">
            <div className="h-12 bg-app-panel rounded-2xl"></div>
            <div className="h-12 bg-app-panel rounded-2xl"></div>
            <div className="h-12 bg-app-panel rounded-2xl w-2/3"></div>
          </div>
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center py-20 animate-pulse space-y-6">
          <div className="w-24 h-24 rounded-full border-8 border-app-primary/10 border-t-app-primary animate-spin" />
          <p className="font-black text-2xl uppercase tracking-[0.3em] text-app-primary">
            Auditing Handshake...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in zoom-in-95 duration-500">
          {/* Dashboard Summary */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gradient-to-br from-[#121214] to-app-bg border border-app-border rounded-[40px] p-10 shadow-2xl relative overflow-hidden text-center">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-app-primary to-green-500" />
              <h2 className="text-xl font-black uppercase tracking-widest text-app-text-sub mb-8">
                Trust Score
              </h2>
              <div className="relative inline-flex items-center justify-center mb-8">
                <div className="w-40 h-40 rounded-full border-[10px] border-app-border border-t-green-500 animate-[spin_3s_linear_infinite]" />
                <span className="absolute text-7xl font-black text-white">
                  {getGrade()}
                </span>
              </div>
              <p className="text-sm font-bold text-app-text mb-6">
                Security posture is overall solid but requires fine-tuning on
                modern policies.
              </p>
              <div className="flex justify-center gap-2">
                <div className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold rounded-full border border-green-500/20">
                  PASSED (
                  {(results?.filter((r) => r.status === "pass") || []).length})
                </div>
                <div className="px-3 py-1 bg-red-500/10 text-red-500 text-[10px] font-bold rounded-full border border-red-500/20">
                  CRITICAL (
                  {(results?.filter((r) => r.status === "fail") || []).length})
                </div>
              </div>
            </div>

            <div className="bg-app-panel border border-app-border rounded-[32px] p-8 space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-app-text-sub">
                Recommendation
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4 p-4 bg-app-bg border border-app-border rounded-2xl hover:border-app-primary/50 transition-colors cursor-pointer group">
                  <div className="w-10 h-10 shrink-0 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold group-hover:text-app-primary transition-colors">
                      Hardening CSP
                    </p>
                    <p className="text-[10px] text-app-text-sub mt-1 leading-relaxed">
                      Remove unsafe-inline from your Content Security Policy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Table */}
          <div className="lg:col-span-8">
            <div className="bg-app-panel border border-app-border rounded-[40px] overflow-hidden shadow-3xl">
              <div className="p-8 border-b border-app-border flex items-center justify-between">
                <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-app-primary" />
                  Header Audit
                </h2>
                <div className="flex items-center gap-2 text-xs font-bold text-app-text-sub">
                  <span>Server: Nginx/Cloudflare</span>
                </div>
              </div>

              <div className="divide-y divide-app-border/40">
                {results?.map((r, idx) => (
                  <div
                    key={idx}
                    className="p-8 flex flex-col gap-4 hover:bg-white/[0.02] transition-colors relative group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-2 rounded-xl border ${
                            r.status === "pass"
                              ? "bg-green-500/10 border-green-500/20 text-green-500"
                              : r.status === "warning"
                              ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                              : "bg-red-500/10 border-red-500/20 text-red-500"
                          }`}
                        >
                          {r.status === "pass" ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : r.status === "warning" ? (
                            <ShieldAlert className="w-5 h-5" />
                          ) : (
                            <XCircle className="w-5 h-5" />
                          )}
                        </div>
                        <h3 className="text-lg font-bold">{r.header}</h3>
                      </div>
                      <ChevronRight className="w-4 h-4 text-app-text-sub opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                    </div>

                    <div className="pl-14 space-y-3">
                      <div className="bg-app-bg/50 border border-app-border rounded-xl p-3">
                        <code className="text-xs text-app-primary font-mono break-all">
                          {r.value || "HEADER MISSING"}
                        </code>
                      </div>
                      <p className="text-xs text-app-text-sub leading-relaxed font-medium">
                        {r.desc}
                      </p>
                      {r.recommendation && (
                        <div className="flex items-start gap-2 text-[10px] font-bold text-amber-500 bg-amber-500/5 p-2 rounded-lg border border-amber-500/20">
                          <Info className="w-3 h-3 shrink-0" />
                          <span>Recommendation: {r.recommendation}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
