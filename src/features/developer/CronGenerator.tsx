import { useState } from "react";
import { Clock, Copy, Check, Trash2 } from "lucide-react";
import cronstrue from "cronstrue";
import { useTranslation } from "react-i18next";

export default function CronGenerator() {
  const { t } = useTranslation();
  const [minute, setMinute] = useState("*");
  const [hour, setHour] = useState("*");
  const [dayOfMonth, setDayOfMonth] = useState("*");
  const [month, setMonth] = useState("*");
  const [dayOfWeek, setDayOfWeek] = useState("*");
  const [copied, setCopied] = useState(false);

  const cronExpression = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;

  const getHumanReadable = () => {
    try {
      return cronstrue.toString(cronExpression);
    } catch (error) {
      return "Invalid cron expression";
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cronExpression);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const applyPreset = (preset: string) => {
    switch (preset) {
      case "everyMinute":
        setMinute("*");
        setHour("*");
        setDayOfMonth("*");
        setMonth("*");
        setDayOfWeek("*");
        break;
      case "hourly":
        setMinute("0");
        setHour("*");
        setDayOfMonth("*");
        setMonth("*");
        setDayOfWeek("*");
        break;
      case "daily":
        setMinute("0");
        setHour("0");
        setDayOfMonth("*");
        setMonth("*");
        setDayOfWeek("*");
        break;
      case "weekly":
        setMinute("0");
        setHour("0");
        setDayOfMonth("*");
        setMonth("*");
        setDayOfWeek("0");
        break;
      case "monthly":
        setMinute("0");
        setHour("0");
        setDayOfMonth("1");
        setMonth("*");
        setDayOfWeek("*");
        break;
      case "yearly":
        setMinute("0");
        setHour("0");
        setDayOfMonth("1");
        setMonth("1");
        setDayOfWeek("*");
        break;
    }
  };

  const reset = () => {
    setMinute("*");
    setHour("*");
    setDayOfMonth("*");
    setMonth("*");
    setDayOfWeek("*");
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6 animate-in fade-in duration-500 pb-24">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <div className="p-2 bg-purple-600 rounded-lg shadow-lg shadow-purple-500/20">
            <Clock className="w-6 h-6 text-white" />
          </div>
          {t("dev.cron.title")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("dev.cron.description")}
        </p>
      </header>

      {/* Presets */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          {t("dev.cron.presets")}
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            {
              label: t("dev.cron.presetLabels.everyMinute"),
              value: "everyMinute",
            },
            { label: t("dev.cron.presetLabels.hourly"), value: "hourly" },
            { label: t("dev.cron.presetLabels.daily"), value: "daily" },
            { label: t("dev.cron.presetLabels.weekly"), value: "weekly" },
            { label: t("dev.cron.presetLabels.monthly"), value: "monthly" },
            { label: t("dev.cron.presetLabels.yearly"), value: "yearly" },
          ].map((preset) => (
            <button
              key={preset.value}
              onClick={() => applyPreset(preset.value)}
              className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Builder */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
              {t("dev.cron.fields.minute")}
            </label>
            <input
              type="text"
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
              placeholder="*"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-center focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
              {t("dev.cron.fields.hour")}
            </label>
            <input
              type="text"
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              placeholder="*"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-center focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
              {t("dev.cron.fields.day")}
            </label>
            <input
              type="text"
              value={dayOfMonth}
              onChange={(e) => setDayOfMonth(e.target.value)}
              placeholder="*"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-center focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
              {t("dev.cron.fields.month")}
            </label>
            <input
              type="text"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              placeholder="*"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-center focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
              {t("dev.cron.fields.weekday")}
            </label>
            <input
              type="text"
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value)}
              placeholder="*"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-center focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" /> {t("dev.cron.reset")}
          </button>
        </div>
      </div>

      {/* Output */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("dev.cron.expression")}
          </label>
          <div className="flex gap-2">
            <div className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-900 rounded-lg font-mono text-lg text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700">
              {cronExpression}
            </div>
            <button
              onClick={copyToClipboard}
              className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-sm flex items-center gap-2"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("dev.cron.readable")}
          </label>
          <div className="px-4 py-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-900 dark:text-purple-200 border border-purple-200 dark:border-purple-800">
            {getHumanReadable()}
          </div>
        </div>
      </div>

      {/* Help */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800 text-sm text-blue-900 dark:text-blue-200">
        <p className="font-semibold mb-2">{t("dev.cron.help.title")}</p>
        <ul className="space-y-1 text-xs">
          <li>
            <code className="bg-blue-100 dark:bg-blue-900/40 px-1 rounded">
              *
            </code>{" "}
            = {t("dev.cron.help.every")}
          </li>
          <li>
            <code className="bg-blue-100 dark:bg-blue-900/40 px-1 rounded">
              5
            </code>{" "}
            = {t("dev.cron.help.specific")}
          </li>
          <li>
            <code className="bg-blue-100 dark:bg-blue-900/40 px-1 rounded">
              1-5
            </code>{" "}
            = {t("dev.cron.help.range")}
          </li>
          <li>
            <code className="bg-blue-100 dark:bg-blue-900/40 px-1 rounded">
              */15
            </code>{" "}
            = {t("dev.cron.help.interval").replace("X", "15")}
          </li>
          <li>
            <code className="bg-blue-100 dark:bg-blue-900/40 px-1 rounded">
              1,15,30
            </code>{" "}
            = {t("dev.cron.help.list")}
          </li>
        </ul>
      </div>
    </div>
  );
}
