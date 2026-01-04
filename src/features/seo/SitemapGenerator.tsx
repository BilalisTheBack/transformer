import { useState } from "react";
import { GitMerge, Copy, Check, Download, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface UrlEntry {
  id: string;
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

export default function SitemapGenerator() {
  const { t } = useTranslation();
  const [urls, setUrls] = useState<UrlEntry[]>([
    {
      id: crypto.randomUUID(),
      loc: "https://example.com/",
      lastmod: new Date().toISOString().split("T")[0],
      changefreq: "daily",
      priority: "1.0",
    },
    {
      id: crypto.randomUUID(),
      loc: "https://example.com/about",
      lastmod: new Date().toISOString().split("T")[0],
      changefreq: "monthly",
      priority: "0.8",
    },
  ]);
  const [copied, setCopied] = useState(false);

  const generateContent = () => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    urls.forEach((url) => {
      xml += `\n  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`;
    });

    xml += `\n</urlset>`;
    return xml;
  };

  const copyContent = () => {
    navigator.clipboard.writeText(generateContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const blob = new Blob([generateContent()], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sitemap.xml";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const addUrl = () => {
    setUrls([
      ...urls,
      {
        id: crypto.randomUUID(),
        loc: "https://example.com/page",
        lastmod: new Date().toISOString().split("T")[0],
        changefreq: "weekly",
        priority: "0.5",
      },
    ]);
  };

  const removeUrl = (id: string) => {
    setUrls(urls.filter((u) => u.id !== id));
  };

  const updateUrl = (id: string, field: keyof UrlEntry, value: string) => {
    setUrls(urls.map((u) => (u.id === id ? { ...u, [field]: value } : u)));
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6 animate-in fade-in duration-500 pb-24">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
            <GitMerge className="w-6 h-6 text-white" />
          </div>
          {t("seo.sitemap.title")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("seo.sitemap.description")}
        </p>
      </header>

      <div className="flex flex-col gap-6 min-h-0 flex-1">
        {/* URL List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {t("seo.sitemap.pages")} ({urls.length})
            </h3>
            <button
              onClick={addUrl}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
            >
              <Plus className="w-3 h-3" /> {t("seo.sitemap.addUrl")}
            </button>
          </div>

          <div className="overflow-y-auto flex-1 px-2 space-y-3 pb-4">
            {urls.map((url) => (
              <div
                key={url.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800"
              >
                <div className="md:col-span-5">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    {t("seo.sitemap.loc")}
                  </label>
                  <input
                    type="text"
                    value={url.loc}
                    onChange={(e) => updateUrl(url.id, "loc", e.target.value)}
                    className="w-full px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    {t("seo.sitemap.lastmod")}
                  </label>
                  <input
                    type="date"
                    value={url.lastmod}
                    onChange={(e) =>
                      updateUrl(url.id, "lastmod", e.target.value)
                    }
                    className="w-full px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    {t("seo.sitemap.freq")}
                  </label>
                  <select
                    value={url.changefreq}
                    onChange={(e) =>
                      updateUrl(url.id, "changefreq", e.target.value)
                    }
                    className="w-full px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                  >
                    <option value="always">Always</option>
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="never">Never</option>
                  </select>
                </div>
                <div className="md:col-span-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    {t("seo.sitemap.priority")}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={url.priority}
                    onChange={(e) =>
                      updateUrl(url.id, "priority", e.target.value)
                    }
                    className="w-full px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="md:col-span-1 flex items-end justify-center">
                  <button
                    onClick={() => removeUrl(url.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-white dark:hover:bg-gray-800 rounded transition-colors"
                    disabled={urls.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* XML Output */}
        <div className="h-64 bg-gray-900 rounded-xl p-4 flex flex-col shadow-lg relative shrink-0">
          <div className="flex justify-between items-center mb-2 absolute top-4 right-4 gap-2 z-10">
            <button
              onClick={copyContent}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-400 bg-indigo-900/30 hover:bg-indigo-900/50 rounded-lg transition-colors border border-indigo-900/50"
            >
              {copied ? (
                <Check className="w-3 h-3" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
              {t("seo.metaTagGenerator.copy")}
            </button>
            <button
              onClick={downloadFile}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
            >
              <Download className="w-3 h-3" />
              Download
            </button>
          </div>
          <h3 className="text-gray-400 text-xs font-medium mb-2 uppercase tracking-wider">
            {t("seo.sitemap.generated")}
          </h3>
          <pre className="flex-1 overflow-auto font-mono text-sm text-indigo-100 whitespace-pre-wrap">
            {generateContent()}
          </pre>
        </div>
      </div>
    </div>
  );
}
