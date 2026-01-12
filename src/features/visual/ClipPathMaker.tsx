import { useState } from "react";
import { Copy, Check, Scissors } from "lucide-react";
import { useTranslation } from "react-i18next";

const SHAPES = {
  Triangle: "polygon(50% 0%, 0% 100%, 100% 100%)",
  Circle: "circle(50% at 50% 50%)",
  Pentagon: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
  Hexagon: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
  Rhombus: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
  "Left Arrow":
    "polygon(40% 0%, 40% 20%, 100% 20%, 100% 80%, 40% 80%, 40% 100%, 0% 50%)",
  "Right Arrow":
    "polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)",
  Message:
    "polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%)",
  Close:
    "polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%)",
};

export default function ClipPathMaker() {
  const { t } = useTranslation();
  const [clipPath, setClipPath] = useState(SHAPES.Triangle);
  const [copied, setCopied] = useState(false);
  const [activeShape, setActiveShape] = useState("Triangle");

  const handleCopy = () => {
    navigator.clipboard.writeText(`clip-path: ${clipPath};`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter premium-gradient">
          {t("clippath.title", "CSS Clip-Path Maker")}
        </h1>
        <p className="text-app-text-sub">
          {t("clippath.subtitle", "Generate CSS clip-path shapes visually")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-app-panel border border-app-border rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-app-text-sub flex items-center gap-2">
              <Scissors className="w-4 h-4" />
              Presets
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(SHAPES).map(([name, value]) => (
                <button
                  key={name}
                  onClick={() => {
                    setClipPath(value);
                    setActiveShape(name);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    activeShape === name
                      ? "bg-app-primary/20 border-app-primary text-app-primary shadow-lg shadow-app-primary/10"
                      : "bg-app-bg border-app-border text-app-text-sub hover:border-app-primary/50"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-app-panel border border-app-border rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-widest text-app-text-sub">
                CSS Code
              </h3>
              <button
                onClick={handleCopy}
                className="p-2 hover:bg-app-bg rounded-lg transition-all group"
                title="Copy Code"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-app-text-sub group-hover:text-app-primary" />
                )}
              </button>
            </div>
            <div className="p-4 bg-app-bg border border-app-border rounded-xl font-mono text-xs break-all leading-relaxed text-app-primary">
              clip-path: {clipPath};
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:col-span-8 flex flex-col items-center gap-8">
          <div className="relative group perspective-1000">
            <div className="absolute inset-0 bg-app-primary/20 blur-3xl rounded-full scale-150 opacity-50 transition-opacity group-hover:opacity-80" />
            <div
              className="w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-cyan-400 via-indigo-500 to-purple-600 transition-all duration-700 ease-out shadow-2xl relative z-10"
              style={{ clipPath }}
            >
              <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
            </div>

            {/* Background grid for context */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
          </div>

          <div className="w-full max-w-md p-6 bg-app-panel border border-app-border rounded-2xl text-center space-y-2">
            <p className="text-sm text-app-text-sub italic">
              "Use the presets on the left to change the character of the
              shape."
            </p>
            <div className="flex items-center justify-center gap-4 pt-2">
              <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase tracking-tighter font-bold text-app-text-passive">
                  Type
                </span>
                <span className="text-xs font-mono">{activeShape}</span>
              </div>
              <div className="w-px h-8 bg-app-border" />
              <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase tracking-tighter font-bold text-app-text-passive">
                  Points
                </span>
                <span className="text-xs font-mono">
                  {clipPath.split(",").length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
