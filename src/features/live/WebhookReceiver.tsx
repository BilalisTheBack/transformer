import { useState, useEffect } from "react";
import {
  Network,
  Copy,
  Trash2,
  RefreshCw,
  Terminal,
  Activity,
  Cpu,
  Database,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

interface WebhookEvent {
  id: string;
  timestamp: string;
  method: string;
  source: string;
  payload: any;
  headers: any;
}

export default function WebhookReceiver() {
  const [hookUrl, setHookUrl] = useState("");
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [activeEvent, setActiveEvent] = useState<WebhookEvent | null>(null);
  const [isLive, setIsLive] = useState(false);

  const generateUrl = () => {
    const id = Math.random().toString(36).substring(7);
    setHookUrl(`https://transformer.live/hooks/${id}`);
    setIsLive(true);
  };

  const clearLogs = () => {
    setEvents([]);
    setActiveEvent(null);
  };

  // Simulate incoming webhooks when live
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const methods = ["POST", "GET", "PUT"];
        const sources = ["Stripe", "GitHub", "Shopify", "Custom API"];
        const newEvent: WebhookEvent = {
          id: Math.random().toString(36).substring(4),
          timestamp: new Date().toLocaleTimeString(),
          method: methods[Math.floor(Math.random() * methods.length)],
          source: sources[Math.floor(Math.random() * sources.length)],
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "Transformer-Hook-Worker/1.0",
            "X-Request-ID": Math.random().toString(36).substring(2),
          },
          payload: {
            event: "payment_succeeded",
            amount: Math.floor(Math.random() * 10000),
            currency: "usd",
            customer: "cus_" + Math.random().toString(36).substring(5),
          },
        };
        setEvents((prev) => [newEvent, ...prev].slice(0, 50));
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold gradient-text-optimized">
            Webhook Receiver
          </h1>
          <p className="text-app-text-sub">
            Instantly receive and inspect HTTP callbacks from any service.
          </p>
        </div>
        <div className="flex gap-2">
          {isLive && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">
                Live & Receiving
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Setup & Stats */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-app-panel border border-app-border rounded-3xl p-6 shadow-xl space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-app-text-sub flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Your Endpoint
            </h2>

            <div className="space-y-4">
              {!hookUrl ? (
                <button
                  onClick={generateUrl}
                  className="w-full bg-app-primary hover:bg-app-primary-hover text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-app-primary/20 active:scale-95 flex items-center justify-center gap-3"
                >
                  <Network className="w-5 h-5" />
                  Create Live Hook
                </button>
              ) : (
                <div className="space-y-3 animate-in zoom-in-95 duration-300">
                  <div className="p-4 bg-app-bg border border-app-border rounded-2xl flex items-center justify-between group">
                    <code className="text-[10px] text-app-primary font-bold truncate pr-4">
                      {hookUrl}
                    </code>
                    <button className="p-2 hover:bg-app-primary/10 rounded-lg text-app-primary transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[10px] text-app-text-sub flex items-center gap-2 px-2">
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                    Send POST requests to this URL to see logs.
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-app-border/50">
              <div className="bg-app-bg/50 p-3 rounded-2xl border border-app-border/50">
                <p className="text-[10px] uppercase font-bold text-app-text-sub mb-1">
                  Received
                </p>
                <div className="flex items-end gap-1">
                  <span className="text-xl font-black">{events.length}</span>
                  <span className="text-[8px] text-green-500 mb-1">TOTAL</span>
                </div>
              </div>
              <div className="bg-app-bg/50 p-3 rounded-2xl border border-app-border/50">
                <p className="text-[10px] uppercase font-bold text-app-text-sub mb-1">
                  Speed
                </p>
                <div className="flex items-end gap-1">
                  <span className="text-xl font-black">~4s</span>
                  <span className="text-[8px] text-blue-500 mb-1">POLL</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-app-border rounded-3xl p-6">
            <h3 className="text-xs font-bold uppercase mb-4 opacity-60">
              System Health
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <Cpu className="w-3 h-3 text-indigo-400" />
                  <span>Edge Nodes</span>
                </div>
                <span className="text-[10px] font-bold text-green-500">
                  OPTIMAL
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <Database className="w-3 h-3 text-purple-400" />
                  <span>Persistence</span>
                </div>
                <span className="text-[10px] font-bold text-red-500">
                  DISABLED
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Logs */}
        <div className="lg:col-span-8 flex flex-col h-[600px]">
          <div className="bg-app-panel border border-app-border rounded-3xl overflow-hidden shadow-2xl flex flex-col flex-1">
            <div className="p-4 bg-app-bg/80 backdrop-blur border-b border-app-border flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <Terminal className="w-4 h-4 text-app-primary" />
                Live Event Stream
              </h2>
              <button
                onClick={clearLogs}
                className="p-2 text-app-text-sub hover:text-red-500 transition-colors bg-app-bg border border-app-border rounded-xl"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-app-border">
              {/* Event List */}
              <div className="lg:w-1/3 overflow-y-auto no-scrollbar bg-app-bg/20">
                {events.length === 0 ? (
                  <div className="p-8 text-center space-y-4 pt-20 grayscale opacity-40">
                    <Activity className="w-12 h-12 mx-auto animate-pulse" />
                    <p className="text-xs font-bold uppercase">
                      Awaiting Events...
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-app-border/50">
                    {events.map((event) => (
                      <button
                        key={event.id}
                        onClick={() => setActiveEvent(event)}
                        className={`w-full text-left p-4 transition-all hover:bg-app-primary/5 ${
                          activeEvent?.id === event.id
                            ? "bg-app-primary/10 border-l-4 border-app-primary"
                            : ""
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span
                            className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                              event.method === "POST"
                                ? "bg-green-500/20 text-green-500"
                                : "bg-blue-500/20 text-blue-500"
                            }`}
                          >
                            {event.method}
                          </span>
                          <span className="text-[8px] font-bold text-app-text-sub">
                            {event.timestamp}
                          </span>
                        </div>
                        <p className="text-xs font-bold truncate">
                          {event.source}
                        </p>
                        <p className="text-[9px] text-app-text-muted truncate opacity-60">
                          ID: {event.id}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Inspector */}
              <div className="lg:w-2/3 flex flex-col bg-slate-950/50">
                {activeEvent ? (
                  <div className="flex-1 flex flex-col overflow-hidden animate-in fade-in duration-300">
                    <div className="p-4 border-b border-app-border/50 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-app-primary">
                        Event Inspector
                      </span>
                      <button className="flex items-center gap-1 text-[9px] font-bold hover:text-white transition-colors">
                        <ExternalLink className="w-3 h-3" /> Raw JSON
                      </button>
                    </div>
                    <div className="flex-1 p-6 font-mono text-xs overflow-y-auto space-y-6">
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-tighter">
                          Headers
                        </p>
                        <div className="bg-black/30 p-4 rounded-xl space-y-1 border border-white/5">
                          {Object.entries(activeEvent.headers).map(([k, v]) => (
                            <div key={k} className="flex gap-4">
                              <span className="text-gray-500 w-24 shrink-0">
                                {k}:
                              </span>
                              <span className="text-gray-300 break-all">
                                {v as string}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-app-primary uppercase tracking-tighter">
                          Payload
                        </p>
                        <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                          <pre className="text-green-400 whitespace-pre-wrap">
                            {JSON.stringify(activeEvent.payload, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4 opacity-40">
                    <Database className="w-16 h-16" />
                    <div>
                      <h4 className="font-bold uppercase tracking-widest text-sm">
                        No Event Selected
                      </h4>
                      <p className="text-[10px]">
                        Select an incoming hook call from the side list to
                        inspect its content.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="px-4 py-2 bg-app-bg border-t border-app-border flex items-center justify-between text-[8px] font-black uppercase tracking-widest opacity-60">
              <span>Worker: v1.0.4-prod-edge</span>
              <span>Cluster: EU-WEST-1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
