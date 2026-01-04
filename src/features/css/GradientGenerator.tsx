import { useState } from "react";
import { Palette, Copy, Check, Plus, Trash2 } from "lucide-react";

interface ColorStop {
  id: string;
  color: string;
  position: number;
}

export default function GradientGenerator() {
  const [type, setType] = useState<"linear" | "radial" | "conic">("linear");
  const [angle, setAngle] = useState(90);
  const [stops, setStops] = useState<ColorStop[]>([
    { id: crypto.randomUUID(), color: "#667eea", position: 0 },
    { id: crypto.randomUUID(), color: "#764ba2", position: 100 },
  ]);
  const [copied, setCopied] = useState(false);

  const generateCSS = () => {
    const colorStops = stops
      .sort((a, b) => a.position - b.position)
      .map((s) => `${s.color} ${s.position}%`)
      .join(", ");

    if (type === "linear") {
      return `background: linear-gradient(${angle}deg, ${colorStops});`;
    } else if (type === "radial") {
      return `background: radial-gradient(circle, ${colorStops});`;
    } else {
      return `background: conic-gradient(from ${angle}deg, ${colorStops});`;
    }
  };

  const copyCSS = () => {
    navigator.clipboard.writeText(generateCSS());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addStop = () => {
    setStops([
      ...stops,
      { id: crypto.randomUUID(), color: "#ffffff", position: 50 },
    ]);
  };

  const removeStop = (id: string) => {
    if (stops.length > 2) {
      setStops(stops.filter((s) => s.id !== id));
    }
  };

  const updateStop = (
    id: string,
    field: "color" | "position",
    value: string | number
  ) => {
    setStops(stops.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6 animate-in fade-in duration-500 pb-24">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg">
            <Palette className="w-6 h-6 text-white" />
          </div>
          Gradient Generator
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Create beautiful CSS gradients with live preview
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Gradient Type
              </label>
              <div className="flex gap-2">
                {(["linear", "radial", "conic"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`flex-1 py-2 rounded-lg capitalize transition-colors ${
                      type === t
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {(type === "linear" || type === "conic") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {type === "linear" ? "Angle" : "Start Angle"}: {angle}°
                </label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={angle}
                  onChange={(e) => setAngle(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* Color Stops */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Color Stops
              </h3>
              <button
                onClick={addStop}
                className="text-sm text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>

            <div className="space-y-2">
              {stops
                .sort((a, b) => a.position - b.position)
                .map((stop) => (
                  <div key={stop.id} className="flex items-center gap-2">
                    <input
                      type="color"
                      value={stop.color}
                      onChange={(e) =>
                        updateStop(stop.id, "color", e.target.value)
                      }
                      className="w-12 h-10 rounded border border-gray-200 dark:border-gray-700 cursor-pointer"
                    />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={stop.position}
                      onChange={(e) =>
                        updateStop(stop.id, "position", Number(e.target.value))
                      }
                      className="flex-1"
                    />
                    <span className="text-sm font-mono text-gray-600 dark:text-gray-400 w-12">
                      {stop.position}%
                    </span>
                    <button
                      onClick={() => removeStop(stop.id)}
                      disabled={stops.length <= 2}
                      className="p-1 text-red-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
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
                className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded transition-colors"
              >
                {copied ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                Copy
              </button>
            </div>
            <pre className="px-3 py-2 bg-gray-900 dark:bg-black rounded text-green-400 font-mono text-sm overflow-x-auto">
              {generateCSS()}
            </pre>
          </div>
        </div>

        {/* Preview */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Preview
            </h3>
            <div
              className="w-full h-96 rounded-xl shadow-2xl"
              style={{
                background: generateCSS()
                  .replace("background: ", "")
                  .replace(";", ""),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
