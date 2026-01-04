import { useState } from "react";
// import { useTranslation } from "react-i18next"; // Unused
import { Wand2, Copy, Check, Trash2 } from "lucide-react";
import js_beautify from "js-beautify";

export default function CodeBeautifier() {
  // const { t } = useTranslation(); // Unused
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState<"html" | "css" | "js">("html");
  const [copied, setCopied] = useState(false);

  const handleBeautify = () => {
    let result = "";
    const options = { indent_size: 2, space_in_empty_paren: true };

    if (language === "html") {
      result = js_beautify.html(input, options);
    } else if (language === "css") {
      result = js_beautify.css(input, options);
    } else {
      result = js_beautify.js(input, options);
    }
    setInput(result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6 animate-in fade-in duration-500 pb-24">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <div className="p-2 bg-pink-500 rounded-lg shadow-lg shadow-pink-500/20">
            <Wand2 className="w-6 h-6 text-white" />
          </div>
          Code Beautifier
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Format and beautify your ugly code snippets instantly.
        </p>
      </header>

      <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-2 rounded-xl border border-gray-200 dark:border-gray-700 w-fit">
        {(["html", "css", "js"] as const).map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors uppercase ${
              language === lang
                ? "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm relative overflow-hidden">
        {/* Editor */}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 w-full p-6 bg-transparent resize-none font-mono text-sm leading-relaxed outline-none"
          spellCheck={false}
          placeholder={`Paste your ${language.toUpperCase()} code here...`}
        />

        {/* Actions */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {input && (
            <>
              <button
                onClick={() => setInput("")}
                className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:text-red-600 transition-colors"
                title="Clear"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={copyToClipboard}
                className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:text-pink-600 transition-colors"
                title="Copy"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleBeautify}
          className="px-8 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-medium shadow-lg shadow-pink-500/25 transition-all active:scale-95 flex items-center gap-2"
        >
          <Wand2 className="w-4 h-4" />
          Beautify Code
        </button>
      </div>
    </div>
  );
}
