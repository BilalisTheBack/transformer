import { useState, useMemo } from "react";
import { diffLines, diffChars } from "diff";
import { FileDiff } from "lucide-react";
import clsx from "clsx";

export default function TextDiffViewer() {
  const [oldText, setOldText] = useState('Const old = "value";\nreturn old;');
  const [newText, setNewText] = useState('const curr = "value";\nreturn curr;');
  const [mode, setMode] = useState<"lines" | "chars">("lines");

  const changes = useMemo(() => {
    return mode === "lines"
      ? diffLines(oldText, newText)
      : diffChars(oldText, newText);
  }, [oldText, newText, mode]);

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
              <FileDiff className="w-6 h-6 text-white" />
            </div>
            Text Diff Viewer
          </h1>
          <p className="text-neutral-400">
            Compare two texts and highlight differences.
          </p>
        </div>

        <div className="flex bg-neutral-900 p-1 rounded-lg border border-neutral-800">
          <button
            onClick={() => setMode("lines")}
            className={clsx(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              mode === "lines"
                ? "bg-neutral-800 text-white shadow-sm"
                : "text-neutral-400 hover:text-neutral-200"
            )}
          >
            Line Diff
          </button>
          <button
            onClick={() => setMode("chars")}
            className={clsx(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              mode === "chars"
                ? "bg-neutral-800 text-white shadow-sm"
                : "text-neutral-400 hover:text-neutral-200"
            )}
          >
            Char Diff
          </button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
        {/* Inputs */}
        <div className="flex flex-col gap-4">
          <div className="flex-1 flex flex-col bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden">
            <div className="px-4 py-2 border-b border-neutral-800 bg-neutral-900/80 text-sm text-neutral-400 font-medium">
              Original Text
            </div>
            <textarea
              value={oldText}
              onChange={(e) => setOldText(e.target.value)}
              className="flex-1 bg-transparent p-4 resize-none outline-none font-mono text-sm leading-relaxed"
              spellCheck={false}
            />
          </div>
          <div className="flex-1 flex flex-col bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden">
            <div className="px-4 py-2 border-b border-neutral-800 bg-neutral-900/80 text-sm text-neutral-400 font-medium">
              New Text
            </div>
            <textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              className="flex-1 bg-transparent p-4 resize-none outline-none font-mono text-sm leading-relaxed"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Output */}
        <div className="flex flex-col bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-neutral-800 bg-neutral-900/80 text-sm text-cyan-400 font-medium flex justify-between items-center">
            <span>Comparison Result</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap">
            {changes.map((part, index) => {
              const color = part.added
                ? "bg-green-500/20 text-green-200"
                : part.removed
                ? "bg-red-500/20 text-red-200"
                : "text-neutral-300";
              return (
                <span key={index} className={color}>
                  {part.value}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
