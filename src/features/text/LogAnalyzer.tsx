import { useState, useMemo } from "react";
import { Bug, Search } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import clsx from "clsx";

interface LogEntry {
  id: number;
  level: "INFO" | "WARN" | "ERROR" | "DEBUG" | "UNKNOWN";
  timestamp: string | null;
  message: string;
  raw: string;
}

export default function LogAnalyzer() {
  const [input, setInput] = useState(
    "[2024-01-01 10:00:00] INFO: Application started\n[2024-01-01 10:05:23] WARN: Memory usage high\n[2024-01-01 10:11:00] ERROR: Connection failed\nDEBUG: Retrying connection..."
  );
  const [filter, setFilter] = useState<
    "ALL" | "INFO" | "WARN" | "ERROR" | "DEBUG"
  >("ALL");
  const [search, setSearch] = useState("");

  const parsedLogs = useMemo<LogEntry[]>(() => {
    return input
      .split("\n")
      .filter((line) => line.trim())
      .map((line, index) => {
        let level: LogEntry["level"] = "UNKNOWN";
        if (line.match(/INFO/i)) level = "INFO";
        else if (line.match(/WARN/i)) level = "WARN";
        else if (line.match(/ERROR|FAIL|FATAL/i)) level = "ERROR";
        else if (line.match(/DEBUG/i)) level = "DEBUG";

        // Basic timestamp extraction (ISO-like or bracketed)
        const timeMatch =
          line.match(/\d{4}-\d{2}-\d{2}[\sT]\d{2}:\d{2}:\d{2}/) ||
          line.match(/\d{2}:\d{2}:\d{2}/);
        const timestamp = timeMatch ? timeMatch[0] : null;

        return {
          id: index,
          level,
          timestamp,
          message: line, // For now keep full line as message, or strip metadata if needed
          raw: line,
        };
      });
  }, [input]);

  const stats = useMemo(() => {
    const counts = { INFO: 0, WARN: 0, ERROR: 0, DEBUG: 0, UNKNOWN: 0 };
    parsedLogs.forEach((l) => counts[l.level]++);
    return [
      { name: "Info", value: counts.INFO, color: "#3b82f6" }, // Blue
      { name: "Warn", value: counts.WARN, color: "#eab308" }, // Yellow
      { name: "Error", value: counts.ERROR, color: "#ef4444" }, // Red
      { name: "Debug", value: counts.DEBUG, color: "#a8a29e" }, // Gray
    ].filter((s) => s.value > 0);
  }, [parsedLogs]);

  const filteredLogs = parsedLogs.filter((log) => {
    if (filter !== "ALL" && log.level !== filter) return false;
    if (search && !log.message.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-lg">
            <Bug className="w-6 h-6 text-white" />
          </div>
          Log Analyzer
        </h1>
        <p className="text-neutral-400">
          Parse log files, visualize statistics, and filter errors.
        </p>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        {/* Input Area */}
        <div className="lg:col-span-1 flex flex-col bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden">
          <div className="px-4 py-2 border-b border-neutral-800 bg-neutral-900/80 text-sm font-medium text-neutral-400">
            Paste Log File
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent p-4 resize-none outline-none font-mono text-xs leading-relaxed whitespace-pre"
            placeholder="2024-01-01 12:00:00 INFO Started..."
            spellCheck={false}
          />
        </div>

        {/* Visualization & List */}
        <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">
          {/* Stats Cards & Chart */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-red-900/20 border border-red-500/20 rounded-xl flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-red-400">
                {parsedLogs.filter((l) => l.level === "ERROR").length}
              </span>
              <span className="text-xs text-red-300 uppercase font-medium">
                Errors
              </span>
            </div>
            <div className="p-4 bg-yellow-900/20 border border-yellow-500/20 rounded-xl flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-yellow-400">
                {parsedLogs.filter((l) => l.level === "WARN").length}
              </span>
              <span className="text-xs text-yellow-300 uppercase font-medium">
                Warnings
              </span>
            </div>
            <div className="col-span-2 bg-neutral-900/50 border border-neutral-800 rounded-xl p-2 relative">
              <div className="absolute inset-0 flex items-center justify-center text-xs text-neutral-600 pointer-events-none">
                {stats.length === 0 && "No Data"}
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats}
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={40}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "#171717",
                      border: "1px solid #404040",
                      borderRadius: "8px",
                    }}
                    itemStyle={{ color: "#e5e5e5" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 bg-neutral-900/50 p-2 rounded-xl border border-neutral-800">
            <div className="relative flex-1 min-w-[150px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search logs..."
                className="w-full bg-neutral-950 border-none rounded-lg pl-9 pr-3 py-1.5 text-sm text-neutral-200 outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
            <div className="flex items-center bg-neutral-950 rounded-lg p-1 border border-neutral-800">
              {(["ALL", "ERROR", "WARN", "INFO", "DEBUG"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setFilter(l)}
                  className={clsx(
                    "px-3 py-1 text-xs font-medium rounded transition-colors",
                    filter === l
                      ? "bg-neutral-800 text-white"
                      : "text-neutral-500 hover:text-neutral-300"
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Log List */}
          <div className="flex-1 bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-y-auto p-2 font-mono text-xs">
            {filteredLogs.length === 0 ? (
              <div className="h-full flex items-center justify-center text-neutral-600">
                No logs found matching filter.
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className={clsx(
                    "px-3 py-2 border-b border-neutral-800/50 last:border-0 hover:bg-white/5 transition-colors rounded mb-1 flex gap-3",
                    log.level === "ERROR" && "text-red-400 bg-red-900/10",
                    log.level === "WARN" && "text-yellow-400 bg-yellow-900/5",
                    log.level === "INFO" && "text-blue-300",
                    log.level === "DEBUG" && "text-neutral-500"
                  )}
                >
                  <span
                    className={clsx(
                      "px-1.5 py-0.5 rounded text-[10px] font-bold h-fit",
                      log.level === "ERROR"
                        ? "bg-red-500 text-black"
                        : log.level === "WARN"
                        ? "bg-yellow-500 text-black"
                        : log.level === "INFO"
                        ? "bg-blue-600 text-white"
                        : "bg-neutral-700 text-neutral-300"
                    )}
                  >
                    {log.level}
                  </span>
                  <span className="flex-1 whitespace-pre-wrap break-all">
                    {log.message}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
