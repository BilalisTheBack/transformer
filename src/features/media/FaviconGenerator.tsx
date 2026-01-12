import { useState, useCallback, useRef } from "react";
import { Download, Upload, Trash2, Image as ImageIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDropzone } from "react-dropzone";

const SIZES = [
  { name: "favicon-16x16.png", size: 16 },
  { name: "favicon-32x32.png", size: 32 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "android-chrome-192x192.png", size: 192 },
  { name: "android-chrome-512x512.png", size: 512 },
];

export default function FaviconGenerator() {
  const { t } = useTranslation();
  const [image, setImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".svg"] },
    multiple: false,
  });

  const downloadFile = (dataUrl: string, name: string) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload = (size: number, name: string) => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = size;
      canvas.height = size;
      ctx.clearRect(0, 0, size, size);

      // Maintain aspect ratio or fill? Favicons should usually be square.
      // We'll do a center crop/fill
      const min = Math.min(img.width, img.height);
      const sx = (img.width - min) / 2;
      const sy = (img.height - min) / 2;

      ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size);
      const dataUrl = canvas.toDataURL("image/png");
      downloadFile(dataUrl, name);
    };
    img.src = image;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter premium-gradient">
          {t("favicon.title", "Favicon Generator")}
        </h1>
        <p className="text-app-text-sub">
          {t(
            "favicon.subtitle",
            "Create all standard favicon sizes from one image"
          )}
        </p>
      </div>

      {!image ? (
        <div
          {...getRootProps()}
          className={`mt-12 group flex flex-col items-center justify-center border-2 border-dashed rounded-3xl p-12 md:p-24 transition-all cursor-pointer ${
            isDragActive
              ? "border-app-primary bg-app-primary/5"
              : "border-app-border bg-app-panel hover:border-app-primary/50"
          }`}
        >
          <input {...getInputProps()} />
          <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-app-primary/10 flex items-center justify-center mb-6">
            <Upload className="w-10 h-10 md:w-14 md:h-14 text-app-primary" />
          </div>
          <p className="text-xl md:text-2xl font-bold text-app-text">
            {isDragActive ? "Drop Image here" : "Upload source image"}
          </p>
          <p className="text-app-text-sub mt-2 text-center">
            Square PNG or SVG works best. Highly recommended min 512x512.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-app-panel border border-app-border rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-app-primary" />
                  Source Image
                </h3>
                <button
                  onClick={() => {
                    setImage(null);
                    setGenerated(false);
                  }}
                  className="p-2 hover:bg-app-bg rounded-lg text-app-text-passive hover:text-red-400 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex justify-center">
                <img
                  src={image}
                  className="max-h-64 rounded-xl shadow-lg border border-app-border"
                  alt="Source"
                />
              </div>
            </div>

            <div className="p-6 bg-app-bg/50 border border-app-border rounded-2xl space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-app-text-sub text-center">
                Pro Tips
              </h3>
              <ul className="text-xs text-app-text-passive space-y-2 list-disc pl-4">
                <li>Use a 1:1 aspect ratio for best results.</li>
                <li>
                  High resolution (512x512+) ensures sharpness across all sizes.
                </li>
                <li>Transparent PNGs are ideal for favicons.</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-app-text-sub px-2">
              Generated Versions
            </h3>
            <div className="space-y-3">
              {SIZES.map((s) => (
                <div
                  key={s.name}
                  className="bg-app-panel border border-app-border rounded-2xl p-4 flex items-center justify-between group hover:border-app-primary/30 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-app-bg rounded-lg border border-app-border flex items-center justify-center font-mono text-[10px] font-bold text-app-text-passive w-20">
                      {s.size}x{s.size}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-app-text">
                        {s.name}
                      </span>
                      <span className="text-[10px] text-app-text-passive">
                        Standard Web Favicon
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(s.size, s.name)}
                    className="p-3 bg-app-bg border border-app-border rounded-xl hover:bg-app-primary hover:text-white transition-all shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}
