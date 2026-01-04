import { useState } from "react";
import { FileText, Copy, Check, Download, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Rule {
  id: string;
  userAgent: string;
  allow: string[];
  disallow: string[];
}

export default function RobotsTxtGenerator() {
  const { t } = useTranslation();
  const [rules, setRules] = useState<Rule[]>([
    {
      id: crypto.randomUUID(),
      userAgent: "*",
      allow: [],
      disallow: ["/admin/"],
    },
  ]);
  const [sitemap, setSitemap] = useState("");
  const [copied, setCopied] = useState(false);

  const generateContent = () => {
    let content = "";
    rules.forEach((rule, index) => {
      content += `User-agent: ${rule.userAgent}\n`;
      rule.allow.forEach((path) => (content += `Allow: ${path}\n`));
      rule.disallow.forEach((path) => (content += `Disallow: ${path}\n`));
      if (index < rules.length - 1) content += "\n";
    });

    if (sitemap) {
      content += `\nSitemap: ${sitemap}`;
    }
    return content;
  };

  const copyContent = () => {
    navigator.clipboard.writeText(generateContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const blob = new Blob([generateContent()], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "robots.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const addRule = () => {
    setRules([
      ...rules,
      { id: crypto.randomUUID(), userAgent: "*", allow: [], disallow: [] },
    ]);
  };

  const removeRule = (id: string) => {
    setRules(rules.filter((r) => r.id !== id));
  };

  const updateRule = (id: string, field: keyof Rule, value: string) => {
    setRules(rules.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const addPath = (id: string, type: "allow" | "disallow") => {
    setRules(
      rules.map((r) => {
        if (r.id === id) {
          return { ...r, [type]: [...r[type], "/"] };
        }
        return r;
      })
    );
  };

  const updatePath = (
    id: string,
    type: "allow" | "disallow",
    index: number,
    value: string
  ) => {
    setRules(
      rules.map((r) => {
        if (r.id === id) {
          const newPaths = [...r[type]];
          newPaths[index] = value;
          return { ...r, [type]: newPaths };
        }
        return r;
      })
    );
  };

  const removePath = (
    id: string,
    type: "allow" | "disallow",
    index: number
  ) => {
    setRules(
      rules.map((r) => {
        if (r.id === id) {
          const newPaths = [...r[type]];
          newPaths.splice(index, 1);
          return { ...r, [type]: newPaths };
        }
        return r;
      })
    );
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6 animate-in fade-in duration-500 pb-24">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <div className="p-2 bg-orange-600 rounded-lg shadow-lg shadow-orange-500/20">
            <FileText className="w-6 h-6 text-white" />
          </div>
          {t("seo.robots.title")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("seo.robots.description")}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden min-h-0 flex-1">
        {/* Left: Configuration */}
        <div className="overflow-y-auto pr-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("seo.robots.sitemapUrl")}
              </label>
              <input
                type="url"
                value={sitemap}
                onChange={(e) => setSitemap(e.target.value)}
                placeholder="https://example.com/sitemap.xml"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
          </div>

          {rules.map((rule, idx) => (
            <div
              key={rule.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4 relative"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {t("seo.robots.ruleGroup")} #{idx + 1}
                </h3>
                {rules.length > 1 && (
                  <button
                    onClick={() => removeRule(rule.id)}
                    className="text-red-500 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("seo.robots.userAgent")}
                </label>
                <div className="flex gap-2">
                  <select
                    value={
                      rule.userAgent === "*" ||
                      rule.userAgent === "Googlebot" ||
                      rule.userAgent === "Bingbot"
                        ? rule.userAgent
                        : "custom"
                    }
                    onChange={(e) =>
                      e.target.value !== "custom" &&
                      updateRule(rule.id, "userAgent", e.target.value)
                    }
                    className="w-1/3 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-orange-500 outline-none"
                  >
                    <option value="*">All (*)</option>
                    <option value="Googlebot">Googlebot</option>
                    <option value="Bingbot">Bingbot</option>
                    <option value="custom">Custom</option>
                  </select>
                  <input
                    type="text"
                    value={rule.userAgent}
                    onChange={(e) =>
                      updateRule(rule.id, "userAgent", e.target.value)
                    }
                    placeholder="User-agent string"
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {/* Disallow */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("seo.robots.disallow")}
                    </label>
                    <button
                      onClick={() => addPath(rule.id, "disallow")}
                      className="text-xs flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium"
                    >
                      <Plus className="w-3 h-3" /> {t("seo.robots.addPath")}
                    </button>
                  </div>
                  <div className="space-y-2">
                    {rule.disallow.map((path, pIdx) => (
                      <div key={pIdx} className="flex gap-2">
                        <input
                          type="text"
                          value={path}
                          onChange={(e) =>
                            updatePath(
                              rule.id,
                              "disallow",
                              pIdx,
                              e.target.value
                            )
                          }
                          className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                        />
                        <button
                          onClick={() => removePath(rule.id, "disallow", pIdx)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {rule.disallow.length === 0 && (
                      <p className="text-xs text-gray-500 italic">
                        No disallowed paths
                      </p>
                    )}
                  </div>
                </div>

                {/* Allow */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("seo.robots.allow")}
                    </label>
                    <button
                      onClick={() => addPath(rule.id, "allow")}
                      className="text-xs flex items-center gap-1 text-green-600 hover:text-green-700 font-medium"
                    >
                      <Plus className="w-3 h-3" /> {t("seo.robots.addPath")}
                    </button>
                  </div>
                  <div className="space-y-2">
                    {rule.allow.map((path, pIdx) => (
                      <div key={pIdx} className="flex gap-2">
                        <input
                          type="text"
                          value={path}
                          onChange={(e) =>
                            updatePath(rule.id, "allow", pIdx, e.target.value)
                          }
                          className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-green-500 outline-none text-sm"
                        />
                        <button
                          onClick={() => removePath(rule.id, "allow", pIdx)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {rule.allow.length === 0 && (
                      <p className="text-xs text-gray-500 italic">
                        No explicitly allowed paths
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addRule}
            className="w-full py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> {t("seo.robots.addRule")}
          </button>
        </div>

        {/* Right: Output */}
        <div className="flex flex-col gap-4 min-h-0">
          <div className="bg-gray-900 rounded-xl p-4 flex-1 flex flex-col min-h-0 shadow-lg relative">
            <div className="flex justify-between items-center mb-2 absolute top-4 right-4 gap-2">
              <button
                onClick={copyContent}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-orange-400 bg-orange-900/30 hover:bg-orange-900/50 rounded-lg transition-colors border border-orange-900/50"
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
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors shadow-lg shadow-orange-500/20"
              >
                <Download className="w-3 h-3" />
                Download
              </button>
            </div>
            <pre className="flex-1 overflow-auto font-mono text-sm text-gray-300 pt-10 p-4 whitespace-pre-wrap">
              {generateContent()}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
