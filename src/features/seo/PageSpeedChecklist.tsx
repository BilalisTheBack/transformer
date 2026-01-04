import { useState, useEffect } from "react";
import {
  Gauge,
  CheckCircle2,
  Circle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface ChecklistItem {
  id: string;
  category: "Performance" | "UX" | "SEO" | "Accessibility";
  titleKey: string;
  descKey: string;
  checked: boolean;
}

const INITIAL_ITEMS_KEYS: ChecklistItem[] = [
  // Performance
  {
    id: "img-opt",
    category: "Performance",
    titleKey: "imgOpt",
    descKey: "imgOptDesc",
    checked: false,
  },
  {
    id: "minify",
    category: "Performance",
    titleKey: "minify",
    descKey: "minifyDesc",
    checked: false,
  },
  {
    id: "caching",
    category: "Performance",
    titleKey: "caching",
    descKey: "cachingDesc",
    checked: false,
  },
  {
    id: "cdn",
    category: "Performance",
    titleKey: "cdn",
    descKey: "cdnDesc",
    checked: false,
  },

  // UX
  {
    id: "cls",
    category: "UX",
    titleKey: "cls",
    descKey: "clsDesc",
    checked: false,
  },
  {
    id: "lcp",
    category: "UX",
    titleKey: "lcp",
    descKey: "lcpDesc",
    checked: false,
  },
  {
    id: "mobile",
    category: "UX",
    titleKey: "mobile",
    descKey: "mobileDesc",
    checked: false,
  },

  // SEO
  {
    id: "meta",
    category: "SEO",
    titleKey: "meta",
    descKey: "metaDesc",
    checked: false,
  },
  {
    id: "sitemap",
    category: "SEO",
    titleKey: "sitemap",
    descKey: "sitemapDesc",
    checked: false,
  },
  {
    id: "https",
    category: "SEO",
    titleKey: "https",
    descKey: "httpsDesc",
    checked: false,
  },

  // Accessibility
  {
    id: "alt",
    category: "Accessibility",
    titleKey: "alt",
    descKey: "altDesc",
    checked: false,
  },
  {
    id: "contrast",
    category: "Accessibility",
    titleKey: "contrast",
    descKey: "contrastDesc",
    checked: false,
  },
];

export default function PageSpeedChecklist() {
  const { t } = useTranslation();
  const [items, setItems] = useState<ChecklistItem[]>(() => {
    const saved = localStorage.getItem("pagespeed-checklist-v2");
    if (saved) {
      const savedIds = JSON.parse(saved) as string[];
      return INITIAL_ITEMS_KEYS.map((item) => ({
        ...item,
        checked: savedIds.includes(item.id),
      }));
    }
    return INITIAL_ITEMS_KEYS;
  });

  const [expandedCategory, setExpandedCategory] = useState<string | null>(
    "Performance"
  );

  useEffect(() => {
    const checkedIds = items.filter((i) => i.checked).map((i) => i.id);
    localStorage.setItem("pagespeed-checklist-v2", JSON.stringify(checkedIds));
  }, [items]);

  const toggleCheck = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const reset = () => {
    if (confirm(t("seo.pagespeed.resetConfirm"))) {
      setItems(INITIAL_ITEMS_KEYS);
    }
  };

  const progress = Math.round(
    (items.filter((i) => i.checked).length / items.length) * 100
  );

  const categories = ["Performance", "UX", "SEO", "Accessibility"];

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6 animate-in fade-in duration-500 pb-24">
      <header className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
              <div className="p-2 bg-green-600 rounded-lg shadow-lg shadow-green-500/20">
                <Gauge className="w-6 h-6 text-white" />
              </div>
              {t("seo.pagespeed.title")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {t("seo.pagespeed.description")}
            </p>
          </div>
          <button
            onClick={reset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> {t("seo.pagespeed.reset")}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex justify-between text-sm font-medium mb-2">
            <span className="text-gray-700 dark:text-gray-300">
              {t("seo.pagespeed.score")}
            </span>
            <span className="text-green-600 dark:text-green-400">
              {progress}%
            </span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-green-500 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {categories.map((cat) => {
          const catItems = items.filter((i) => i.category === cat);
          const isExpanded = expandedCategory === cat;
          const completedCount = catItems.filter((i) => i.checked).length;

          const catLabel = t(
            `seo.pagespeed.categories.${cat.toLowerCase()}` as any
          );

          return (
            <div
              key={cat}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setExpandedCategory(isExpanded ? null : cat)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                    {catLabel}
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                    {completedCount} / {catItems.length}
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {isExpanded && (
                <div className="p-4 pt-0 space-y-3">
                  {catItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleCheck(item.id)}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        item.checked
                          ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/30"
                          : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800"
                      }`}
                    >
                      <div
                        className={`mt-0.5 shrink-0 ${
                          item.checked
                            ? "text-green-500"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      >
                        {item.checked ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <h4
                          className={`font-medium ${
                            item.checked
                              ? "text-green-900 dark:text-green-100 line-through decoration-green-500/50"
                              : "text-gray-900 dark:text-gray-100"
                          }`}
                        >
                          {t(`seo.pagespeed.items.${item.titleKey}` as any)}
                        </h4>
                        <p
                          className={`text-sm mt-0.5 ${
                            item.checked
                              ? "text-green-700 dark:text-green-300"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {t(`seo.pagespeed.items.${item.descKey}` as any)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
