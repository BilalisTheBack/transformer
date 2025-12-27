import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Database, Copy, CheckCircle2, Wand2 } from "lucide-react";
import { format } from "sql-formatter";

export default function SqlFormatter() {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [dialect, setDialect] = useState<
    "sql" | "mysql" | "postgresql" | "sqlite"
  >("sql");

  const formatSql = () => {
    try {
      const formatted = format(input, {
        language: dialect,
        tabWidth: 2,
        keywordCase: "upper",
        linesBetweenQueries: 2,
      });
      setOutput(formatted);
    } catch {
      setOutput(t("sql.formatError"));
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const minify = () => {
    const minified = input.replace(/\s+/g, " ").trim();
    setOutput(minified);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-app-text flex items-center gap-3">
          <Database className="w-8 h-8 text-app-primary" />
          {t("sql.title")}
        </h1>
        <p className="text-app-text-sub mt-2">{t("sql.description")}</p>
      </header>

      {/* Options */}
      <div className="flex items-center gap-4">
        <select
          value={dialect}
          onChange={(e) => setDialect(e.target.value as typeof dialect)}
          className="bg-app-panel border border-app-border rounded-xl px-4 py-2 text-app-text focus:outline-none focus:border-app-primary"
        >
          <option value="sql">Standard SQL</option>
          <option value="mysql">MySQL</option>
          <option value="postgresql">PostgreSQL</option>
          <option value="sqlite">SQLite</option>
        </select>
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-app-text-sub">
            {t("common.input")}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="SELECT * FROM users WHERE id = 1 AND status = 'active' ORDER BY created_at DESC"
            className="w-full h-80 bg-app-panel border border-app-border rounded-xl p-4 text-app-text font-mono text-sm resize-none focus:outline-none focus:border-app-primary transition-colors"
          />
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-app-text-sub">
              {t("common.output")}
            </label>
            {output && (
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 text-sm text-app-text-sub hover:text-app-primary transition-colors"
              >
                {copied ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                {t("common.copy")}
              </button>
            )}
          </div>
          <pre className="w-full h-80 bg-app-panel border border-app-border rounded-xl p-4 text-app-text font-mono text-sm overflow-auto whitespace-pre-wrap">
            {output || (
              <span className="text-app-text-mute">
                {t("sql.outputPlaceholder")}
              </span>
            )}
          </pre>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={formatSql}
          className="flex items-center gap-2 px-6 py-3 bg-app-primary hover:bg-app-primary-hover text-white font-medium rounded-xl transition-colors"
        >
          <Wand2 className="w-5 h-5" />
          {t("sql.format")}
        </button>
        <button
          onClick={minify}
          className="px-6 py-3 bg-app-panel border border-app-border hover:border-app-text-mute text-app-text-sub rounded-xl transition-colors"
        >
          {t("sql.minify")}
        </button>
      </div>
    </div>
  );
}
