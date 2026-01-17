import { useState, useRef } from "react";
import {
  Repeat,
  Play,
  Pause,
  Clock,
  Zap,
  Activity,
  CheckCircle2,
  BarChart2,
  Settings2,
} from "lucide-react";

interface RequestResult {
  id: number;
  status: number;
  time: number;
  ok: boolean;
  timestamp: string;
}

export default function HttpReplay() {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [count, setCount] = useState(10);
  const [delay, setDelay] = useState(500);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<RequestResult[]>([]);
  const stopRef = useRef(false);

  const startReplay = async () => {
    if (!url || running) return;
    setRunning(true);
    setResults([]);
    stopRef.current = false;

    for (let i = 1; i <= count; i++) {
      if (stopRef.current) break;

      const startTime = performance.now();
      try {
        const res = await fetch(url, { method });
        const endTime = performance.now();
        const newResult: RequestResult = {
          id: i,
          status: res.status,
          time: Math.round(endTime - startTime),
          ok: res.ok,
          timestamp: new Date().toLocaleTimeString(),
        };
        setResults((prev) => [newResult, ...prev]);
      } catch (err) {
        setResults((prev) => [
          {
            id: i,
            status: 0,
            time: 0,
            ok: false,
            timestamp: new Date().toLocaleTimeString(),
          },
          ...prev,
        ]);
      }

      if (i < count) {
        await new Promise((r) => setTimeout(r, delay));
      }
    }
    setRunning(false);
  };

  const stopReplay = () => {
    stopRef.current = true;
    setRunning(false);
  };

  const stats = {
    avg: results.length
      ? Math.round(results.reduce((a, b) => a + b.time, 0) / results.length)
      : 0,
    success: results.filter((r) => r.ok).length,
    failed: results.filter((r) => !r.ok).length,
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold gradient-text-optimized">
          HTTP Replay Tool
        </h1>
        <p className="text-app-text-sub">
          Repeat requests to analyze performance and consistency.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-app-panel border border-app-border rounded-3xl p-6 shadow-xl space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-app-text-sub flex items-center gap-2">
              <Settings2 className="w-4 h-4" />
              Configurations
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-app-text-sub px-1">
                  Target URL
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://api.example.com/test"
                  className="w-full bg-app-bg border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-app-primary/50 transition-all font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-app-text-sub px-1">
                    Method
                  </label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="w-full bg-app-bg border border-app-border rounded-xl px-4 py-2.5 text-sm font-bold text-app-primary"
                  >
                    <option>GET</option>
                    <option>POST</option>
                    <option>PUT</option>
                    <option>DELETE</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-app-text-sub px-1">
                    Iterations
                  </label>
                  <input
                    type="number"
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                    className="w-full bg-app-bg border border-app-border rounded-xl px-4 py-2.5 text-sm font-bold pr-2"
                  />
                </div>
              </div>

              <div className="pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-[10px] font-black uppercase text-app-text-sub">
                    Delay Between: {delay}ms
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={delay}
                  onChange={(e) => setDelay(Number(e.target.value))}
                  className="w-full accent-app-primary cursor-pointer h-1.5 bg-app-border rounded-lg appearance-none"
                />
              </div>

              <div className="pt-6">
                {!running ? (
                  <button
                    onClick={startReplay}
                    disabled={!url}
                    className="w-full bg-app-primary hover:bg-app-primary-hover text-white py-4 rounded-2xl font-black uppercase tracking-tighter transition-all shadow-lg shadow-app-primary/20 active:scale-[0.98] flex items-center justify-center gap-3"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    Start Execution
                  </button>
                ) : (
                  <button
                    onClick={stopReplay}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-black uppercase tracking-tighter transition-all shadow-lg shadow-red-500/20 active:scale-[0.98] flex items-center justify-center gap-3"
                  >
                    <Pause className="w-5 h-5 fill-current" />
                    Stop Replay
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border border-app-border rounded-3xl p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-app-text-sub flex items-center gap-2">
              <BarChart2 className="w-4 h-4" />
              Live Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-green-500">SUCCESS</p>
                <p className="text-2xl font-black">{stats.success}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-red-500">FAILED</p>
                <p className="text-2xl font-black">{stats.failed}</p>
              </div>
              <div className="col-span-2 pt-2 border-t border-white/5 flex justify-between items-center">
                <span className="text-xs font-bold opacity-60">
                  AVG LATENCY
                </span>
                <span className="text-lg font-black text-indigo-400">
                  {stats.avg}ms
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Stream */}
        <div className="lg:col-span-8 flex flex-col h-[650px]">
          <div className="bg-app-panel border border-app-border rounded-3xl overflow-hidden shadow-2xl flex flex-col flex-1">
            <div className="p-4 bg-app-bg/80 backdrop-blur border-b border-app-border flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-4 h-4 text-app-primary shadow-app-primary" />
                Execution Log
              </h2>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 px-3 py-1 bg-app-bg border border-app-border rounded-full text-[10px] font-bold">
                  <Activity className="w-3 h-3 text-app-primary" />
                  {results.length} / {count}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 no-scrollbar bg-[rgba(10,10,12,0.5)]">
              {results.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-20 scale-90">
                  <Repeat className="w-20 h-20 animate-[spin_4s_linear_infinite]" />
                  <p className="font-black uppercase text-xl">
                    Awaiting Trigger
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {results.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all group animate-in slide-in-from-right-4 duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black text-app-text-sub w-8">
                          #{r.id}
                        </span>
                        <div
                          className={`w-2 h-2 rounded-full ${
                            r.ok
                              ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                              : "bg-red-500"
                          }`}
                        />
                        <span
                          className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                            r.ok
                              ? "bg-green-500/10 text-green-500"
                              : "bg-red-500/10 text-red-500"
                          }`}
                        >
                          {r.status || "ERR"}
                        </span>
                        <span className="text-[10px] font-bold opacity-40">
                          {r.timestamp}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3 opacity-40" />
                          <span className="text-xs font-bold text-indigo-400">
                            {r.time}ms
                          </span>
                        </div>
                        <CheckCircle2
                          className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                            r.ok ? "text-green-500/40" : "text-red-500/40"
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 bg-app-bg/50 border-t border-app-border text-center">
              <p className="text-[10px] font-bold text-app-text-sub uppercase tracking-[0.2em]">
                End of Log Transmission
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
