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
      name: "Continue",
      description:
        "The server has received the request headers and the client should proceed to send the request body.",
      category: t("dev.http.categories.info"),
    },
    {
      code: 101,
      name: "Switching Protocols",
      description:
        "The requester has asked the server to switch protocols and the server has agreed to do so.",
      category: t("dev.http.categories.info"),
    },
    {
      code: 102,
      name: "Processing",
      description:
        "The server has received and is processing the request, but no response is available yet.",
      category: t("dev.http.categories.info"),
    },

    // 2xx Success
    {
      code: 200,
      name: "OK",
      description: "Standard response for successful HTTP requests.",
      category: t("dev.http.categories.success"),
    },
    {
      code: 201,
      name: "Created",
      description:
        "The request has been fulfilled, resulting in the creation of a new resource.",
      category: t("dev.http.categories.success"),
    },
    {
      code: 202,
      name: "Accepted",
      description:
        "The request has been accepted for processing, but the processing has not been completed.",
      category: t("dev.http.categories.success"),
    },
    {
      code: 204,
      name: "No Content",
      description:
        "The server successfully processed the request and is not returning any content.",
      category: t("dev.http.categories.success"),
    },
    {
      code: 206,
      name: "Partial Content",
      description:
        "The server is delivering only part of the resource due to a range header sent by the client.",
      category: t("dev.http.categories.success"),
    },

    // 3xx Redirection
    {
      code: 300,
      name: "Multiple Choices",
      description:
        "Indicates multiple options for the resource from which the client may choose.",
      category: t("dev.http.categories.redirect"),
    },
    {
      code: 301,
      name: "Moved Permanently",
      description:
        "This and all future requests should be directed to the given URI.",
      category: t("dev.http.categories.redirect"),
    },
    {
      code: 302,
      name: "Found",
      description: "Tells the client to look at another URL temporarily.",
      category: t("dev.http.categories.redirect"),
    },
    {
      code: 304,
      name: "Not Modified",
      description:
        "Indicates that the resource has not been modified since the version specified by the request headers.",
      category: t("dev.http.categories.redirect"),
    },
    {
      code: 307,
      name: "Temporary Redirect",
      description:
        "The request should be repeated with another URI but future requests should still use the original URI.",
      category: t("dev.http.categories.redirect"),
    },
    {
      code: 308,
      name: "Permanent Redirect",
      description:
        "The request and all future requests should be repeated using another URI.",
      category: t("dev.http.categories.redirect"),
    },

    // 4xx Client Errors
    {
      code: 400,
      name: "Bad Request",
      description:
        "The server cannot or will not process the request due to an apparent client error.",
      category: t("dev.http.categories.clientErr"),
    },
    {
      code: 401,
      name: "Unauthorized",
      description:
        "Authentication is required and has failed or has not yet been provided.",
      category: t("dev.http.categories.clientErr"),
    },
    {
      code: 403,
      name: "Forbidden",
      description:
        "The request was valid, but the server is refusing action. The user might not have the necessary permissions.",
      category: t("dev.http.categories.clientErr"),
    },
    {
      code: 404,
      name: "Not Found",
      description:
        "The requested resource could not be found but may be available in the future.",
      category: t("dev.http.categories.clientErr"),
    },
    {
      code: 405,
      name: "Method Not Allowed",
      description:
        "A request method is not supported for the requested resource.",
      category: t("dev.http.categories.clientErr"),
    },
    {
      code: 408,
      name: "Request Timeout",
      description: "The server timed out waiting for the request.",
      category: t("dev.http.categories.clientErr"),
    },
    {
      code: 409,
      name: "Conflict",
      description:
        "Indicates that the request could not be processed because of conflict in the current state of the resource.",
      category: t("dev.http.categories.clientErr"),
    },
    {
      code: 410,
      name: "Gone",
      description:
        "Indicates that the resource requested is no longer available and will not be available again.",
      category: t("dev.http.categories.clientErr"),
    },
    {
      code: 413,
      name: "Payload Too Large",
      description:
        "The request is larger than the server is willing or able to process.",
      category: t("dev.http.categories.clientErr"),
    },
    {
      code: 414,
      name: "URI Too Long",
      description: "The URI provided was too long for the server to process.",
      category: t("dev.http.categories.clientErr"),
    },
    {
      code: 415,
      name: "Unsupported Media Type",
      description:
        "The request entity has a media type which the server or resource does not support.",
      category: t("dev.http.categories.clientErr"),
    },
    {
      code: 418,
      name: "I'm a teapot",
      description:
        "This code was defined in 1998 as one of the traditional IETF April Fools' jokes.",
      category: t("dev.http.categories.clientErr"),
    },
    {
      code: 422,
      name: "Unprocessable Entity",
      description:
        "The request was well-formed but was unable to be followed due to semantic errors.",
      category: t("dev.http.categories.clientErr"),
    },
    {
      code: 429,
      name: "Too Many Requests",
      description:
        "The user has sent too many requests in a given amount of time.",
      category: t("dev.http.categories.clientErr"),
    },

    // 5xx Server Errors
    {
      code: 500,
      name: "Internal Server Error",
      description:
        "A generic error message when an unexpected condition was encountered.",
      category: t("dev.http.categories.serverErr"),
    },
    {
      code: 501,
      name: "Not Implemented",
      description:
        "The server either does not recognize the request method, or it lacks the ability to fulfill the request.",
      category: t("dev.http.categories.serverErr"),
    },
    {
      code: 502,
      name: "Bad Gateway",
      description:
        "The server was acting as a gateway or proxy and received an invalid response from the upstream server.",
      category: t("dev.http.categories.serverErr"),
    },
    {
      code: 503,
      name: "Service Unavailable",
      description:
        "The server is currently unavailable (overloaded or down for maintenance).",
      category: t("dev.http.categories.serverErr"),
    },
    {
      code: 504,
      name: "Gateway Timeout",
      description:
        "The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.",
      category: t("dev.http.categories.serverErr"),
    },
    {
      code: 505,
      name: "HTTP Version Not Supported",
      description:
        "The server does not support the HTTP protocol version used in the request.",
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
