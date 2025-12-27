import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Clock, Copy, Calendar } from "lucide-react";

type Mode = "toDate" | "toTimestamp";

export default function EpochConverter() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>("toDate");
  const [input, setInput] = useState("");

  const now = Math.floor(Date.now() / 1000);

  const convertToDate = (timestamp: string) => {
    const num = parseInt(timestamp, 10);
    if (isNaN(num)) return null;

    // Handle milliseconds vs seconds
    const ts = timestamp.length > 10 ? num : num * 1000;
    const date = new Date(ts);

    if (isNaN(date.getTime())) return null;

    return {
      iso: date.toISOString(),
      local: date.toLocaleString(),
      utc: date.toUTCString(),
      relative: getRelativeTime(date),
    };
  };

  const convertToTimestamp = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null;

    return {
      seconds: Math.floor(date.getTime() / 1000),
      milliseconds: date.getTime(),
    };
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffSec = Math.abs(Math.floor(diffMs / 1000));
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    const isPast = diffMs < 0;
    const prefix = isPast ? "" : t("epoch.in");
    const suffix = isPast ? t("epoch.ago") : "";

    if (diffDay > 0) return `${prefix}${diffDay} ${t("epoch.days")} ${suffix}`;
    if (diffHour > 0)
      return `${prefix}${diffHour} ${t("epoch.hours")} ${suffix}`;
    if (diffMin > 0)
      return `${prefix}${diffMin} ${t("epoch.minutes")} ${suffix}`;
    return t("epoch.justNow");
  };

  const result = input.trim()
    ? mode === "toDate"
      ? convertToDate(input.trim())
      : convertToTimestamp(input.trim())
    : null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const setNow = () => {
    if (mode === "toDate") {
      setInput(now.toString());
    } else {
      setInput(new Date().toISOString());
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-app-text flex items-center gap-3">
          <Clock className="w-8 h-8 text-app-primary" />
          {t("epoch.title")}
        </h1>
        <p className="text-app-text-sub mt-2">{t("epoch.description")}</p>
      </header>

      {/* Current Timestamp */}
      <div className="flex items-center gap-4 p-4 bg-app-panel border border-app-border rounded-xl">
        <Calendar className="w-5 h-5 text-app-primary" />
        <span className="text-app-text-sub">{t("epoch.currentTime")}:</span>
        <code className="font-mono text-app-text">{now}</code>
        <button
          onClick={() => copyToClipboard(now.toString())}
          className="ml-auto text-app-text-sub hover:text-app-primary transition-colors"
        >
          <Copy className="w-4 h-4" />
        </button>
      </div>

      {/* Mode Toggle */}
      <div className="flex items-center gap-4">
        <div className="flex bg-app-panel border border-app-border rounded-xl p-1">
          <button
            onClick={() => {
              setMode("toDate");
              setInput("");
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === "toDate"
                ? "bg-app-primary text-white"
                : "text-app-text-sub hover:text-app-text"
            }`}
          >
            {t("epoch.toDate")}
          </button>
          <button
            onClick={() => {
              setMode("toTimestamp");
              setInput("");
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === "toTimestamp"
                ? "bg-app-primary text-white"
                : "text-app-text-sub hover:text-app-text"
            }`}
          >
            {t("epoch.toTimestamp")}
          </button>
        </div>
      </div>

      {/* Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-app-text-sub">
            {mode === "toDate"
              ? t("epoch.timestampInput")
              : t("epoch.dateInput")}
          </label>
          <button
            onClick={setNow}
            className="text-sm text-app-primary hover:underline"
          >
            {t("epoch.useNow")}
          </button>
        </div>
        <input
          type={mode === "toTimestamp" ? "datetime-local" : "text"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === "toDate" ? "1703698234" : ""}
          className="w-full bg-app-panel border border-app-border rounded-xl p-4 text-app-text font-mono text-sm focus:outline-none focus:border-app-primary transition-colors"
        />
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-3">
          {mode === "toDate" && "iso" in result ? (
            <>
              <ResultRow
                label="ISO 8601"
                value={result.iso}
                onCopy={copyToClipboard}
              />
              <ResultRow
                label={t("epoch.localTime")}
                value={result.local}
                onCopy={copyToClipboard}
              />
              <ResultRow
                label="UTC"
                value={result.utc}
                onCopy={copyToClipboard}
              />
              <div className="flex items-center gap-3 p-4 bg-app-primary/10 border border-app-primary/30 rounded-xl">
                <Clock className="w-5 h-5 text-app-primary" />
                <span className="text-app-text">{result.relative}</span>
              </div>
            </>
          ) : mode === "toTimestamp" && "seconds" in result ? (
            <>
              <ResultRow
                label={t("epoch.seconds")}
                value={result.seconds.toString()}
                onCopy={copyToClipboard}
              />
              <ResultRow
                label={t("epoch.milliseconds")}
                value={result.milliseconds.toString()}
                onCopy={copyToClipboard}
              />
            </>
          ) : (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
              {t("epoch.invalidInput")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ResultRow({
  label,
  value,
  onCopy,
}: {
  label: string;
  value: string;
  onCopy: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-app-panel border border-app-border rounded-xl">
      <div>
        <span className="text-sm text-app-text-sub block">{label}</span>
        <code className="font-mono text-app-text">{value}</code>
      </div>
      <button
        onClick={() => onCopy(value)}
        className="text-app-text-sub hover:text-app-primary transition-colors"
      >
        <Copy className="w-4 h-4" />
      </button>
    </div>
  );
}
