import { useState } from "react";
import { Layers, Copy, Check } from "lucide-react";

export default function NeumorphismGenerator() {
  const [bgColor, setBgColor] = useState("#e0e5ec");
  const [distance, setDistance] = useState(10);
  const [intensity, setIntensity] = useState(0.15);
  const [blur, setBlur] = useState(20);
  const [mode, setMode] = useState<"flat" | "convex" | "concave" | "pressed">(
    "convex"
  );
  const [copied, setCopied] = useState(false);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 224, g: 229, b: 236 };
  };

  const generateCSS = () => {
    const rgb = hexToRgb(bgColor);
    const light = `rgba(${Math.min(255, rgb.r + 50)}, ${Math.min(
      255,
      rgb.g + 50
    )}, ${Math.min(255, rgb.b + 50)}, ${intensity})`;
    const dark = `rgba(${Math.max(0, rgb.r - 50)}, ${Math.max(
      0,
      rgb.g - 50
    )}, ${Math.max(0, rgb.b - 50)}, ${intensity})`;

    let boxShadow = "";
    if (mode === "flat") {
      boxShadow = `${distance}px ${distance}px ${blur}px ${dark}, -${distance}px -${distance}px ${blur}px ${light}`;
    } else if (mode === "convex") {
      boxShadow = `${distance}px ${distance}px ${blur}px ${dark}, -${distance}px -${distance}px ${blur}px ${light}`;
    } else if (mode === "concave") {
      boxShadow = `inset ${distance}px ${distance}px ${blur}px ${dark}, inset -${distance}px -${distance}px ${blur}px ${light}`;
    } else {
      boxShadow = `inset ${distance}px ${distance}px ${blur}px ${dark}, inset -${distance}px -${distance}px ${blur}px ${light}`;
    }

    return `background: ${bgColor};
border-radius: 16px;
box-shadow: ${boxShadow};`;
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
          <div className="p-2 bg-gradient-to-r from-gray-400 to-gray-600 rounded-lg shadow-lg">
            <Layers className="w-6 h-6 text-white" />
          </div>
          Neumorphism Generator
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Create soft UI effects with realistic shadows
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(["flat", "convex", "concave", "pressed"] as const).map(
                  (m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className={`py-2 rounded-lg capitalize transition-colors ${
                        mode === m
                          ? "bg-gray-600 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {m}
                    </button>
                  )
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Base Color
              </label>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-full h-12 rounded border border-gray-200 dark:border-gray-700 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Distance: {distance}px
              </label>
              <input
                type="range"
                min="2"
                max="50"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Blur: {blur}px
              </label>
              <input
                type="range"
                min="0"
                max="60"
                value={blur}
                onChange={(e) => setBlur(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Intensity: {intensity.toFixed(2)}
              </label>
              <input
                type="range"
                min="0.05"
                max="0.5"
                step="0.01"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* CSS Output */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                CSS Code
              </h3>
              <button
                onClick={copyCSS}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
              >
                {copied ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                Copy
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
            style={{ background: bgColor }}
          >
            <div
              className="w-64 h-64 flex items-center justify-center text-2xl font-bold"
              style={{
                background: bgColor,
                borderRadius: "16px",
                boxShadow: generateCSS()
                  .split("box-shadow: ")[1]
                  .replace(";", ""),
                color: bgColor === "#e0e5ec" ? "#555" : "#fff",
              }}
            >
              Preview
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
