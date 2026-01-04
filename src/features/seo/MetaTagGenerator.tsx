import { useState } from "react";
import { Globe, Copy, Check, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function MetaTagGenerator() {
  const { t } = useTranslation();
  const [basic, setBasic] = useState({
    title: "",
    description: "",
    keywords: "",
    author: "",
    viewport: "width=device-width, initial-scale=1.0",
    charset: "UTF-8",
  });

  const [og, setOg] = useState({
    title: "",
    description: "",
    image: "",
    url: "",
    siteName: "",
    type: "website",
  });

  const [twitter, setTwitter] = useState({
    card: "summary_large_image",
    site: "",
    creator: "",
  });

  const [copied, setCopied] = useState(false);

  const generateHTML = () => {
    let html = `<!-- Basic Meta Tags -->
<meta charset="${basic.charset}">
<meta name="viewport" content="${basic.viewport}">`;

    if (basic.title)
      html += `\n<title>${basic.title}</title>\n<meta name="title" content="${basic.title}">`;
    if (basic.description)
      html += `\n<meta name="description" content="${basic.description}">`;
    if (basic.keywords)
      html += `\n<meta name="keywords" content="${basic.keywords}">`;
    if (basic.author)
      html += `\n<meta name="author" content="${basic.author}">`;

    html += `\n\n<!-- Open Graph / Facebook -->
<meta property="og:type" content="${og.type}">`;
    if (og.url) html += `\n<meta property="og:url" content="${og.url}">`;
    if (og.title || basic.title)
      html += `\n<meta property="og:title" content="${
        og.title || basic.title
      }">`;
    if (og.description || basic.description)
      html += `\n<meta property="og:description" content="${
        og.description || basic.description
      }">`;
    if (og.image) html += `\n<meta property="og:image" content="${og.image}">`;
    if (og.siteName)
      html += `\n<meta property="og:site_name" content="${og.siteName}">`;

    html += `\n\n<!-- Twitter -->
<meta property="twitter:card" content="${twitter.card}">`;
    if (og.url) html += `\n<meta property="twitter:url" content="${og.url}">`;
    if (og.title || basic.title)
      html += `\n<meta property="twitter:title" content="${
        og.title || basic.title
      }">`;
    if (og.description || basic.description)
      html += `\n<meta property="twitter:description" content="${
        og.description || basic.description
      }">`;
    if (og.image)
      html += `\n<meta property="twitter:image" content="${og.image}">`;
    if (twitter.site)
      html += `\n<meta property="twitter:site" content="${twitter.site}">`;
    if (twitter.creator)
      html += `\n<meta property="twitter:creator" content="${twitter.creator}">`;

    return html;
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generateHTML());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fillExample = () => {
    setBasic({
      title: "My Awesome Website",
      description: "The best website for developer tools and utilities.",
      keywords: "tools, dev, generator, converter",
      author: "John Doe",
      viewport: "width=device-width, initial-scale=1.0",
      charset: "UTF-8",
    });
    setOg({
      title: "My Awesome Website",
      description: "The best website for developer tools and utilities.",
      image: "https://example.com/og-image.jpg",
      url: "https://example.com",
      siteName: "DevTools",
      type: "website",
    });
    setTwitter({
      card: "summary_large_image",
      site: "@devtools",
      creator: "@johndoe",
    });
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6 animate-in fade-in duration-500 pb-24">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
            <Globe className="w-6 h-6 text-white" />
          </div>
          {t("seo.metaTagGenerator.title")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("seo.metaTagGenerator.description")}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden min-h-0 flex-1">
        {/* Left Column: Inputs */}
        <div className="overflow-y-auto pr-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                {t("seo.metaTagGenerator.basicInfo")}
              </h3>
              <button
                onClick={fillExample}
                className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700"
              >
                <RefreshCw className="w-3 h-3" />{" "}
                {t("seo.metaTagGenerator.loadExample")}
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("seo.metaTagGenerator.pageTitle")}
                </label>
                <input
                  type="text"
                  maxLength={60}
                  value={basic.title}
                  onChange={(e) =>
                    setBasic({ ...basic, title: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <p className="text-xs text-gray-500 text-right mt-1">
                  {basic.title.length}/60
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("seo.metaTagGenerator.pageDesc")}
                </label>
                <textarea
                  rows={3}
                  maxLength={160}
                  value={basic.description}
                  onChange={(e) =>
                    setBasic({ ...basic, description: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
                <p className="text-xs text-gray-500 text-right mt-1">
                  {basic.description.length}/160
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("seo.metaTagGenerator.keywords")}
                </label>
                <input
                  type="text"
                  value={basic.keywords}
                  onChange={(e) =>
                    setBasic({ ...basic, keywords: e.target.value })
                  }
                  placeholder="comma, separated, keywords"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("seo.metaTagGenerator.author")}
                  </label>
                  <input
                    type="text"
                    value={basic.author}
                    onChange={(e) =>
                      setBasic({ ...basic, author: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("seo.metaTagGenerator.charset")}
                  </label>
                  <select
                    value={basic.charset}
                    onChange={(e) =>
                      setBasic({ ...basic, charset: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="UTF-8">UTF-8</option>
                    <option value="ISO-8859-1">ISO-8859-1</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
              {t("seo.metaTagGenerator.og")}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("seo.metaTagGenerator.ogImage")}
                </label>
                <input
                  type="url"
                  value={og.image}
                  onChange={(e) => setOg({ ...og, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("seo.metaTagGenerator.canonical")}
                  </label>
                  <input
                    type="url"
                    value={og.url}
                    onChange={(e) => setOg({ ...og, url: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("seo.metaTagGenerator.type")}
                  </label>
                  <select
                    value={og.type}
                    onChange={(e) => setOg({ ...og, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="website">Website</option>
                    <option value="article">Article</option>
                    <option value="profile">Profile</option>
                    <option value="book">Book</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
              {t("seo.metaTagGenerator.twitter")}
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("seo.metaTagGenerator.cardType")}
                  </label>
                  <select
                    value={twitter.card}
                    onChange={(e) =>
                      setTwitter({ ...twitter, card: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="summary">Summary</option>
                    <option value="summary_large_image">
                      Summary Large Image
                    </option>
                    <option value="app">App</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("seo.metaTagGenerator.handle")}
                  </label>
                  <input
                    type="text"
                    value={twitter.site}
                    onChange={(e) =>
                      setTwitter({ ...twitter, site: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Code Preview */}
        <div className="flex flex-col min-h-0">
          <div className="bg-gray-900 rounded-xl p-4 flex-1 flex flex-col min-h-0 shadow-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-gray-300 text-sm font-medium">
                {t("seo.metaTagGenerator.generated")}
              </h3>
              <button
                onClick={copyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-400 bg-blue-900/30 hover:bg-blue-900/50 rounded-lg transition-colors border border-blue-900/50"
              >
                {copied ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                {copied
                  ? t("seo.metaTagGenerator.copied")
                  : t("seo.metaTagGenerator.copy")}
              </button>
            </div>
            <pre className="flex-1 overflow-auto font-mono text-sm text-blue-100 p-2 bg-black/30 rounded-lg whitespace-pre-wrap selection:bg-blue-500/30">
              {generateHTML()}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
