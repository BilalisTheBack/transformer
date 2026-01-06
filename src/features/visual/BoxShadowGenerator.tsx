import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Square, Copy, CheckCircle2, RotateCcw } from "lucide-react";

interface ShadowConfig {
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
}

export default function BoxShadowGenerator() {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [shadows, setShadows] = useState<ShadowConfig[]>([
    {
      offsetX: 0,
      offsetY: 10,
      blur: 30,
      spread: -5,
      color: "#000000",
      opacity: 25,
      inset: false,
    },
  ]);

  const addShadow = () => {
    setShadows([
      ...shadows,
      {
        offsetX: 0,
        offsetY: 5,
        blur: 15,
        spread: 0,
        color: "#000000",
        opacity: 20,
        inset: false,
      },
    ]);
  };

  const removeShadow = (index: number) => {
    setShadows(shadows.filter((_, i) => i !== index));
  };

  const updateShadow = (
    index: number,
    key: keyof ShadowConfig,
    value: number | string | boolean
  ) => {
    const newShadows = [...shadows];
    (newShadows[index] as any)[key] = value;
    setShadows(newShadows);
  };

  const resetShadows = () => {
    setShadows([
      {
        offsetX: 0,
        offsetY: 10,
        blur: 30,
        spread: -5,
        color: "#000000",
        opacity: 25,
        inset: false,
      },
    ]);
  };

  const hexToRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  };

  const generateCss = () => {
    return shadows
      .map((s) => {
        const inset = s.inset ? "inset " : "";
        const color = hexToRgba(s.color, s.opacity);
        return `${inset}${s.offsetX}px ${s.offsetY}px ${s.blur}px ${s.spread}px ${color}`;
      })
      .join(", ");
  };

  const cssValue = generateCss();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`box-shadow: ${cssValue};`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-app-text flex items-center gap-3">
          <Square className="w-8 h-8 text-app-primary" />
          {t("visual.boxShadow.title")}
        </h1>
        <p className="text-app-text-sub mt-2">
          {t("visual.boxShadow.description")}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          {shadows.map((shadow, index) => (
            <div
              key={index}
              className="p-4 bg-app-panel border border-app-border rounded-xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-app-text">
                  {t("visual.boxShadow.shadowIndex", { index: index + 1 })}
                </span>
                {shadows.length > 1 && (
                  <button
                    onClick={() => removeShadow(index)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    {t("visual.boxShadow.remove")}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-app-text-sub">
                    {t("visual.boxShadow.offsetX")}
                  </label>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={shadow.offsetX}
                    onChange={(e) =>
                      updateShadow(index, "offsetX", Number(e.target.value))
                    }
                    className="w-full"
                  />
                  <span className="text-xs text-app-text-mute">
                    {shadow.offsetX}px
                  </span>
                </div>
                <div>
                  <label className="text-xs text-app-text-sub">
                    {t("visual.boxShadow.offsetY")}
                  </label>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={shadow.offsetY}
                    onChange={(e) =>
                      updateShadow(index, "offsetY", Number(e.target.value))
                    }
                    className="w-full"
                  />
                  <span className="text-xs text-app-text-mute">
                    {shadow.offsetY}px
                  </span>
                </div>
                <div>
                  <label className="text-xs text-app-text-sub">
                    {t("visual.boxShadow.blur")}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={shadow.blur}
                    onChange={(e) =>
                      updateShadow(index, "blur", Number(e.target.value))
                    }
                    className="w-full"
                  />
                  <span className="text-xs text-app-text-mute">
                    {shadow.blur}px
                  </span>
                </div>
                <div>
                  <label className="text-xs text-app-text-sub">
                    {t("visual.boxShadow.spread")}
                  </label>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={shadow.spread}
                    onChange={(e) =>
                      updateShadow(index, "spread", Number(e.target.value))
                    }
                    className="w-full"
                  />
                  <span className="text-xs text-app-text-mute">
                    {shadow.spread}px
                  </span>
                </div>
                <div>
                  <label className="text-xs text-app-text-sub">
                    {t("visual.boxShadow.opacity")}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={shadow.opacity}
                    onChange={(e) =>
                      updateShadow(index, "opacity", Number(e.target.value))
                    }
                    className="w-full"
                  />
                  <span className="text-xs text-app-text-mute">
                    {shadow.opacity}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={shadow.color}
                    onChange={(e) =>
                      updateShadow(index, "color", e.target.value)
                    }
                    className="w-10 h-10 rounded cursor-pointer border border-app-border"
                  />
                  <label className="flex items-center gap-2 text-xs text-app-text-sub cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shadow.inset}
                      onChange={(e) =>
                        updateShadow(index, "inset", e.target.checked)
                      }
                      className="rounded border-app-border"
                    />
                    {t("visual.boxShadow.inset")}
                  </label>
                </div>
              </div>
            </div>
          ))}

          <div className="flex gap-3">
            <button
              onClick={addShadow}
              className="px-4 py-2 bg-app-primary hover:bg-app-primary-hover text-white font-medium rounded-xl transition-colors"
            >
              + {t("visual.boxShadow.add")}
            </button>
            <button
              onClick={resetShadows}
              className="flex items-center gap-2 px-4 py-2 bg-app-panel border border-app-border hover:border-app-text-mute text-app-text-sub rounded-xl transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              {t("visual.boxShadow.reset")}
            </button>
          </div>
        </div>

        {/* Preview & Output */}
        <div className="space-y-4">
          {/* Preview */}
          <div className="h-64 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-xl flex items-center justify-center p-8">
            <div
              className="w-32 h-32 bg-white dark:bg-slate-700 rounded-2xl"
              style={{ boxShadow: cssValue }}
            />
          </div>

          {/* CSS Output */}
          <div className="p-4 bg-app-panel border border-app-border rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-app-text-sub">CSS</span>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 text-sm text-app-text-sub hover:text-app-primary transition-colors"
              >
                {copied ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                {t("common.copy")}
              </button>
            </div>
            <pre className="text-sm font-mono text-app-text overflow-x-auto whitespace-pre-wrap break-all">
              box-shadow: {cssValue};
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
