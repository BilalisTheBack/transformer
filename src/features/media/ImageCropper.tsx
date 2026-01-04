import { useState, useRef } from "react";
import { Upload, Crop as CropIcon, Download } from "lucide-react";
import ReactCrop, {
  type Crop,
  type PixelCrop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useTranslation } from "react-i18next";

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export default function ImageCropper() {
  const { t } = useTranslation();
  const [imgSrc, setImgSrc] = useState("");
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate] = useState(0);
  const [aspect, setAspect] = useState<number | undefined>(undefined);

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(reader.result?.toString() || "")
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  async function getCroppedImg() {
    if (!imgRef.current || !completedCrop) return;

    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const pixelRatio = window.devicePixelRatio;

    canvas.width = Math.floor(completedCrop.width * scaleX * pixelRatio);
    canvas.height = Math.floor(completedCrop.height * scaleY * pixelRatio);

    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = "high";

    const cropX = completedCrop.x * scaleX;
    const cropY = completedCrop.y * scaleY;
    const rotateRads = (rotate * Math.PI) / 180;
    const centerX = image.naturalWidth / 2;
    const centerY = image.naturalHeight / 2;

    ctx.save();
    // Move to correct position
    ctx.translate(-cropX, -cropY);
    ctx.translate(centerX, centerY);
    ctx.rotate(rotateRads);
    ctx.scale(scale, scale);
    ctx.translate(-centerX, -centerY);

    ctx.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight
    );

    ctx.restore();

    if (rotate === 0 && scale === 1) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY
      );
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY
      );
    }

    // Download
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png")
    );
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "cropped.png";
      a.click();
    }
  }

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6 animate-in fade-in duration-500 pb-24">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <div className="p-2 bg-teal-600 rounded-lg shadow-lg shadow-teal-500/20">
            <CropIcon className="w-6 h-6 text-white" />
          </div>
          {t("media.cropper.title")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("media.cropper.description")}
        </p>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              {t("media.cropper.uploadLabel")}
            </label>
            <div
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-teal-500 transition-colors"
              onClick={() => document.getElementById("crop-input")?.click()}
            >
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-xs text-gray-500">
                {t("media.cropper.selectImage")}
              </span>
              <input
                id="crop-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onSelectFile}
              />
            </div>
          </div>

          {imgSrc && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  {t("media.cropper.aspectRatio")}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setAspect(undefined)}
                    className={`px-2 py-1 text-xs rounded border ${
                      !aspect
                        ? "bg-teal-50 dark:bg-teal-900/30 border-teal-500 text-teal-700 dark:text-teal-300"
                        : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    {t("media.cropper.free")}
                  </button>
                  <button
                    onClick={() => setAspect(1)}
                    className={`px-2 py-1 text-xs rounded border ${
                      aspect === 1
                        ? "bg-teal-50 dark:bg-teal-900/30 border-teal-500 text-teal-700 dark:text-teal-300"
                        : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    {t("media.cropper.square")}
                  </button>
                  <button
                    onClick={() => setAspect(16 / 9)}
                    className={`px-2 py-1 text-xs rounded border ${
                      aspect === 16 / 9
                        ? "bg-teal-50 dark:bg-teal-900/30 border-teal-500 text-teal-700 dark:text-teal-300"
                        : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    16:9
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  {t("media.cropper.zoom")}
                </label>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="w-full accent-teal-600"
                />
              </div>

              <button
                onClick={getCroppedImg}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                {t("media.cropper.downloadCrop")}
              </button>
            </div>
          )}
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-2 bg-gray-900 rounded-2xl p-6 shadow-sm flex items-center justify-center overflow-auto min-h-[400px]">
          {imgSrc ? (
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
            >
              <img
                ref={imgRef}
                src={imgSrc}
                alt="Crop"
                onLoad={onImageLoad}
                style={{
                  transform: `scale(${scale}) rotate(${rotate}deg)`,
                  maxHeight: "70vh",
                }}
              />
            </ReactCrop>
          ) : (
            <div className="text-gray-500 flex flex-col items-center">
              <CropIcon className="w-12 h-12 mb-2 opacity-20" />
              <p>{t("media.cropper.dropText")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
