import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Sparkles, Copy, Check } from "lucide-react";

export default function GlassmorphismGenerator() {
  const { t } = useTranslation();
  const [blur, setBlur] = useState(10);
  const [opacity, setOpacity] = useState(0.1);
  const [saturation, setSaturation] = useState(1.5);
  const [borderOpacity, setBorderOpacity] = useState(0.2);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [copied, setCopied] = useState(false);

  const generateCSS = () => {
    return `background: rgba(255, 255, 255, ${opacity});
backdrop-filter: blur(${blur}px) saturate(${saturation});
-webkit-backdrop-filter: blur(${blur}px) saturate(${saturation});
border-radius: 12px;
border: 1px solid rgba(255, 255, 255, ${borderOpacity});
box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);`;
  };

  const copyCSS = () => {
    navigator.clipboard.writeText(generateCSS());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6 animate-in fade-in duration-500 pb-24">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          {t("css.glassmorphism.title")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("css.glassmorphism.description")}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("css.glassmorphism.blur")}: {blur}px
              </label>
              <input
                type="range"
                min="0"
                max="40"
                value={blur}
                onChange={(e) => setBlur(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("css.glassmorphism.transparency")}: {opacity.toFixed(2)}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("css.glassmorphism.saturation")}: {saturation.toFixed(1)}
              </label>
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={saturation}
                onChange={(e) => setSaturation(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("css.glassmorphism.border")}: {borderOpacity.toFixed(2)}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={borderOpacity}
                onChange={(e) => setBorderOpacity(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Background Color
              </label>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-full h-12 rounded border border-gray-200 dark:border-gray-700 cursor-pointer"
              />
            </div>
          </div>

          {/* CSS Output */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("css.glassmorphism.cssCode")}
              </h3>
              <button
                onClick={copyCSS}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-100 dark:hover:bg-cyan-900/30 rounded transition-colors"
              >
                {copied ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                {copied
                  ? t("css.glassmorphism.copied")
                  : t("css.glassmorphism.copy")}
              </button>
            </div>
            <pre className="px-3 py-2 bg-gray-900 dark:bg-black rounded text-green-400 font-mono text-xs overflow-x-auto whitespace-pre-wrap">
              {generateCSS()}
            </pre>
          </div>
        </div>

        {/* Preview */}
        <div>
          <div
            className="w-full h-full min-h-96 rounded-xl p-6 flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}dd 100%)`,
              backgroundSize: "cover",
            }}
          >
            <div
              className="p-8 rounded-xl"
              style={{
                background: `rgba(255, 255, 255, ${opacity})`,
                backdropFilter: `blur(${blur}px) saturate(${saturation})`,
                WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation})`,
                border: `1px solid rgba(255, 255, 255, ${borderOpacity})`,
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
              }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Glass Card
              </h2>
              <p className="text-gray-700">
                {t("css.glassmorphism.description")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
