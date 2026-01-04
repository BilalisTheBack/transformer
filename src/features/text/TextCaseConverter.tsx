import { useState } from "react";
// import { useTranslation } from "react-i18next"; // Unused
import { CaseUpper, Copy, Check } from "lucide-react";

export default function TextCaseConverter() {
  // const { t } = useTranslation(); // Unused
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toTitleCase = (str: string) => {
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  };

  const toCamelCase = (str: string) => {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, "");
  };

  const toSnakeCase = (str: string) => {
    return (
      str
        .match(
          /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
        )
        ?.map((x) => x.toLowerCase())
        .join("_") ?? str
    );
  };

  const toKebabCase = (str: string) => {
    return (
      str
        .match(
          /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
        )
        ?.map((x) => x.toLowerCase())
        .join("-") ?? str
    );
  };

  const converters = [
    { label: "UPPERCASE", fn: () => setInput(input.toUpperCase()) },
    { label: "lowercase", fn: () => setInput(input.toLowerCase()) },
    { label: "Title Case", fn: () => setInput(toTitleCase(input)) },
    {
      label: "Sentence case",
      fn: () =>
        setInput(input.charAt(0).toUpperCase() + input.slice(1).toLowerCase()),
    },
    { label: "camelCase", fn: () => setInput(toCamelCase(input)) },
    { label: "snake_case", fn: () => setInput(toSnakeCase(input)) },
    { label: "kebab-case", fn: () => setInput(toKebabCase(input)) },
    {
      label: "Reverse",
      fn: () => setInput(input.split("").reverse().join("")),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6 animate-in fade-in duration-500 pb-24">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
            <CaseUpper className="w-6 h-6 text-white" />
          </div>
          Text Case Converter
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Convert text between different letter cases instantly.
        </p>
      </header>

      <div className="flex-1 flex flex-col shadow-sm rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        {/* Toolbar */}
        <div className="p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex gap-2 flex-wrap">
          {converters.map((conv) => (
            <button
              key={conv.label}
              onClick={conv.fn}
              className="px-3 py-1.5 text-sm font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {conv.label}
            </button>
          ))}
        </div>

        {/* Text Area */}
        <div className="relative flex-1">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste text here..."
            className="w-full h-full p-6 bg-transparent resize-none outline-none font-mono text-sm leading-relaxed"
          />
          {input && (
            <button
              onClick={copyToClipboard}
              className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:text-blue-600 transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400 px-2 justify-center">
        <span>{input.length} Characters</span>
        <span>
          {input.split(/\s+/).filter((w) => w.length > 0).length} Words
        </span>
        <span>{input.split("\n").length} Lines</span>
      </div>
    </div>
  );
}
