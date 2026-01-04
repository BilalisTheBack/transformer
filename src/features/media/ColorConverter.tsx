import { useState, useEffect } from "react";
import { Palette, Copy, Check } from "lucide-react";
import { useTranslation } from "react-i18next";

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
};

const hslToHex = (h: number, s: number, l: number) => {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

export default function ColorConverter() {
  const { t } = useTranslation();
  const [hex, setHex] = useState("#3b82f6");
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 });
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 });

  const [palette, setPalette] = useState<string[]>([]);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const handleHexChange = (val: string) => {
    setHex(val);
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      const rgbVal = hexToRgb(val);
      if (rgbVal) {
        setRgb(rgbVal);
        setHsl(rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b));
        generatePalette(val);
      }
    }
  };

  const generatePalette = (baseHex: string) => {
    const rgbBase = hexToRgb(baseHex);
    if (!rgbBase) return;
    const { h, s } = rgbToHsl(rgbBase.r, rgbBase.g, rgbBase.b);

    const newPalette = [];
    for (let i = 1; i <= 9; i++) {
      const newL = Math.max(0, Math.min(100, i * 10));
      newPalette.push(hslToHex(h, s, newL));
    }
    setPalette(newPalette);
  };

  useEffect(() => {
    generatePalette(hex);
  }, []);

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 1000);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <header>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
            <Palette className="w-6 h-6 text-white" />
          </div>
          {t("media.color.title")}
        </h1>
        <p className="text-neutral-400">{t("media.color.description")}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input & Preview */}
        <div className="space-y-6">
          <div
            className="w-full h-32 rounded-2xl shadow-2xl flex items-center justify-center transition-colors duration-300"
            style={{ backgroundColor: hex }}
          >
            <span className="bg-black/20 backdrop-blur text-white px-3 py-1 rounded font-mono">
              {hex}
            </span>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-500 uppercase">
                HEX
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={hex}
                  onChange={(e) => handleHexChange(e.target.value)}
                  className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 font-mono text-neutral-100"
                />
                <button
                  onClick={() => copyColor(hex)}
                  className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400"
                >
                  {copiedColor === hex ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-500 uppercase">
                RGB
              </label>
              <div className="flex gap-2 items-center bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 font-mono text-neutral-300">
                <span className="flex-1">
                  rgb({rgb.r}, {rgb.g}, {rgb.b})
                </span>
                <button
                  onClick={() => copyColor(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
                  className="text-neutral-500 hover:text-white"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-500 uppercase">
                HSL
              </label>
              <div className="flex gap-2 items-center bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 font-mono text-neutral-300">
                <span className="flex-1">
                  hsl({Math.round(hsl.h)}, {Math.round(hsl.s)}%,{" "}
                  {Math.round(hsl.l)}%)
                </span>
                <button
                  onClick={() =>
                    copyColor(
                      `hsl(${Math.round(hsl.h)}, ${Math.round(
                        hsl.s
                      )}%, ${Math.round(hsl.l)}%)`
                    )
                  }
                  className="text-neutral-500 hover:text-white"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Palette */}
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-300">
            {t("media.color.generatedPalette")}
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {palette.map((color, i) => (
              <button
                key={i}
                onClick={() => copyColor(color)}
                className="group flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-800 transition-colors text-left"
              >
                <div
                  className="w-12 h-12 rounded-lg shadow-sm"
                  style={{ backgroundColor: color }}
                />
                <div className="flex-1">
                  <p className="font-mono text-sm text-neutral-300">{color}</p>
                  <p className="text-xs text-neutral-500">
                    {t("media.color.shade", { index: i + 1 })}
                  </p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-neutral-400">
                  {copiedColor === color ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
