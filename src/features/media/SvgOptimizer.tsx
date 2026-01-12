import { useState, useCallback } from "react";
import { Download, Copy, Check, Trash2, Zap, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDropzone } from "react-dropzone";

export default function SvgOptimizer() {
  const { t } = useTranslation();
  const [inputSvg, setInputSvg] = useState("");
  const [outputSvg, setOutputSvg] = useState("");
  const [stats, setStats] = useState<{
    original: number;
    optimized: number;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const optimize = useCallback((svg: string) => {
    let optimized = svg
      .replace(/<!--[\s\S]*?-->/g, "") // Remove comments
      .replace(/<\?xml[\s\S]*?\?>/g, "") // Remove XML declaration
      .replace(/<!DOCTYPE[\s\S]*?>/g, "") // Remove doctype
      .replace(/metadata|desc|title/g, "g") // Neutralize some tags (simple)
      .replace(/>\s+</g, "><") // Remove whitespace between tags
      .trim();

    // Remove empty groups or specific attributes often added by editors
    optimized = optimized.replace(
      / (version|xmlns:xlink|x|y|xml:space)="[^"]*"/g,
      ""
    );

    setOutputSvg(optimized);
    setStats({
      original: new Blob([svg]).size,
      optimized: new Blob([optimized]).size,
    });
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file && file.type === "image/svg+xml") {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setInputSvg(content);
          optimize(content);
        };
        reader.readAsText(file);
      }
    },
    [optimize]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/svg+xml": [".svg"] },
    multiple: false,
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(outputSvg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([outputSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "optimized.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const savings = stats
    ? Math.max(
        0,
        ((stats.original - stats.optimized) / stats.original) * 100
      ).toFixed(1)
    : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter premium-gradient">
          {t("svg.title", "SVG Optimizer")}
        </h1>
        <p className="text-app-text-sub">
          {t(
            "svg.subtitle",
            "Compress and clean SVG files without quality loss"
          )}
        </p>
      </div>

      {!inputSvg ? (
        <div
          {...getRootProps()}
          className={`group mt-12 flex flex-col items-center justify-center border-2 border-dashed rounded-3xl p-12 md:p-24 transition-all cursor-pointer ${
            isDragActive
              ? "border-app-primary bg-app-primary/5 scale-[0.99]"
              : "border-app-border bg-app-panel hover:border-app-primary/50 hover:bg-app-primary/5"
          }`}
        >
          <input {...getInputProps()} />
          <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-app-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
            <Zap className="w-10 h-10 md:w-14 md:h-14 text-app-primary" />
          </div>
          <p className="text-xl md:text-2xl font-bold text-app-text">
            {isDragActive ? "Drop SVG here" : "Click or drag SVG file"}
          </p>
          <p className="text-app-text-sub mt-2">Up to 5MB, .svg files only</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Options & Stats */}
          <div className="space-y-6">
            <div className="bg-app-panel border border-app-border rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold flex items-center gap-2">
                  <Zap className="w-5 h-5 text-app-primary" />
                  Optimization Stats
                </h3>
                <button
                  onClick={() => {
                    setInputSvg("");
                    setOutputSvg("");
                    setStats(null);
                  }}
                  className="p-2 hover:bg-app-bg rounded-lg text-app-text-passive hover:text-red-400 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-app-bg border border-app-border rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-app-text-passive">
                    Original
                  </span>
                  <div className="text-xl font-mono">
                    {(stats!.original / 1024).toFixed(2)} KB
                  </div>
                </div>
                <div className="p-4 bg-app-bg border border-app-border rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-app-text-passive">
                    Optimized
                  </span>
                  <div className="text-xl font-mono text-app-primary">
                    {(stats!.optimized / 1024).toFixed(2)} KB
                  </div>
                </div>
              </div>

              <div className="p-6 bg-app-primary/5 border border-app-primary/20 rounded-2xl text-center">
                <div className="text-4xl font-black text-app-primary">
                  {savings}%
                </div>
                <div className="text-sm font-medium text-app-primary/70">
                  Total Space Saved
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleDownload}
                className="w-full py-4 bg-app-primary text-white rounded-2xl font-bold hover:bg-app-primary-hover shadow-xl shadow-app-primary/20 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Optimized SVG
              </button>
              <button
                onClick={handleCopy}
                className="w-full py-4 bg-app-panel border border-app-border text-app-text rounded-2xl font-bold hover:border-app-primary/50 transition-all flex items-center justify-center gap-2"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5 text-app-text-sub" />
                )}
                {copied ? "Copied SVG Code!" : "Copy SVG Code"}
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <div className="bg-app-panel border border-app-border rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-4 bg-app-border/20 border-b border-app-border flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-app-text-sub">
                  Preview
                </span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-app-border" />
                  <div className="w-2 h-2 rounded-full bg-app-border" />
                </div>
              </div>
              <div className="p-12 flex items-center justify-center bg-white/5 min-h-[400px]">
                <div
                  className="max-w-full max-h-full transition-all"
                  dangerouslySetInnerHTML={{ __html: outputSvg }}
                />
              </div>
            </div>
            <div className="p-4 bg-app-panel/50 border border-app-border rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
              <p className="text-xs text-app-text-passive leading-relaxed">
                Our basic optimizer removes unnecessary tags and attributes
                while maintaining path integrity. Best results for SVG assets
                exported from Figma or Illustrator.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
