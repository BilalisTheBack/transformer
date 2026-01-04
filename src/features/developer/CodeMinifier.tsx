import { useState } from "react";
import { Zap, Copy, Check, Trash2 } from "lucide-react";

export default function CodeMinifier() {
  // const { t } = useTranslation(); // Unused
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"html" | "css" | "json">("json");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMinify = () => {
    setError(null);
    if (!input.trim()) return;

    try {
      if (mode === "json") {
        setOutput(JSON.stringify(JSON.parse(input)));
      } else if (mode === "css") {
        // Simple CSS Minifier Regex
        setOutput(
          input
            .replace(/\/\*[\s\S]*?\*\//g, "") // Remove comments
            .replace(/\s+/g, " ") // Collapse whitespace
            .replace(/ ?([{},:;]) ?/g, "$1") // Remove space around separators
            .replace(/;}/g, "}") // Remove last semicolon
            .trim()
        );
      } else if (mode === "html") {
        // Simple HTML Minifier Regex
        setOutput(
          input
            .replace(/<!--[\s\S]*?-->/g, "")
            .replace(/>\s+</g, "><")
            .replace(/\s+/g, " ")
            .trim()
        );
      }
    } catch (err: any) {
      setError(`Error: ${err.message}`);
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
          <div className="p-2 bg-green-600 rounded-lg shadow-lg shadow-green-500/20">
            <Zap className="w-6 h-6 text-white" />
          </div>
          Code Minifier
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Minify HTML, CSS, and JSON to reduce file size.
        </p>
      </header>

      <div className="flex gap-2 pb-2 overflow-x-auto">
        {(["json", "css", "html"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              mode === m
                ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-green-500"
            }`}
          >
            {m.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        {/* Input */}
        <div className="flex flex-col gap-2 relative">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Input Code
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 w-full p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl resize-none font-mono text-xs md:text-sm outline-none focus:ring-2 focus:ring-green-500"
            placeholder={`Paste your ${mode.toUpperCase()} code here...`}
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
              Minified Output
            </label>
            {output && (
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-green-500 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" /> Copy
                  </>
                )}
              </button>
            )}
          </div>
          <textarea
            readOnly
            value={output}
            className={`flex-1 w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl resize-none font-mono text-xs md:text-sm outline-none ${
              error ? "border-red-500 focus:border-red-500" : ""
            }`}
            placeholder="Minified result will appear here..."
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
          onClick={handleMinify}
          className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium shadow-lg shadow-green-500/25 transition-all active:scale-95 flex items-center gap-2"
        >
          <Zap className="w-4 h-4" />
          Minify Code
        </button>
      </div>
    </div>
  );
}
