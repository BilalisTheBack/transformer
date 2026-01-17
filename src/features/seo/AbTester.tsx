import { useState } from "react";
import {
  Split,
  ArrowRight,
  CheckCircle2,
  BarChart,
  FlaskConical,
  Zap,
  TrendingUp,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface Variant {
  title: string;
  description: string;
}

export default function AbTester() {
  const { t } = useTranslation();
  const [variantA, setVariantA] = useState<Variant>({
    title: "The Transformer | Best Productivity Tools",
    description:
      "Access our collection of free online tools for developers, designers and managers. Transform your workflow today.",
  });
  const [variantB, setVariantB] = useState<Variant>({
    title: "Boost Your Workflow with The Transformer - Free Tools",
    description:
      "Stop wasting time. Use The Transformer's professional-grade tools to convert, optimize, and generate content instantly.",
  });

  const [loading, setLoading] = useState(false);
  const [winner, setWinner] = useState<"A" | "B" | null>(null);

  const runTest = () => {
    setLoading(true);
    setWinner(null);
    setTimeout(() => {
      setWinner(Math.random() > 0.5 ? "A" : "B");
      setLoading(false);
    }, 1500);
  };

  const GooglePreview = ({
    variant,
    label,
    active,
  }: {
    variant: Variant;
    label: string;
    active: boolean;
  }) => (
    <div
      className={`p-6 bg-app-panel border-2 rounded-2xl transition-all duration-500 scale-100 ${
        active
          ? "border-app-primary ring-4 ring-app-primary/10 shadow-2xl"
          : "border-app-border opacity-70"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${
            active ? "bg-app-primary text-white" : "bg-app-bg text-app-text-sub"
          }`}
        >
          {t("seoGrowth.abTester.variant")} {label}
        </span>
        {active && (
          <div className="flex items-center gap-1 text-xs text-green-500 font-bold">
            <Zap className="w-3 h-3" />
            POTENTIAL WINNER
          </div>
        )}
      </div>
      <div className="space-y-1">
        <div className="text-xs text-app-text-sub truncate mb-1">
          https://transformer.app › tools
        </div>
        <h4 className="text-blue-500 dark:text-blue-400 text-lg font-medium hover:underline cursor-pointer line-clamp-1">
          {variant.title || "Page Title..."}
        </h4>
        <p className="text-sm text-app-text-sub line-clamp-2 leading-relaxed h-10">
          {variant.description ||
            "Enter a meta description to see how it looks in search results..."}
        </p>
      </div>
      <div className="mt-6 pt-4 border-t border-app-border grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-[10px] font-bold text-app-text-sub uppercase">
            CTR
          </p>
          <p
            className={`text-xl font-black ${active ? "text-app-primary" : ""}`}
          >
            {active ? "4.8%" : "3.1%"}
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-bold text-app-text-sub uppercase">
            Relevance
          </p>
          <p
            className={`text-xl font-black ${active ? "text-app-primary" : ""}`}
          >
            {active ? "High" : "Med"}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <div className="p-2 bg-orange-600 rounded-lg shadow-lg shadow-orange-500/20">
            <Split className="w-6 h-6 text-white" />
          </div>
          <span className="gradient-text-optimized">
            {t("seoGrowth.abTester.title")}
          </span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("seoGrowth.abTester.description")}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Editor A */}
        <div className="bg-app-panel border border-app-border rounded-2xl p-6 space-y-4">
          <h3 className="font-bold flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-app-primary" />
            {t("seoGrowth.abTester.variant")} A
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-app-text-sub uppercase mb-1">
                Title Tag
              </label>
              <input
                type="text"
                value={variantA.title}
                onChange={(e) =>
                  setVariantA({ ...variantA, title: e.target.value })
                }
                className="w-full bg-app-bg border border-app-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-app-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-app-text-sub uppercase mb-1">
                Meta Description
              </label>
              <textarea
                rows={3}
                value={variantA.description}
                onChange={(e) =>
                  setVariantA({ ...variantA, description: e.target.value })
                }
                className="w-full bg-app-bg border border-app-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-app-primary outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Editor B */}
        <div className="bg-app-panel border border-app-border rounded-2xl p-6 space-y-4">
          <h3 className="font-bold flex items-center gap-2">
            <Split className="w-4 h-4 text-orange-500" />
            {t("seoGrowth.abTester.variant")} B
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-app-text-sub uppercase mb-1">
                Title Tag
              </label>
              <input
                type="text"
                value={variantB.title}
                onChange={(e) =>
                  setVariantB({ ...variantB, title: e.target.value })
                }
                className="w-full bg-app-bg border border-app-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-app-text-sub uppercase mb-1">
                Meta Description
              </label>
              <textarea
                rows={3}
                value={variantB.description}
                onChange={(e) =>
                  setVariantB({ ...variantB, description: e.target.value })
                }
                className="w-full bg-app-bg border border-app-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 outline-none resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-app-panel border border-app-border rounded-2xl p-8 flex flex-col items-center justify-center space-y-6">
        <div className="flex items-center gap-12">
          <div className="text-center space-y-1">
            <span className="text-2xl font-black">
              {t("seoGrowth.abTester.variant")} A
            </span>
            <p className="text-xs text-app-text-sub uppercase font-bold">
              Control
            </p>
          </div>
          <ArrowRight className="w-8 h-8 text-app-text-sub opacity-20" />
          <div className="text-center space-y-1">
            <span className="text-2xl font-black">
              {t("seoGrowth.abTester.variant")} B
            </span>
            <p className="text-xs text-app-text-sub uppercase font-bold">
              Challenger
            </p>
          </div>
        </div>

        <button
          onClick={runTest}
          disabled={loading}
          className="px-12 py-4 bg-app-primary text-white rounded-2xl font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-app-primary/30 disabled:opacity-50 flex items-center gap-3"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              {t("seoGrowth.abTester.comparing")}...
            </>
          ) : (
            <>
              <BarChart className="w-5 h-5" />
              {t("seoGrowth.abTester.runTest")}
            </>
          )}
        </button>
      </div>

      {/* Previews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GooglePreview variant={variantA} label="A" active={winner === "A"} />
        <GooglePreview variant={variantB} label="B" active={winner === "B"} />
      </div>

      {/* Summary Stats */}
      {winner && (
        <div className="bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-app-primary/20 rounded-2xl p-8 animate-in slide-in-from-bottom-8 duration-700">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="p-4 bg-app-primary text-white rounded-2xl shadow-xl">
              <TrendingUp className="w-12 h-12" />
            </div>
            <div className="flex-1 space-y-2 text-center md:text-left">
              <h3 className="text-2xl font-bold">
                {t("seoGrowth.abTester.result")}:{" "}
                {t("seoGrowth.abTester.variant")} {winner}
              </h3>
              <p className="text-app-text-sub">
                {t("seoGrowth.abTester.readyDesc")}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-app-text-sub">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> Better
                  keyword clustering
                </div>
                <div className="flex items-center gap-2 text-sm text-app-text-sub">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> Stronger
                  call-to-action
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
