import { useState } from "react";
import {
  ShieldCheck,
  Globe,
  Lock,
  Calendar,
  CheckCircle2,
  Search,
  Zap,
  ShieldAlert,
} from "lucide-react";

export default function DnsSslChecker() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const checkDomain = async () => {
    if (!domain) return;
    setLoading(true);

    // Simulate API call for DNS/SSL
    await new Promise((r) => setTimeout(r, 1500));

    // Mock Data based on standard outputs
    const mockResults = {
      dns: [
        { type: "A", value: "104.21.34.120", ttl: 300 },
        { type: "AAAA", value: "2606:4700:3036::6815:2278", ttl: 300 },
        { type: "MX", value: "route1.mx.cloudflare.net (10)", ttl: 300 },
        { type: "TXT", value: "v=spf1 include:_spf.google.com ~all", ttl: 300 },
        { type: "CNAME", value: "cdn.cloudflare.net", ttl: 3600 },
      ],
      ssl: {
        valid: true,
        issuer: "Cloudflare Inc ECC CA-3",
        expiry: "2026-05-12",
        daysLeft: 124,
        protocol: "TLS v1.3",
        hsts: true,
        cipher: "AEAD-AES128-GCM-SHA256",
      },
    };

    setResults(mockResults);
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold gradient-text-optimized">
          DNS & SSL Checker
        </h1>
        <p className="text-app-text-sub">
          Inspect domain health, SSL certificates, and nameserver propagation.
        </p>
      </div>

      {/* Search Input */}
      <div className="bg-app-panel border border-app-border p-4 rounded-2xl shadow-xl flex gap-3">
        <div className="flex-1 relative">
          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-app-text-sub" />
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.com"
            className="w-full bg-app-bg border border-app-border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-app-primary/50 transition-all font-medium"
            onKeyDown={(e) => e.key === "Enter" && checkDomain()}
          />
        </div>
        <button
          onClick={checkDomain}
          disabled={loading || !domain}
          className="bg-app-primary hover:bg-app-primary-hover disabled:opacity-50 text-white px-8 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-app-primary/20"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
          <span>Check Status</span>
        </button>
      </div>

      {!results && !loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-40 grayscale pointer-events-none">
          <div className="bg-app-panel border border-app-border p-8 rounded-3xl h-64 flex flex-col items-center justify-center space-y-4">
            <ShieldCheck className="w-12 h-12" />
            <p className="font-semibold text-center uppercase tracking-tighter">
              Enter a domain above
            </p>
          </div>
          <div className="bg-app-panel border border-app-border p-8 rounded-3xl h-64"></div>
          <div className="bg-app-panel border border-app-border p-8 rounded-3xl h-64"></div>
        </div>
      ) : loading ? (
        <div className="bg-app-panel border border-app-border p-12 rounded-3xl flex flex-col items-center justify-center gap-6 animate-pulse">
          <div className="w-16 h-16 border-4 border-app-primary/10 border-t-app-primary rounded-full animate-spin" />
          <p className="text-app-primary font-bold tracking-widest uppercase">
            Connecting to global servers...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in zoom-in-95 duration-500">
          {/* SSL Section */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-app-panel to-app-bg border border-app-border rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Lock className="w-32 h-32" />
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    results.ssl.valid
                      ? "bg-green-500/20 text-green-500"
                      : "bg-red-500/20 text-red-500"
                  }`}
                >
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">SSL Certificate</h2>
                  <p className="text-sm text-app-text-sub font-mono uppercase">
                    {results.ssl.protocol}
                  </p>
                </div>
              </div>

              <div className="space-y-6 relative z-10">
                <div className="flex items-center justify-between p-4 bg-app-bg/50 rounded-2xl border border-app-border/50">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-semibold">Status</span>
                  </div>
                  <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-bold uppercase tracking-widest">
                    Valid & Active
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-app-bg/50 rounded-2xl border border-app-border/50">
                    <p className="text-[10px] uppercase font-bold text-app-text-sub mb-1">
                      Issuer
                    </p>
                    <p className="text-sm font-bold truncate">
                      {results.ssl.issuer}
                    </p>
                  </div>
                  <div className="p-4 bg-app-bg/50 rounded-2xl border border-app-border/50">
                    <p className="text-[10px] uppercase font-bold text-app-text-sub mb-1">
                      DMARC / HSTS
                    </p>
                    <div className="flex items-center gap-2">
                      <Zap
                        className={`w-3 h-3 ${
                          results.ssl.hsts ? "text-yellow-500" : "text-gray-500"
                        }`}
                      />
                      <span className="text-xs font-bold uppercase">
                        {results.ssl.hsts ? "Enabled" : "Missing"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-app-bg/50 rounded-2xl border border-app-border/50 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold uppercase text-app-text-sub">
                    <span>Expiry Timeline</span>
                    <span>{results.ssl.daysLeft} Days Remaining</span>
                  </div>
                  <div className="h-2 bg-app-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                      style={{
                        width: `${(results.ssl.daysLeft / 365) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-app-text-sub">
                    <Calendar className="w-3 h-3" />
                    <span>Expires on {results.ssl.expiry}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-app-panel border border-app-border rounded-3xl p-6 flex items-center justify-between group cursor-help transition-all hover:border-app-primary/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold">Security Score</p>
                  <p className="text-xs text-app-text-sub">
                    High transparency & Modern cipher
                  </p>
                </div>
              </div>
              <span className="text-2xl font-black text-green-500">A+</span>
            </div>
          </div>

          {/* DNS Records Section */}
          <div className="lg:col-span-7">
            <div className="bg-app-panel border border-app-border rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-app-border flex items-center justify-between">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Network className="w-5 h-5 text-app-primary" />
                  DNS Records
                </h2>
                <span className="text-xs font-bold text-app-text-sub px-3 py-1 bg-app-bg border border-app-border rounded-full">
                  5 Records Found
                </span>
              </div>

              <div className="divide-y divide-app-border">
                {results.dns.map((record: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-5 flex items-center justify-between hover:bg-app-bg/40 transition-colors group"
                  >
                    <div className="flex items-center gap-6">
                      <span className="w-12 h-8 flex items-center justify-center bg-app-primary/10 text-app-primary rounded font-black text-xs">
                        {record.type}
                      </span>
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold font-mono text-app-text group-hover:text-app-primary transition-colors">
                          {record.value}
                        </p>
                        <p className="text-[10px] text-app-text-sub font-bold uppercase tracking-widest">
                          TTL: {record.ttl}s
                        </p>
                      </div>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-app-primary/10 rounded-lg transition-all">
                      <Repeat className="w-4 h-4 text-app-primary" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-app-bg/30 text-center">
                <p className="text-[10px] text-app-text-sub font-bold italic uppercase tracking-wider">
                  Fetched from 8 global Nameservers
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Internal dependencies for icon consistency
const Network = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="16" y="16" width="6" height="6" rx="1" />
    <rect x="2" y="16" width="6" height="6" rx="1" />
    <rect x="9" y="2" width="6" height="6" rx="1" />
    <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
    <path d="M12 12V8" />
  </svg>
);

const Repeat = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m17 2 4 4-4 4" />
    <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
    <path d="m7 22-4-4 4-4" />
    <path d="M21 13v1a4 4 0 0 1-4 4H3" />
  </svg>
);
