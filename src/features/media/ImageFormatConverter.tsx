import { useState, type ChangeEvent } from "react";
import { Upload, Image as ImageIcon, Download, X } from "lucide-react";

export default function ImageFormatConverter() {
  const [images, setImages] = useState<
    { id: string; file: File; preview: string }[]
  >([]);
  const [targetFormat, setTargetFormat] = useState<"png" | "jpeg">("png");
  const [quality, setQuality] = useState(0.9);

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: URL.createObjectURL(file),
      }));
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const convertAndDownload = async (img: {
    id: string;
    file: File;
    preview: string;
  }) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const image = new Image();

    image.src = img.preview;

    await new Promise((resolve) => {
      image.onload = resolve;
    });

    canvas.width = image.width;
    canvas.height = image.height;

    // Fill white background for JPEGs (transparency fix)
    if (targetFormat === "jpeg") {
      if (ctx) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }

    if (ctx) ctx.drawImage(image, 0, 0);

    const dataUrl = canvas.toDataURL(`image/${targetFormat}`, quality);
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${img.file.name.split(".")[0]}.${
      targetFormat === "jpeg" ? "jpg" : "png"
    }`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConvertAll = () => {
    images.forEach(convertAndDownload);
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg">
            <ImageIcon className="w-6 h-6 text-white" />
          </div>
          PNG <span className="text-neutral-500 mx-1">↔</span> JPG Converter
        </h1>
        <p className="text-neutral-400">
          Convert images between PNG and JPG formats.
        </p>
      </header>

      <div className="flex-1 flex flex-col gap-6 min-h-0">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4 bg-neutral-900/50 border border-neutral-800 p-4 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-neutral-400">
              Output Format:
            </span>
            <div className="flex bg-neutral-800 rounded-lg p-1">
              <button
                onClick={() => setTargetFormat("png")}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  targetFormat === "png"
                    ? "bg-neutral-700 text-white"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                PNG
              </button>
              <button
                onClick={() => setTargetFormat("jpeg")}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  targetFormat === "jpeg"
                    ? "bg-neutral-700 text-white"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                JPG
              </button>
            </div>
          </div>

          {targetFormat === "jpeg" && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-neutral-400">
                Quality: {Math.round(quality * 100)}%
              </span>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-24 accent-emerald-500"
              />
            </div>
          )}

          <div className="flex-1" />

          <button
            onClick={() => document.getElementById("format-upload")?.click()}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Add Images
          </button>
          <input
            id="format-upload"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />

          {images.length > 0 && (
            <button
              onClick={handleConvertAll}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-lg hover:shadow-emerald-500/20"
            >
              <Download className="w-4 h-4" />
              Convert All ({images.length})
            </button>
          )}
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-1">
          {images.length === 0 ? (
            <div
              className="col-span-full border-2 border-dashed border-neutral-800 rounded-xl flex flex-col items-center justify-center text-neutral-500 gap-4 min-h-[300px] cursor-pointer hover:bg-neutral-900/50 hover:border-emerald-500/50 transition-colors"
              onClick={() => document.getElementById("format-upload")?.click()}
            >
              <ImageIcon className="w-12 h-12 opacity-50" />
              <p>Drop images here or click to upload</p>
            </div>
          ) : (
            images.map((img) => (
              <div
                key={img.id}
                className="group relative aspect-square bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800"
              >
                <img
                  src={img.preview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <span className="text-xs text-neutral-300 font-mono text-center px-2 truncate w-full">
                    {img.file.name}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => convertAndDownload(img)}
                      className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors"
                      title="Convert this one"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeImage(img.id)}
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors"
                      title="Remove"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
