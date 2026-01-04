import { useState } from "react";
// import { useTranslation } from "react-i18next"; // Unused
import { CheckCircle, AlertTriangle, FileJson, Trash2 } from "lucide-react";

export default function JsonValidator() {
  // const { t } = useTranslation(); // Unused
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "valid" | "invalid">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const validate = (str: string) => {
    if (!str.trim()) {
      setStatus("idle");
      setErrorMsg(null);
      return;
    }
    try {
      JSON.parse(str);
      setStatus("valid");
      setErrorMsg(null);
    } catch (err: any) {
      setStatus("invalid");
      setErrorMsg(err.message);
    }
  };

  const handleChange = (val: string) => {
    setInput(val);
    validate(val);
  };

  const formatJson = () => {
    try {
      const obj = JSON.parse(input);
      const formatted = JSON.stringify(obj, null, 2);
      setInput(formatted);
      validate(formatted);
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6 animate-in fade-in duration-500 pb-24">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <div className="p-2 bg-yellow-500 rounded-lg shadow-lg shadow-yellow-500/20">
            <FileJson className="w-6 h-6 text-white" />
          </div>
          JSON Validator
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Validate and format JSON data with real-time error checking.
        </p>
      </header>

      <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm relative overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center gap-2">
            {status === "idle" && (
              <span className="text-sm text-gray-500">
                Enter JSON to validate
              </span>
            )}
            {status === "valid" && (
              <span className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
                <CheckCircle className="w-4 h-4" /> Valid JSON
              </span>
            )}
            {status === "invalid" && (
              <span className="flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-400">
                <AlertTriangle className="w-4 h-4" /> Invalid JSON
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={formatJson}
              disabled={status !== "valid"}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
            >
              Format / Beautify
            </button>
            <button
              onClick={() => handleChange("")}
              className="p-1.5 text-gray-500 hover:text-red-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Editor */}
        <textarea
          value={input}
          onChange={(e) => handleChange(e.target.value)}
          className={`flex-1 w-full p-6 bg-white dark:bg-gray-800 resize-none font-mono text-sm leading-relaxed outline-none ${
            status === "invalid" ? "bg-red-50/10" : ""
          }`}
          spellCheck={false}
          placeholder='{"key": "value"}'
        />

        {/* Error Bar */}
        {errorMsg && (
          <div className="absolute bottom-0 left-0 right-0 bg-red-100 dark:bg-red-900/90 text-red-600 dark:text-red-200 px-6 py-3 text-sm font-mono border-t border-red-200 dark:border-red-800 animate-in slide-in-from-bottom-2">
            {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
}
