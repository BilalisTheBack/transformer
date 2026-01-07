import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FileCode, ArrowRightLeft, Copy, Trash2, Check } from "lucide-react";
import { XMLParser, XMLBuilder } from "fast-xml-parser";

export default function XmlJsonConverter() {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"xml2json" | "json2xml">("xml2json");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleConvert = () => {
    setError(null);
    try {
      if (!input.trim()) {
        setOutput("");
        return;
      }

      if (mode === "xml2json") {
        const parser = new XMLParser();
        const jsonObj = parser.parse(input);
        setOutput(JSON.stringify(jsonObj, null, 2));
      } else {
        const builder = new XMLBuilder({
          format: true,
          ignoreAttributes: false,
        });
        const jsonObj = JSON.parse(input);
        const xmlStr = builder.build(jsonObj);
        setOutput(xmlStr);
      }
    } catch (err) {
      setError(
        mode === "xml2json"
          ? t("converter.invalid_xml")
          : t("converter.invalid_json")
      );
      console.error(err);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6 animate-in fade-in duration-500 pb-24">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <div className="p-2 bg-orange-600 rounded-lg shadow-lg shadow-orange-500/20">
            <FileCode className="w-6 h-6 text-white" />
          </div>
          {t("converter.xml_json_title")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("converter.xml_json_desc")}
        </p>
      </header>

      <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-2 rounded-xl border border-gray-200 dark:border-gray-700 w-fit">
        <button
          onClick={() => {
            setMode("xml2json");
            setInput("");
            setOutput("");
            setError(null);
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === "xml2json"
              ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
              : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
          }`}
        >
          {t("converter.xml_to_json")}
        </button>
        <ArrowRightLeft className="w-4 h-4 text-gray-400" />
        <button
          onClick={() => {
            setMode("json2xml");
            setInput("");
            setOutput("");
            setError(null);
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === "json2xml"
              ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
              : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
          }`}
        >
          {t("converter.json_to_xml")}
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        {/* Input */}
        <div className="flex flex-col gap-2 relative">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {mode === "xml2json"
              ? t("converter.xml_input")
              : t("converter.json_input")}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 w-full p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl resize-none font-mono text-sm outline-none focus:ring-2 focus:ring-orange-500"
            placeholder={
              mode === "xml2json"
                ? "<root><item>Value</item></root>"
                : '{"root": {"item": "Value"}}'
            }
          />
          {input && (
            <button
              onClick={() => {
                setInput("");
                setOutput("");
              }}
              className="absolute top-9 right-4 p-1 text-gray-400 hover:text-red-500 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Output */}
        <div className="flex flex-col gap-2 relative">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {mode === "xml2json" ? t("common.output") : t("common.output")}
            </label>
            {output && (
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-orange-500 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3" /> {t("common.copied")}
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" /> {t("common.copy")}
                  </>
                )}
              </button>
            )}
          </div>
          <textarea
            readOnly
            value={output}
            className={`flex-1 w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl resize-none font-mono text-sm outline-none ${
              error ? "border-red-500 focus:border-red-500" : ""
            }`}
            placeholder={t("converter.placeholder")}
          />
          {error && (
            <div className="absolute bottom-4 left-4 right-4 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 text-sm p-2 rounded border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleConvert}
          className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-medium shadow-lg shadow-orange-500/25 transition-all active:scale-95"
        >
          {t("common.convert")}
        </button>
      </div>
    </div>
  );
}
