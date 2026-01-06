import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Type, Copy, Check } from "lucide-react";

export default function CssClampGenerator() {
  const { t } = useTranslation();
  const [minValue, setMinValue] = useState(16);
  const [minUnit, setMinUnit] = useState("px");
  const [preferredValue, setPreferredValue] = useState(2);
  const [preferredUnit, setPreferredUnit] = useState("vw");
  const [maxValue, setMaxValue] = useState(24);
  const [maxUnit, setMaxUnit] = useState("px");
  const [copied, setCopied] = useState(false);

  const generateCSS = () => {
    return `font-size: clamp(${minValue}${minUnit}, ${preferredValue}${preferredUnit}, ${maxValue}${maxUnit});`;
  };

  const copyCSS = () => {
    navigator.clipboard.writeText(generateCSS());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const applyPreset = (preset: string) => {
    switch (preset) {
      case "h1":
        setMinValue(32);
        setMinUnit("px");
        setPreferredValue(5);
        setPreferredUnit("vw");
        setMaxValue(64);
        setMaxUnit("px");
        break;
      case "h2":
        setMinValue(24);
        setMinUnit("px");
        setPreferredValue(4);
        setPreferredUnit("vw");
        setMaxValue(48);
        setMaxUnit("px");
        break;
      case "body":
        setMinValue(14);
        setMinUnit("px");
        setPreferredValue(1.5);
        setPreferredUnit("vw");
        setMaxValue(18);
        setMaxUnit("px");
        break;
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6 animate-in fade-in duration-500 pb-24">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg shadow-lg">
            <Type className="w-6 h-6 text-white" />
          </div>
          {t("css.clamp.title")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("css.clamp.description")}
        </p>
      </header>

      {/* Presets */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Presets
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => applyPreset("h1")}
            className="px-3 py-1.5 text-sm bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-200 dark:hover:bg-orange-900/50 text-orange-700 dark:text-orange-300 rounded-lg transition-colors"
          >
            Heading 1
          </button>
          <button
            onClick={() => applyPreset("h2")}
            className="px-3 py-1.5 text-sm bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-200 dark:hover:bg-orange-900/50 text-orange-700 dark:text-orange-300 rounded-lg transition-colors"
          >
            Heading 2
          </button>
          <button
            onClick={() => applyPreset("body")}
            className="px-3 py-1.5 text-sm bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-200 dark:hover:bg-orange-900/50 text-orange-700 dark:text-orange-300 rounded-lg transition-colors"
          >
            Body Text
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("css.clamp.minValue")}
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={minValue}
                onChange={(e) => setMinValue(Number(e.target.value))}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
              <select
                value={minUnit}
                onChange={(e) => setMinUnit(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              >
                <option value="px">px</option>
                <option value="rem">rem</option>
                <option value="em">em</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Preferred
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.1"
                value={preferredValue}
                onChange={(e) => setPreferredValue(Number(e.target.value))}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
              <select
                value={preferredUnit}
                onChange={(e) => setPreferredUnit(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              >
                <option value="vw">vw</option>
                <option value="vh">vh</option>
                <option value="%">%</option>
                <option value="rem">rem</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("css.clamp.maxValue")}
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={maxValue}
                onChange={(e) => setMaxValue(Number(e.target.value))}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
              <select
                value={maxUnit}
                onChange={(e) => setMaxUnit(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              >
                <option value="px">px</option>
                <option value="rem">rem</option>
                <option value="em">em</option>
              </select>
            </div>
          </div>
        </div>

        {/* CSS Output */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("css.clamp.result")}
            </h3>
            <button
              onClick={copyCSS}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded transition-colors"
            >
              {copied ? (
                <Check className="w-3 h-3" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
              {copied ? t("css.clamp.copied") : t("css.clamp.copy")}
            </button>
          </div>
          <pre className="px-3 py-2 bg-gray-900 dark:bg-black rounded text-green-400 font-mono text-sm">
            {generateCSS()}
          </pre>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Preview
        </h3>
        <p
          className="text-gray-900 dark:text-gray-100"
          style={{
            fontSize: `clamp(${minValue}${minUnit}, ${preferredValue}${preferredUnit}, ${maxValue}${maxUnit})`,
          }}
        >
          This text resizes responsively based on viewport width
        </p>
      </div>

      {/* Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800 text-sm text-blue-900 dark:text-blue-200">
        <p className="font-semibold mb-2">💡 How it works:</p>
        <p className="text-xs">
          CSS clamp() sets a middle value within a range of values between a
          defined minimum and maximum. It takes three parameters: minimum value,
          preferred value, and maximum value.
        </p>
      </div>
    </div>
  );
}
