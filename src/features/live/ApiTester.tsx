import { useState } from "react";
import {
  Send,
  Plus,
  Trash2,
  Clock,
  Box,
  Globe,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
} from "lucide-react";

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface Header {
  key: string;
  value: string;
  enabled: boolean;
}

export default function ApiTester() {
  const [method, setMethod] = useState<Method>("GET");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState<Header[]>([
    { key: "Content-Type", value: "application/json", enabled: true },
  ]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"body" | "headers">("body");

  const addHeader = () => {
    setHeaders([...headers, { key: "", value: "", enabled: true }]);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const updateHeader = (index: number, field: keyof Header, val: any) => {
    const newHeaders = [...headers];
    newHeaders[index] = { ...newHeaders[index], [field]: val };
    setHeaders(newHeaders);
  };

  const sendRequest = async () => {
    if (!url) return;
    setLoading(true);
    setResponse(null);

    const startTime = performance.now();
    const requestHeaders: Record<string, string> = {};
    headers.forEach((h) => {
      if (h.enabled && h.key) requestHeaders[h.key] = h.value;
    });

    try {
      const options: RequestInit = {
        method,
        headers: requestHeaders,
      };

      if (["POST", "PUT", "PATCH"].includes(method) && body) {
        options.body = body;
      }

      const res = await fetch(url, options);
      const endTime = performance.now();

      let responseBody;
      const contentType = res.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        responseBody = await res.json();
      } else {
        responseBody = await res.text();
      }

      const resHeaders: Record<string, string> = {};
      res.headers.forEach((v, k) => {
        resHeaders[k] = v;
      });

      setResponse({
        status: res.status,
        statusText: res.statusText,
        ok: res.ok,
        time: Math.round(endTime - startTime),
        size: (new Blob([JSON.stringify(responseBody)]).size / 1024).toFixed(2),
        headers: resHeaders,
        body: responseBody,
      });
    } catch (err: any) {
      setResponse({
        error: err.message,
        ok: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold gradient-text-optimized">
          Live API Tester
        </h1>
        <p className="text-app-text-sub">
          Test and debug REST APIs in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Request Panel */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-app-panel border border-app-border rounded-2xl overflow-hidden shadow-xl shadow-black/20">
            <div className="p-4 bg-app-bg/50 border-b border-app-border flex items-center gap-3">
              <div className="relative">
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as Method)}
                  className="appearance-none bg-app-bg border border-app-border rounded-lg px-4 py-2 pr-10 font-bold text-app-primary focus:outline-none focus:ring-2 focus:ring-app-primary/50 transition-all cursor-pointer"
                >
                  <option>GET</option>
                  <option>POST</option>
                  <option>PUT</option>
                  <option>DELETE</option>
                  <option>PATCH</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-app-text-sub pointer-events-none" />
              </div>
              <div className="flex-1 flex gap-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://api.example.com/v1/data"
                  className="flex-1 bg-app-bg border border-app-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-app-primary/50 transition-all"
                />
                <button
                  onClick={sendRequest}
                  disabled={loading || !url}
                  className="bg-app-primary hover:bg-app-primary-hover disabled:opacity-50 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg shadow-app-primary/20 active:scale-95"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>Send</span>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Tabs for Headers/Body */}
              <div className="space-y-4">
                <div className="flex gap-4 border-b border-app-border">
                  <button className="px-4 py-2 border-b-2 border-app-primary text-app-text font-medium text-sm">
                    Headers ({headers.length})
                  </button>
                  {["POST", "PUT", "PATCH"].includes(method) && (
                    <button className="px-4 py-2 border-b-2 border-transparent text-app-text-sub font-medium text-sm hover:text-app-text transition-colors">
                      Body
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {headers.map((header, idx) => (
                    <div
                      key={idx}
                      className="flex gap-2 items-center animate-in fade-in slide-in-from-left-2 duration-200"
                    >
                      <input
                        type="checkbox"
                        checked={header.enabled}
                        onChange={(e) =>
                          updateHeader(idx, "enabled", e.target.checked)
                        }
                        className="w-4 h-4 rounded border-app-border bg-app-bg text-app-primary focus:ring-app-primary/50"
                      />
                      <input
                        type="text"
                        value={header.key}
                        onChange={(e) =>
                          updateHeader(idx, "key", e.target.value)
                        }
                        placeholder="Key"
                        className="flex-1 bg-app-bg border border-app-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-app-primary/30"
                      />
                      <input
                        type="text"
                        value={header.value}
                        onChange={(e) =>
                          updateHeader(idx, "value", e.target.value)
                        }
                        placeholder="Value"
                        className="flex-1 bg-app-bg border border-app-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-app-primary/30"
                      />
                      <button
                        onClick={() => removeHeader(idx)}
                        className="p-2 text-app-text-sub hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addHeader}
                    className="flex items-center gap-2 text-xs font-medium text-app-primary hover:text-app-primary-hover transition-colors mt-2"
                  >
                    <Plus className="w-3 h-3" />
                    Add Header
                  </button>
                </div>

                {["POST", "PUT", "PATCH"].includes(method) && (
                  <div className="space-y-2 mt-4">
                    <label className="text-xs font-semibold text-app-text-sub uppercase tracking-wider">
                      Request Body (JSON)
                    </label>
                    <textarea
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      className="w-full h-48 bg-app-bg border border-app-border rounded-xl p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-app-primary/30 transition-all resize-none"
                      placeholder='{ "key": "value" }'
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Response Panel */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="bg-app-panel border border-app-border rounded-2xl overflow-hidden shadow-xl shadow-black/20 flex flex-col flex-1 min-h-[500px]">
            <div className="p-4 bg-app-bg/50 border-b border-app-border flex items-center justify-between">
              <span className="font-bold text-sm uppercase tracking-widest text-app-text-sub">
                Response
              </span>
              {response && (
                <div className="flex gap-4 items-center">
                  <div className="flex items-center gap-1.5 text-xs font-medium">
                    <Clock className="w-3 h-3" />
                    <span>{response.time}ms</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium">
                    <Box className="w-3 h-3" />
                    <span>{response.size} KB</span>
                  </div>
                  {response.status && (
                    <div
                      className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        response.ok
                          ? "bg-green-500/10 text-green-500"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {response.ok ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <AlertCircle className="w-3 h-3" />
                      )}
                      {response.status} {response.statusText}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex-1 flex flex-col">
              {!response && !loading ? (
                <div className="flex-1 flex flex-col items-center justify-center text-app-text-sub p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-app-bg border border-app-border flex items-center justify-center">
                    <Globe className="w-8 h-8 opacity-20" />
                  </div>
                  <div>
                    <p className="font-medium">No Request data</p>
                    <p className="text-sm opacity-60">
                      Enter a URL and send a request to see the results here.
                    </p>
                  </div>
                </div>
              ) : loading ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                  <div className="w-12 h-12 border-4 border-app-primary/10 border-t-app-primary rounded-full animate-spin" />
                  <p className="text-sm font-medium text-app-primary animate-pulse">
                    Waiting for response...
                  </p>
                </div>
              ) : (
                <div className="flex flex-col flex-1">
                  <div className="flex border-b border-app-border">
                    <button
                      onClick={() => setActiveTab("body")}
                      className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-all ${
                        activeTab === "body"
                          ? "bg-app-primary/10 text-app-primary border-b-2 border-app-primary"
                          : "text-app-text-sub hover:text-app-text"
                      }`}
                    >
                      Body
                    </button>
                    <button
                      onClick={() => setActiveTab("headers")}
                      className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-all ${
                        activeTab === "headers"
                          ? "bg-app-primary/10 text-app-primary border-b-2 border-app-primary"
                          : "text-app-text-sub hover:text-app-text"
                      }`}
                    >
                      Headers
                    </button>
                  </div>

                  <div className="flex-1 bg-[#0d1117] p-4 font-mono text-sm overflow-auto max-h-[600px]">
                    {response.error ? (
                      <div className="space-y-2 text-red-400">
                        <p className="font-bold">Request Failed</p>
                        <p className="text-xs opacity-80">{response.error}</p>
                        <p className="text-[10px] opacity-50 mt-4 italic italic">
                          Note: CORS issues might prevent some requests from
                          working in the browser.
                        </p>
                      </div>
                    ) : activeTab === "body" ? (
                      <pre className="text-blue-300">
                        {typeof response.body === "object"
                          ? JSON.stringify(response.body, null, 2)
                          : response.body}
                      </pre>
                    ) : (
                      <div className="space-y-3">
                        {Object.entries(response.headers).map(([k, v]) => (
                          <div key={k} className="flex gap-4 text-xs">
                            <span className="text-purple-400 font-bold min-w-[120px]">
                              {k}:
                            </span>
                            <span className="text-gray-300 break-all">
                              {v as string}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
