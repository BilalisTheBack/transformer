import { useState } from "react";
import {
  GitBranch,
  Plus,
  Trash2,
  Play,
  Save,
  Settings,
  ArrowRight,
  Box,
  Zap,
  Activity,
  Layers,
  ChevronDown,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface FlowStep {
  id: string;
  type: "input" | "process" | "output";
  label: string;
  description: string;
}

export default function FlowBuilder() {
  const { t } = useTranslation();
  const [steps, setSteps] = useState<FlowStep[]>([
    {
      id: "1",
      type: "input",
      label: "HTTP Request",
      description: "Fetch source data from API",
    },
    {
      id: "2",
      type: "process",
      label: "JSON Transform",
      description: "Clean and format data",
    },
    {
      id: "3",
      type: "output",
      label: "Cloud Upload",
      description: "Sync to target server",
    },
  ]);

  const addStep = () => {
    const id = Math.random().toString(36).substr(2, 9);
    setSteps([
      ...steps,
      {
        id,
        type: "process",
        label: "New Transformer",
        description: "Configure tool logic",
      },
    ]);
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter((s) => s.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <div className="p-2 bg-app-primary rounded-lg shadow-lg shadow-app-primary/20">
            <GitBranch className="w-6 h-6 text-white" />
          </div>
          <span className="gradient-text-optimized">
            {t("ecosystem.flowBuilder.title")}
          </span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("ecosystem.flowBuilder.description")}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Flow Canvas */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-app-panel border border-app-border rounded-2xl p-8 relative overflow-hidden min-h-[600px] flex flex-col items-center">
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] opacity-50" />

            <div className="relative z-10 w-full max-w-md space-y-4">
              {steps.map((step, idx) => (
                <div
                  key={step.id}
                  className="flex flex-col items-center animate-in slide-in-from-top-4 duration-500"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="w-full bg-app-bg border border-app-border rounded-xl p-5 shadow-lg group hover:border-app-primary/50 transition-all relative">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            step.type === "input"
                              ? "bg-blue-500"
                              : step.type === "process"
                              ? "bg-app-primary"
                              : "bg-emerald-500"
                          }`}
                        >
                          <Box className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-sm tracking-tight">
                          {step.label}
                        </span>
                      </div>
                      <button
                        onClick={() => removeStep(step.id)}
                        className="p-1 hover:bg-red-500/10 text-app-text-sub hover:text-red-500 rounded transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-app-text-sub leading-relaxed">
                      {step.description}
                    </p>

                    {/* Connection Point Bottom */}
                    {idx < steps.length - 1 && (
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-app-panel border border-app-border rounded-full flex items-center justify-center z-10">
                        <ChevronDown className="w-4 h-4 text-app-text-sub" />
                      </div>
                    )}
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="w-px h-8 bg-app-border" />
                  )}
                </div>
              ))}

              <button
                onClick={addStep}
                className="w-full py-4 border-2 border-dashed border-app-border rounded-xl flex items-center justify-center gap-2 text-app-text-sub hover:border-app-primary/50 hover:bg-app-primary/5 transition-all text-sm font-bold"
              >
                <Plus className="w-4 h-4" />
                {t("ecosystem.flowBuilder.add")}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-app-panel border border-app-border rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="font-bold flex items-center gap-2">
              <Settings className="w-5 h-5 text-app-primary" />
              {t("ecosystem.flowBuilder.config")}
            </h3>

            <div className="space-y-3">
              <button className="w-full py-3 bg-app-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-app-primary/20">
                <Play className="w-4 h-4" />
                {t("ecosystem.flowBuilder.analyze")}
              </button>
              <button className="w-full py-3 bg-app-bg border border-app-border rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-app-panel transition-colors">
                <Save className="w-4 h-4" />
                {t("seo.metaTag.copy")}
              </button>
            </div>

            <div className="pt-6 border-t border-app-border space-y-4">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-app-text-sub">
                <span>Active Nodes</span>
                <span>{steps.length} / 12</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl space-y-4 relative overflow-hidden group">
            <Activity className="absolute -right-4 -bottom-4 w-32 h-32 opacity-5 scale-150 rotate-12 group-hover:scale-125 transition-transform" />
            <div className="relative z-10 space-y-4">
              <h4 className="font-bold flex items-center gap-2 text-app-primary">
                <Zap className="w-4 h-4" />
                Optimization
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                {t("ecosystem.flowBuilder.readyDesc")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
