import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { FileText, Copy, Check, Code, Eye } from "lucide-react";
import clsx from "clsx";

export default function MarkdownConverter() {
  const [input, setInput] = useState(
    "# Hello World\n\n**Start typing markdown here...**"
  );
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-gray-200 to-gray-400 rounded-lg">
            <FileText className="w-6 h-6 text-black" />
          </div>
          Markdown Editor
        </h1>
        <p className="text-neutral-400">
          Write Markdown and preview it instantly.
        </p>
      </header>

      <div className="flex-1 flex flex-col bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden min-h-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800 bg-neutral-900/80">
          <div className="flex items-center gap-1 bg-neutral-800 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("write")}
              className={clsx(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-2",
                activeTab === "write"
                  ? "bg-neutral-700 text-white shadow-sm"
                  : "text-neutral-400 hover:text-neutral-200"
              )}
            >
              <Code className="w-4 h-4" />
              Write
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={clsx(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-2",
                activeTab === "preview"
                  ? "bg-neutral-700 text-white shadow-sm"
                  : "text-neutral-400 hover:text-neutral-200"
              )}
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
          </div>

          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-neutral-400 hover:text-white transition-colors"
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            {copied ? "Copied" : "Copy MD"}
          </button>
        </div>

        {/* Editor / Preview Area */}
        <div className="flex-1 overflow-hidden relative">
          {activeTab === "write" ? (
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-full bg-transparent p-6 resize-none outline-none font-mono text-sm leading-relaxed text-neutral-200"
              placeholder="# Start writing..."
              spellCheck={false}
            />
          ) : (
            <div className="w-full h-full overflow-y-auto p-8 prose prose-invert max-w-none">
              <ReactMarkdown>{input}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
