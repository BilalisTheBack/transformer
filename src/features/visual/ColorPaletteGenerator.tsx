import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Palette, Copy, CheckCircle2 } from "lucide-react";

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function generatePalette(hex: string) {
  const rgb = hexToRgb(hex);
  if (!rgb) return [];

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const shades = [];

  for (let i = 0; i < 10; i++) {
    const lightness = 95 - i * 9;
    shades.push({
      name: `${(i + 1) * 100}`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${lightness}%)`,
    });
  }

  return shades;
}

export default function ColorPaletteGenerator() {
  const { t } = useTranslation();
  const [color, setColor] = useState("#00d4ff");
  const [copied, setCopied] = useState<string | null>(null);

  const rgb = hexToRgb(color);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;
  const palette = generatePalette(color);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const formats =
    rgb && hsl
      ? [
          { id: "hex", label: "HEX", value: color.toUpperCase() },
          {
            id: "rgb",
            label: "RGB",
            value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
          },
          {
            id: "hsl",
            label: "HSL",
            value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
          },
          {
            id: "rgba",
            label: "RGBA",
            value: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`,
          },
        ]
      : [];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-app-text flex items-center gap-3">
          <Palette className="w-8 h-8 text-app-primary" />
          {t("visual.colorPalette.title")}
        </h1>
        <p className="text-app-text-sub mt-2">
          {t("visual.colorPalette.description")}
        </p>
      </header>

      {/* Color Picker */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-20 h-20 rounded-xl cursor-pointer border-2 border-app-border"
          />
        </div>
        <input
          type="text"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="bg-app-panel border border-app-border rounded-xl px-4 py-3 font-mono text-app-text focus:outline-none focus:border-app-primary"
          placeholder="#00d4ff"
        />
      </div>

      {/* Color Formats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {formats.map((format) => (
          <div
            key={format.id}
            className="p-4 bg-app-panel border border-app-border rounded-xl"
          >
            <span className="text-xs text-app-text-mute block mb-1">
              {format.label}
            </span>
            <div className="flex items-center justify-between">
              <code className="text-sm font-mono text-app-text">
                {format.value}
              </code>
              <button
                onClick={() => copyToClipboard(format.value, format.id)}
                className="text-app-text-sub hover:text-app-primary transition-colors"
              >
                {copied === format.id ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Color Palette */}
      <div className="space-y-3">
        <span className="text-sm font-medium text-app-text-sub">
          {t("visual.colorPalette.shades")}
        </span>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
          {palette.map((shade) => (
            <button
              key={shade.name}
              onClick={() => copyToClipboard(shade.hsl, `shade-${shade.name}`)}
              className="group relative aspect-square rounded-lg transition-transform hover:scale-110"
              style={{ backgroundColor: shade.hsl }}
            >
              <span className="absolute inset-0 flex items-center justify-center text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white rounded-lg">
                {shade.name}
              </span>
              {copied === `shade-${shade.name}` && (
                <CheckCircle2 className="absolute inset-0 m-auto w-5 h-5 text-white" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Complementary Colors */}
      {hsl && (
        <div className="space-y-3">
          <span className="text-sm font-medium text-app-text-sub">
            {t("visual.colorPalette.complementary")}
          </span>
          <div className="flex gap-3">
            <div
              className="w-16 h-16 rounded-xl border border-app-border"
              style={{
                backgroundColor: `hsl(${(hsl.h + 180) % 360}, ${hsl.s}%, ${
                  hsl.l
                }%)`,
              }}
              title="Complementary"
            />
            <div
              className="w-16 h-16 rounded-xl border border-app-border"
              style={{
                backgroundColor: `hsl(${(hsl.h + 120) % 360}, ${hsl.s}%, ${
                  hsl.l
                }%)`,
              }}
              title="Triadic 1"
            />
            <div
              className="w-16 h-16 rounded-xl border border-app-border"
              style={{
                backgroundColor: `hsl(${(hsl.h + 240) % 360}, ${hsl.s}%, ${
                  hsl.l
                }%)`,
              }}
              title="Triadic 2"
            />
          </div>
        </div>
      )}
    </div>
  );
}
