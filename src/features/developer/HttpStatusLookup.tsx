import { useState } from "react";
import {
  Search,
  Info,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Shield,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface StatusCode {
  code: number;
  name: string;
  description: string;
  category: string;
}

export default function HttpStatusLookup() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const STATUS_CODES: StatusCode[] = [
    // 1xx Informational
    {
      code: 100,
      name: t("dev.http.codes.100.name"),
      description: t("dev.http.codes.100.description"),
      category: t("dev.http.categories.info"),
    },
    {
      code: 101,
      name: t("dev.http.codes.101.name"),
      description: t("dev.http.codes.101.description"),
      category: t("dev.http.categories.info"),
    },
    {
      code: 102,
      name: t("dev.http.codes.102.name"),
      description: t("dev.http.codes.102.description"),
      category: t("dev.http.categories.info"),
    },

    // 2xx Success
    {
      code: 200,
      name: t("dev.http.codes.200.name"),
      description: t("dev.http.codes.200.description"),
      category: t("dev.http.categories.success"),
    },
    {
      code: 201,
      name: t("dev.http.codes.201.name"),
      description: t("dev.http.codes.201.description"),
      category: t("dev.http.categories.success"),
    },
    {
      code: 202,
      name: t("dev.http.codes.202.name"),
      description: t("dev.http.codes.202.description"),
      category: t("dev.http.categories.success"),
    },
    {
      code: 204,
      name: t("dev.http.codes.204.name"),
      description: t("dev.http.codes.204.description"),
      category: t("dev.http.categories.success"),
    },
    {
      code: 206,
      name: t("dev.http.codes.206.name"),
      description: t("dev.http.codes.206.description"),
      category: t("dev.http.categories.success"),
    },

    // 3xx Redirection
    {
      code: 300,
      name: t("dev.http.codes.300.name"),
      description: t("dev.http.codes.300.description"),
      category: t("dev.http.categories.redirect"),
    },
    {
      code: 301,
      name: t("dev.http.codes.301.name"),
      description: t("dev.http.codes.301.description"),
      category: t("dev.http.categories.redirect"),
    },
    {
      code: 302,
      name: t("dev.http.codes.302.name"),
      description: t("dev.http.codes.302.description"),
      category: t("dev.http.categories.redirect"),
    },
    {
      code: 304,
      name: t("dev.http.codes.304.name"),
      description: t("dev.http.codes.304.description"),
      category: t("dev.http.categories.redirect"),
    },
    {
      code: 307,
      name: t("dev.http.codes.307.name"),
      description: t("dev.http.codes.307.description"),
      category: t("dev.http.categories.redirect"),
    },
    {
      code: 308,
      name: t("dev.http.codes.308.name"),
      description: t("dev.http.codes.308.description"),
      category: t("dev.http.categories.redirect"),
    },

    // 4xx Client Errors
    {
      code: 400,
      name: t("dev.http.codes.400.name"),
      description: t("dev.http.codes.400.description"),
      category: t("dev.http.categories.clientErr"),
    },
    {
      code: 401,
      name: t("dev.http.codes.401.name"),
      description: t("dev.http.codes.401.description"),
      category: t("dev.http.categories.clientErr"),
    },
    {
      code: 403,
      name: t("dev.http.codes.403.name"),
      description: t("dev.http.codes.403.description"),
      category: t("dev.http.categories.clientErr"),
    },
    {
      code: 404,
      name: t("dev.http.codes.404.name"),
      description: t("dev.http.codes.404.description"),
      category: t("dev.http.categories.clientErr"),
    },
    {
      code: 405,
      name: t("dev.http.codes.405.name"),
      description: t("dev.http.codes.405.description"),
      category: t("dev.http.categories.clientErr"),
    },
    {
      code: 408,
      name: t("dev.http.codes.408.name"),
      description: t("dev.http.codes.408.description"),
      category: t("dev.http.categories.clientErr"),
    },
    {
      code: 409,
      name: t("dev.http.codes.409.name"),
      description: t("dev.http.codes.409.description"),
      category: t("dev.http.categories.clientErr"),
    },
    {
      code: 410,
      name: t("dev.http.codes.410.name"),
      description: t("dev.http.codes.410.description"),
      category: t("dev.http.categories.clientErr"),
    },
    {
      code: 413,
      name: t("dev.http.codes.413.name"),
      description: t("dev.http.codes.413.description"),
      category: t("dev.http.categories.clientErr"),
    },
    {
      code: 414,
      name: t("dev.http.codes.414.name"),
      description: t("dev.http.codes.414.description"),
      category: t("dev.http.categories.clientErr"),
    },
    {
      code: 415,
      name: t("dev.http.codes.415.name"),
      description: t("dev.http.codes.415.description"),
      category: t("dev.http.categories.clientErr"),
    },
    {
      code: 418,
      name: t("dev.http.codes.418.name"),
      description: t("dev.http.codes.418.description"),
      category: t("dev.http.categories.clientErr"),
    },
    {
      code: 422,
      name: t("dev.http.codes.422.name"),
      description: t("dev.http.codes.422.description"),
      category: t("dev.http.categories.clientErr"),
    },
    {
      code: 429,
      name: t("dev.http.codes.429.name"),
      description: t("dev.http.codes.429.description"),
      category: t("dev.http.categories.clientErr"),
    },

    // 5xx Server Errors
    {
      code: 500,
      name: t("dev.http.codes.500.name"),
      description: t("dev.http.codes.500.description"),
      category: t("dev.http.categories.serverErr"),
    },
    {
      code: 501,
      name: t("dev.http.codes.501.name"),
      description: t("dev.http.codes.501.description"),
      category: t("dev.http.categories.serverErr"),
    },
    {
      code: 502,
      name: t("dev.http.codes.502.name"),
      description: t("dev.http.codes.502.description"),
      category: t("dev.http.categories.serverErr"),
    },
    {
      code: 503,
      name: t("dev.http.codes.503.name"),
      description: t("dev.http.codes.503.description"),
      category: t("dev.http.categories.serverErr"),
    },
    {
      code: 504,
      name: t("dev.http.codes.504.name"),
      description: t("dev.http.codes.504.description"),
      category: t("dev.http.categories.serverErr"),
    },
    {
      code: 505,
      name: t("dev.http.codes.505.name"),
      description: t("dev.http.codes.505.description"),
      category: t("dev.http.categories.serverErr"),
    },
  ];

  const categories = [
    "All",
    t("dev.http.categories.info"),
    t("dev.http.categories.success"),
    t("dev.http.categories.redirect"),
    t("dev.http.categories.clientErr"),
    t("dev.http.categories.serverErr"),
  ];

  const filteredCodes = STATUS_CODES.filter((status) => {
    const matchesSearch =
      status.code.toString().includes(search) ||
      status.name.toLowerCase().includes(search.toLowerCase()) ||
      status.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || status.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    if (category === t("dev.http.categories.info"))
      return <Info className="w-4 h-4" />;
    if (category === t("dev.http.categories.success"))
      return <CheckCircle className="w-4 h-4" />;
    if (category === t("dev.http.categories.redirect"))
      return <RefreshCw className="w-4 h-4" />;
    if (category === t("dev.http.categories.clientErr"))
      return <AlertTriangle className="w-4 h-4" />;
    if (category === t("dev.http.categories.serverErr"))
      return <XCircle className="w-4 h-4" />;
    return <Shield className="w-4 h-4" />;
  };

  const getCategoryColor = (category: string) => {
    if (category === t("dev.http.categories.info"))
      return "from-blue-500 to-cyan-600";
    if (category === t("dev.http.categories.success"))
      return "from-green-500 to-emerald-600";
    if (category === t("dev.http.categories.redirect"))
      return "from-yellow-500 to-amber-600";
    if (category === t("dev.http.categories.clientErr"))
      return "from-orange-500 to-red-600";
    if (category === t("dev.http.categories.serverErr"))
      return "from-red-600 to-pink-700";
    return "from-gray-500 to-gray-600";
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6 animate-in fade-in duration-500 pb-24">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
            <Info className="w-6 h-6 text-white" />
          </div>
          {t("dev.http.title")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("dev.http.description")}
        </p>
      </header>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("dev.http.searchPlaceholder")}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {filteredCodes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Search className="w-16 h-16 mb-4 opacity-20" />
            <p>{t("dev.http.noResults")}</p>
          </div>
        ) : (
          filteredCodes.map((status) => (
            <div
              key={status.code}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex-shrink-0 w-20 h-20 rounded-xl bg-gradient-to-br ${getCategoryColor(
                    status.category
                  )} flex items-center justify-center text-white font-bold text-2xl shadow-lg`}
                >
                  {status.code}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {status.name}
                    </h3>
                    <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-medium text-gray-600 dark:text-gray-400">
                      {getCategoryIcon(status.category)}
                      {status.category}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {status.description}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
