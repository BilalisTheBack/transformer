import { useState } from "react";
import {
  Upload,
  Download,
  RefreshCw,
  X,
  Image as ImageIcon,
} from "lucide-react";

export default function ImageConverter() {
  const [files, setFiles] = useState<File[]>([]);
  const [converting, setConverting] = useState(false);
  const [convertedImages, setConvertedImages] = useState<
    { name: string; url: string }[]
  >([]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const convertImages = async () => {
    setConverting(true);
    setConvertedImages([]);

    // Simulate conversion for now (Real implementation needs Canvas/Polymorphism)
    const newImages = await Promise.all(
      files.map(async (file) => {
        return new Promise<{ name: string; url: string }>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement("canvas");
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext("2d");
              ctx?.drawImage(img, 0, 0);
              // Convert to WebP
              const webpUrl = canvas.toDataURL("image/webp", 0.8);
              resolve({
                name: file.name.replace(/\.[^/.]+$/, "") + ".webp",
                url: webpUrl,
              });
            };
            img.src = e.target?.result as string;
          };
          reader.readAsDataURL(file);
        });
      })
    );

    setConvertedImages(newImages);
    setConverting(false);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
            <ImageIcon className="w-6 h-6 text-white" />
          </div>
          Image Converter
        </h1>
        <p className="text-neutral-400">
          Convert JPG/PNG images to modern WebP format offline.
        </p>
      </header>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
        {/* Upload Section */}
        <div className="flex flex-col gap-4 bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
          <h2 className="font-semibold text-neutral-300">Input Files</h2>

          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-neutral-700 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-blue-500 hover:bg-neutral-800/50 transition-colors cursor-pointer"
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <Upload className="w-10 h-10 text-neutral-500 mb-4" />
            <p className="text-neutral-300 font-medium">
              Click or Drag images here
            </p>
            <p className="text-sm text-neutral-500 mt-2">Supports JPG, PNG</p>
            <input
              type="file"
              id="file-input"
              className="hidden"
              multiple
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleFileSelect}
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {files.map((file, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg group"
              >
                <span className="text-sm truncate max-w-[200px]">
                  {file.name}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-neutral-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(i);
                    }}
                    className="text-neutral-500 hover:text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {files.length > 0 && (
            <button
              onClick={convertImages}
              disabled={converting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              {converting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Converting...
                </>
              ) : (
                <>Convert to WebP</>
              )}
            </button>
          )}
        </div>

        {/* Output Section */}
        <div className="flex flex-col gap-4 bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
          <h2 className="font-semibold text-neutral-300">Converted Files</h2>

          {convertedImages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-neutral-600">
              <p>No converted images yet</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {convertedImages.map((img, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img
                      src={img.url}
                      alt=""
                      className="w-10 h-10 object-cover rounded bg-neutral-950"
                    />
                    <span className="text-sm truncate">{img.name}</span>
                  </div>
                  <a
                    href={img.url}
                    download={img.name}
                    className="p-2 hover:bg-green-500/20 rounded text-green-500 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
