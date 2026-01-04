import { useState } from "react";
import { Search, Monitor, Smartphone } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function SeoSnippetPreview() {
  const { t } = useTranslation();
  const [data, setData] = useState({
    title: "",
    description: "",
    url: "www.example.com",
    date: new Date().toISOString().split("T")[0],
  });
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  const TITLE_LIMIT = 60;
  const DESC_LIMIT = 160;

  // Approximate pixel width calculation (rough estimate for demo)
  const getTitleWidth = (text: string) => text.length * 9;

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6 animate-in fade-in duration-500 pb-24">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <div className="p-2 bg-blue-500 rounded-lg shadow-lg shadow-blue-500/20">
            <Search className="w-6 h-6 text-white" />
          </div>
          {t("seo.snippet.title")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("seo.snippet.description")}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden min-h-0 flex-1">
        {/* Editor */}
        <div className="overflow-y-auto pr-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("seo.snippet.metaTitle")}
              </label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                placeholder="Page Title | Brand Name"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <div className="flex justify-between mt-1 text-xs">
                <span
                  className={`${
                    data.title.length > TITLE_LIMIT
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                >
                  {data.title.length} / {TITLE_LIMIT} characters
                </span>
                <span className="text-gray-400">
                  ~{getTitleWidth(data.title)}px (Max ~580px)
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    data.title.length > TITLE_LIMIT
                      ? "bg-red-500"
                      : "bg-blue-500"
                  }`}
                  style={{
                    width: `${Math.min(
                      100,
                      (data.title.length / TITLE_LIMIT) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("seo.snippet.metaDesc")}
              </label>
              <textarea
                rows={4}
                value={data.description}
                onChange={(e) =>
                  setData({ ...data, description: e.target.value })
                }
                placeholder="A compelling description of your page content to encourage clicks from search results."
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
              <div className="flex justify-between mt-1 text-xs">
                <span
                  className={`${
                    data.description.length > DESC_LIMIT
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                >
                  {data.description.length} / {DESC_LIMIT} characters
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    data.description.length > DESC_LIMIT
                      ? "bg-red-500"
                      : "bg-blue-500"
                  }`}
                  style={{
                    width: `${Math.min(
                      100,
                      (data.description.length / DESC_LIMIT) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("seo.snippet.displayUrl")}
              </label>
              <input
                type="text"
                value={data.url}
                onChange={(e) => setData({ ...data, url: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("seo.snippet.date")}
              </label>
              <input
                type="date"
                value={data.date}
                onChange={(e) => setData({ ...data, date: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="flex flex-col gap-4">
          {/* Device Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg self-start">
            <button
              onClick={() => setDevice("desktop")}
              className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${
                device === "desktop"
                  ? "bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900"
              }`}
            >
              <Monitor className="w-4 h-4" /> {t("seo.snippet.desktop")}
            </button>
            <button
              onClick={() => setDevice("mobile")}
              className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${
                device === "mobile"
                  ? "bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900"
              }`}
            >
              <Smartphone className="w-4 h-4" /> {t("seo.snippet.mobile")}
            </button>
          </div>

          {/* Google Search Result Preview */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm font-arial">
            <h3 className="text-gray-400 text-xs font-medium uppercase mb-4 tracking-wider">
              {t("seo.snippet.preview")} (
              {device === "desktop"
                ? t("seo.snippet.desktop")
                : t("seo.snippet.mobile")}
              )
            </h3>

            <div
              className={`max-w-[600px] ${
                device === "mobile" ? "max-w-[360px]" : ""
              }`}
            >
              {/* URL / Breadcrumb */}
              {device === "desktop" ? (
                <div className="flex items-center gap-1 mb-1 group cursor-pointer">
                  <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-[10px] text-gray-500 border border-gray-200">
                    Icon
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[14px] text-[#202124] leading-tight">
                      {data.url.split("/")[0] || "example.com"}
                    </span>
                    <span className="text-[12px] text-[#5f6368] leading-tight">
                      {data.url}
                    </span>
                  </div>
                  <div className="ml-1 text-[#5f6368] text-[10px]">⋮</div>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                  <span className="text-[12px] text-[#202124] truncate">
                    {data.url.split("/")[0]}
                  </span>
                  <span className="text-[#5f6368]">⋮</span>
                </div>
              )}

              {/* Title */}
              <div className="mb-1">
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-[20px] text-[#1a0dab] hover:underline cursor-pointer leading-[1.3] block truncate"
                >
                  {data.title || "Page Title"}
                </a>
              </div>

              {/* Description */}
              <div className="text-[14px] text-[#4d5156] leading-[1.58]">
                <span className="text-[#5f6368] mr-1">
                  {new Date(data.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  —
                </span>
                {data.description ||
                  "Page description goes here. It provides a brief summary of the page content to help users understand what they will find."}
              </div>

              {/* Sitelinks (Visual filler just for effect) */}
              {device === "desktop" && (
                <div className="mt-4 flex gap-4 text-[#1a0dab] text-[14px]">
                  <span>About Us</span>
                  <span>Contact</span>
                  <span>Pricing</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 text-sm rounded-lg border border-blue-200 dark:border-blue-800/50">
            <p className="font-semibold mb-1">💡 {t("seo.snippet.tipTitle")}</p>
            <p>{t("seo.snippet.tipContent")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
