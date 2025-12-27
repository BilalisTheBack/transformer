import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Globe, Share2, Copy, Check, LayoutTemplate } from "lucide-react";

export default function SeoGenerator() {
  const { t } = useTranslation();
  const [values, setValues] = useState({
    title: "",
    description: "",
    url: "https://example.com/page",
    image: "",
  });
  const [copied, setCopied] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const generateCode = () => {
    return `<!-- Standard SEO -->
<title>${values.title}</title>
<meta name="description" content="${values.description}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${values.url}">
<meta property="og:title" content="${values.title}">
<meta property="og:description" content="${values.description}">
${values.image ? `<meta property="og:image" content="${values.image}">` : ""}

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${values.url}">
<meta property="twitter:title" content="${values.title}">
<meta property="twitter:description" content="${values.description}">
${
  values.image
    ? `<meta property="twitter:image" content="${values.image}">`
    : ""
}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Share2 className="w-8 h-8 text-indigo-500" />
          {t("seo.title", "SEO & Open Graph Generator")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t(
            "seo.description",
            "Preview and generate meta tags for social media and search engines."
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Editor */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <LayoutTemplate className="w-5 h-5 text-indigo-500" />
              {t("seo.editor", "Edit Metadata")}
            </h2>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("seo.pageTitle", "Page Title")}
              </label>
              <input
                name="title"
                value={values.title}
                onChange={handleChange}
                maxLength={60}
                placeholder="My Awesome Page"
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{t("seo.recommended", "Recommended")}: 50-60 chars</span>
                <span
                  className={values.title.length > 60 ? "text-red-500" : ""}
                >
                  {values.title.length}/60
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("seo.pageDesc", "Meta Description")}
              </label>
              <textarea
                name="description"
                value={values.description}
                onChange={handleChange}
                maxLength={160}
                rows={3}
                placeholder="A brief summary of your content..."
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none transition resize-none"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>
                  {t("seo.recommended", "Recommended")}: 150-160 chars
                </span>
                <span
                  className={
                    values.description.length > 160 ? "text-red-500" : ""
                  }
                >
                  {values.description.length}/160
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("seo.pageUrl", "Page URL")}
              </label>
              <input
                name="url"
                value={values.url}
                onChange={handleChange}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("seo.imageUrl", "Image URL (OG:Image)")}
              </label>
              <input
                name="image"
                value={values.image}
                onChange={handleChange}
                placeholder="https://example.com/og-image.jpg"
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Copy className="w-5 h-5 text-indigo-500" />
                {t("seo.generatedCode", "Generated HTML")}
              </h2>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-sm transition"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg text-xs font-mono overflow-x-auto whitespace-pre-wrap">
              {generateCode()}
            </pre>
          </div>
        </div>

        {/* Previews */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-indigo-500" />
            {t("seo.previews", "Live Previews")}
          </h2>

          {/* Google */}
          <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
            <h3 className="text-xs text-gray-500 uppercase font-bold mb-2">
              Google Search
            </h3>
            <div className="font-sans">
              <div className="flex items-center gap-2 text-sm text-[#202124] mb-1">
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[10px]">
                  Logo
                </div>
                <div className="flex flex-col">
                  <span className="text-[#202124] text-xs">example.com</span>
                  <span className="text-[#5f6368] text-xs">{values.url}</span>
                </div>
              </div>
              <div className="text-[#1a0dab] text-xl cursor-pointer hover:underline truncate">
                {values.title || "Page Title"}
              </div>
              <div className="text-[#4d5156] text-sm mt-1 line-clamp-2">
                {values.description ||
                  "This is how your page description will appear in Google search results. It should be concise and descriptive."}
              </div>
            </div>
          </div>

          {/* Facebook / OG */}
          <div className="bg-[#f0f2f5] p-4 rounded shadow-sm border border-gray-200">
            <h3 className="text-xs text-gray-500 uppercase font-bold mb-2">
              Facebook / Open Graph
            </h3>
            <div className="bg-white rounded-lg border border-gray-300 overflow-hidden max-w-[500px]">
              {values.image ? (
                <img
                  src={values.image}
                  alt="Preview"
                  className="w-full h-[260px] object-cover bg-gray-100"
                />
              ) : (
                <div className="w-full h-[260px] bg-gray-100 flex items-center justify-center text-gray-400">
                  Og:Image Preview
                </div>
              )}
              <div className="p-3 bg-[#f0f2f5] border-t border-gray-200">
                <div className="text-[#65676b] text-xs uppercase mb-1">
                  EXAMPLE.COM
                </div>
                <div className="text-[#050505] font-bold truncate mb-1">
                  {values.title || "Page Title"}
                </div>
                <div className="text-[#65676b] text-sm line-clamp-1">
                  {values.description || "Link description goes here..."}
                </div>
              </div>
            </div>
          </div>

          {/* Twitter */}
          <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
            <h3 className="text-xs text-gray-500 uppercase font-bold mb-2">
              Twitter (X) Card
            </h3>
            <div className="border border-gray-300 rounded-xl overflow-hidden max-w-[500px]">
              {values.image ? (
                <img
                  src={values.image}
                  alt="Preview"
                  className="w-full h-[260px] object-cover bg-gray-100"
                />
              ) : (
                <div className="w-full h-[260px] bg-gray-100 flex items-center justify-center text-gray-400">
                  Image Preview
                </div>
              )}
              <div className="p-3">
                <div className="text-gray-900 font-bold truncate mb-1">
                  {values.title || "Page Title"}
                </div>
                <div className="text-gray-500 text-sm line-clamp-2">
                  {values.description || "This is how it looks on Twitter..."}
                </div>
                <div className="text-gray-400 text-sm mt-1">example.com</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
