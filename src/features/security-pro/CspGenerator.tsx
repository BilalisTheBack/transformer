import { useState, useMemo } from "react";
import {
  ShieldCheck,
  Copy,
  Trash2,
  Plus,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  FileCode,
} from "lucide-react";

interface Directive {
  name: string;
  values: string[];
}

export default function CspGenerator() {
  const [directives, setDirectives] = useState<Directive[]>([
    { name: "default-src", values: ["'self'"] },
    { name: "script-src", values: ["'self'"] },
    { name: "style-src", values: ["'self'", "'unsafe-inline'"] },
  ]);

  const cspString = useMemo(() => {
    return directives.map((d) => `${d.name} ${d.values.join(" ")}`).join("; ");
  }, [directives]);

  const addValue = (directiveIdx: number, val: string) => {
    if (!val) return;
    const newDirectives = [...directives];
    if (!newDirectives[directiveIdx].values.includes(val)) {
      newDirectives[directiveIdx].values.push(val);
      setDirectives(newDirectives);
    }
  };

  const removeValue = (directiveIdx: number, valIdx: number) => {
    const newDirectives = [...directives];
    newDirectives[directiveIdx].values.splice(valIdx, 1);
    setDirectives(newDirectives);
  };

  const addDirective = () => {
    const name = prompt("Enter directive name (e.g., img-src):");
    if (name && !directives.find((d) => d.name === name)) {
      setDirectives([...directives, { name, values: ["'self'"] }]);
    }
  };

  const removeDirective = (idx: number) => {
    setDirectives(directives.filter((_, i) => i !== idx));
  };

  const warnings = useMemo(() => {
    const w = [];
    if (cspString.includes("'unsafe-inline'"))
      w.push("'unsafe-inline' detected: This weakens protection against XSS.");
    if (cspString.includes("'*'"))
      w.push(
        "Wildcard '*' detected: Broad permissions are generally discouraged."
      );
    if (!directives.find((d) => d.name === "default-src"))
      w.push(
        "Missing 'default-src': It is highly recommended to have a fallback."
      );
    return w;
  }, [cspString, directives]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold gradient-text-optimized">
          CSP Policy Generator
        </h1>
        <p className="text-app-text-sub">
          Craft secure Content Security Policies with real-time validation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-app-panel border border-app-border rounded-[32px] overflow-hidden shadow-xl">
            <div className="p-6 bg-app-bg/50 border-b border-app-border flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <FileCode className="w-4 h-4 text-app-primary" />
                Policy Directives
              </h2>
              <button
                onClick={addDirective}
                className="text-xs font-bold text-app-primary hover:text-white flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3 h-3" /> Add Directive
              </button>
            </div>

            <div className="p-8 space-y-8">
              {directives.map((d, dIdx) => (
                <div key={d.name} className="space-y-3 relative group">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-black text-app-primary font-mono">
                      {d.name}
                    </label>
                    <button
                      onClick={() => removeDirective(dIdx)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-app-text-sub hover:text-red-500 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {d.values.map((v, vIdx) => (
                      <div
                        key={vIdx}
                        className="flex items-center gap-2 px-3 py-1.5 bg-app-bg border border-app-border rounded-xl group/val hover:border-app-primary/30 transition-all"
                      >
                        <span className="text-xs font-mono">{v}</span>
                        <button
                          onClick={() => removeValue(dIdx, vIdx)}
                          className="text-app-text-sub hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <input
                      type="text"
                      placeholder="+ Add Value"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          addValue(dIdx, (e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = "";
                        }
                      }}
                      className="bg-transparent border border-dashed border-app-border rounded-xl px-3 py-1.5 text-xs focus:border-app-primary/50 focus:outline-none transition-all w-28"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Output & Analysis */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0f1115] border border-app-border rounded-[32px] p-8 shadow-2xl space-y-6 flex flex-col min-h-[400px]">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-app-text-sub">
                Generated Policy
              </h3>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(cspString);
                  alert("Policy copied!");
                }}
                className="p-2 bg-app-bg border border-app-border rounded-xl text-app-primary hover:text-white transition-all shadow-lg active:scale-95"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 bg-black/40 p-6 rounded-2xl border border-white/5 font-mono text-xs text-blue-300 break-all leading-relaxed">
              {cspString}
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase text-app-text-sub px-1">
                Example Header
              </p>
              <div className="bg-app-bg p-4 rounded-2xl border border-app-border/50 text-[10px] font-mono select-all">
                <span className="text-purple-400">
                  Content-Security-Policy:
                </span>{" "}
                {cspString}
              </div>
            </div>
          </div>

          {/* Validation */}
          <div className="bg-app-panel border border-app-border rounded-[32px] p-8 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Security Analysis
            </h3>

            {warnings.length > 0 ? (
              <div className="space-y-3">
                {warnings.map((w, i) => (
                  <div
                    key={i}
                    className="flex gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl animate-in slide-in-from-left-2 transition-all"
                  >
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                    <p className="text-xs font-medium text-amber-200/80 leading-relaxed">
                      {w}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 bg-green-500/5 border border-green-500/20 rounded-3xl flex flex-col items-center gap-4 text-center">
                <ShieldCheck className="w-12 h-12 text-green-500" />
                <div>
                  <p className="text-sm font-bold text-green-400">
                    Excellent Policy
                  </p>
                  <p className="text-[10px] text-app-text-sub mt-1">
                    No major vulnerabilities detected in this configuration.
                  </p>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-app-border/50 flex items-start gap-4">
              <div className="w-10 h-10 bg-app-primary/10 text-app-primary rounded-xl flex items-center justify-center shrink-0">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-app-text">Quick Tip</p>
                <p className="text-[10px] text-app-text-sub leading-normal">
                  Always test your CSP with{" "}
                  <code className="text-[9px] bg-app-bg px-1 rounded">
                    Content-Security-Policy-Report-Only
                  </code>{" "}
                  first before enforcing it in production.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
