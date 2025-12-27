import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FileCode2,
  Copy,
  ArrowLeftRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import * as yaml from "js-yaml";

type Format = "json" | "yaml";

export default function JsonYamlConverter() {
  const { t } = useTranslation();
  const [sourceFormat, setSourceFormat] = useState<Format>("json");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const convert = () => {
    setError(null);
    try {
      if (sourceFormat === "json") {
        const parsed = JSON.parse(input);
        setOutput(yaml.dump(parsed, { indent: 2, lineWidth: -1 }));
      } else {
        const parsed = yaml.load(input);
        setOutput(JSON.stringify(parsed, null, 2));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : t("jsonYaml.parseError"));
      setOutput("");
    }
  };

  const swap = () => {
    setSourceFormat(sourceFormat === "json" ? "yaml" : "json");
    setInput(output);
    setOutput("");
    setError(null);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const targetFormat = sourceFormat === "json" ? "yaml" : "json";

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-app-text flex items-center gap-3">
          <FileCode2 className="w-8 h-8 text-app-primary" />
          {t("jsonYaml.title")}
        </h1>
        <p className="text-app-text-sub mt-2">{t("jsonYaml.description")}</p>
      </header>

      {/* Format Toggle */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-app-panel border border-app-border rounded-xl px-4 py-2">
          <span className="font-mono font-bold text-app-primary uppercase">
            {sourceFormat}
          </span>
          <ArrowLeftRight className="w-4 h-4 text-app-text-mute" />
          <span className="font-mono font-bold text-app-text uppercase">
            {targetFormat}
          </span>
        </div>
        <button
          onClick={swap}
          className="px-4 py-2 bg-app-panel border border-app-border hover:border-app-text-mute rounded-xl text-app-text-sub transition-colors"
        >
          <ArrowLeftRight className="w-5 h-5" />
        </button>
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-app-text-sub flex items-center gap-2">
            <span className="uppercase font-mono">{sourceFormat}</span>
            {t("common.input")}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              sourceFormat === "json"
                ? '{\n  "key": "value"\n}'
                : "key: value\nlist:\n  - item1"
            }
            className="w-full h-80 bg-app-panel border border-app-border rounded-xl p-4 text-app-text font-mono text-sm resize-none focus:outline-none focus:border-app-primary transition-colors"
          />
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-app-text-sub flex items-center gap-2">
              <span className="uppercase font-mono">{targetFormat}</span>
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
          <pre className="w-full h-80 bg-app-panel border border-app-border rounded-xl p-4 text-app-text font-mono text-sm overflow-auto">
            {output || (
              <span className="text-app-text-mute">
                {t("jsonYaml.outputPlaceholder")}
              </span>
            )}
          </pre>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="font-mono text-sm">{error}</span>
        </div>
      )}

      {/* Convert Button */}
      <button
        onClick={convert}
        className="px-6 py-3 bg-app-primary hover:bg-app-primary-hover text-white font-medium rounded-xl transition-colors"
      >
        {t("common.convert")}
      </button>
    </div>
  );
}
