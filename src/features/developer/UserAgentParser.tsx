import { useState } from "react";
import { Smartphone, Monitor, Search, Trash2 } from "lucide-react";
import { UAParser } from "ua-parser-js";
import { useTranslation } from "react-i18next";

export default function UserAgentParser() {
  const { t } = useTranslation();
  const [userAgent, setUserAgent] = useState("");
  const [parsed, setParsed] = useState<any | null>(null);

  const handleParse = () => {
    const parser = new UAParser();
    parser.setUA(userAgent);
    setParsed(parser.getResult());
  };

  const examples = [
    {
      name: t("dev.ua.uaNames.chrome"),
      ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
    {
      name: t("dev.ua.uaNames.safari"),
      ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    },
    {
      name: t("dev.ua.uaNames.firefox"),
      ua: "Mozilla/5.0 (Android 13; Mobile; rv:109.0) Gecko/120.0 Firefox/120.0",
    },
    {
      name: t("dev.ua.uaNames.edge"),
      ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0",
    },
  ];

  const loadExample = (ua: string) => {
    setUserAgent(ua);
  };

  const clear = () => {
    setUserAgent("");
    setParsed(null);
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6 animate-in fade-in duration-500 pb-24">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <div className="p-2 bg-cyan-600 rounded-lg shadow-lg shadow-cyan-500/20">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          {t("dev.ua.title")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("dev.ua.description")}
        </p>
      </header>

      {/* Examples */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          {t("dev.ua.examples")}
        </h3>
        <div className="flex flex-wrap gap-2">
          {examples.map((ex, idx) => (
            <button
              key={idx}
              onClick={() => loadExample(ex.ua)}
              className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-cyan-100 dark:hover:bg-cyan-900/30 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
            >
              {ex.name}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("dev.ua.inputLabel")}
          </label>
          <textarea
            value={userAgent}
            onChange={(e) => setUserAgent(e.target.value)}
            placeholder={t("dev.ua.placeholder")}
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-sm resize-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleParse}
            disabled={!userAgent.trim()}
            className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-medium shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
          >
            <Search className="w-4 h-4" /> {t("dev.ua.parse")}
          </button>
          <button
            onClick={clear}
            className="px-4 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Results */}
      {parsed && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Browser */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Monitor className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {t("dev.ua.browser")}
              </h3>
            </div>
            <dl className="space-y-2">
              <div>
                <dt className="text-xs text-gray-500 dark:text-gray-400">
                  {t("dev.ua.fields.name")}
                </dt>
                <dd className="font-medium text-gray-900 dark:text-gray-100">
                  {parsed.browser.name || t("dev.ua.unknown")}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 dark:text-gray-400">
                  {t("dev.ua.fields.version")}
                </dt>
                <dd className="font-medium text-gray-900 dark:text-gray-100">
                  {parsed.browser.version || t("dev.ua.unknown")}
                </dd>
              </div>
            </dl>
          </div>

          {/* OS */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Monitor className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {t("dev.ua.os")}
              </h3>
            </div>
            <dl className="space-y-2">
              <div>
                <dt className="text-xs text-gray-500 dark:text-gray-400">
                  {t("dev.ua.fields.name")}
                </dt>
                <dd className="font-medium text-gray-900 dark:text-gray-100">
                  {parsed.os.name || t("dev.ua.unknown")}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 dark:text-gray-400">
                  {t("dev.ua.fields.version")}
                </dt>
                <dd className="font-medium text-gray-900 dark:text-gray-100">
                  {parsed.os.version || t("dev.ua.unknown")}
                </dd>
              </div>
            </dl>
          </div>

          {/* Device */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Smartphone className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {t("dev.ua.device")}
              </h3>
            </div>
            <dl className="space-y-2">
              <div>
                <dt className="text-xs text-gray-500 dark:text-gray-400">
                  {t("dev.ua.fields.type")}
                </dt>
                <dd className="font-medium text-gray-900 dark:text-gray-100">
                  {parsed.device.type || "Desktop"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 dark:text-gray-400">
                  {t("dev.ua.fields.vendor")}
                </dt>
                <dd className="font-medium text-gray-900 dark:text-gray-100">
                  {parsed.device.vendor || t("dev.ua.unknown")}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 dark:text-gray-400">
                  {t("dev.ua.fields.model")}
                </dt>
                <dd className="font-medium text-gray-900 dark:text-gray-100">
                  {parsed.device.model || t("dev.ua.unknown")}
                </dd>
              </div>
            </dl>
          </div>

          {/* Engine */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm md:col-span-3">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {t("dev.ua.engine")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <dl className="space-y-2">
                <div>
                  <dt className="text-xs text-gray-500 dark:text-gray-400">
                    {t("dev.ua.fields.engineName")}
                  </dt>
                  <dd className="font-medium text-gray-900 dark:text-gray-100">
                    {parsed.engine.name || t("dev.ua.unknown")}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500 dark:text-gray-400">
                    {t("dev.ua.fields.engineVersion")}
                  </dt>
                  <dd className="font-medium text-gray-900 dark:text-gray-100">
                    {parsed.engine.version || t("dev.ua.unknown")}
                  </dd>
                </div>
              </dl>
              <dl className="space-y-2">
                <div>
                  <dt className="text-xs text-gray-500 dark:text-gray-400">
                    {t("dev.ua.fields.architecture")}
                  </dt>
                  <dd className="font-medium text-gray-900 dark:text-gray-100">
                    {parsed.cpu.architecture || t("dev.ua.unknown")}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
