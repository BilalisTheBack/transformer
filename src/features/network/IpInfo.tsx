import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Globe,
  MapPin,
  Wifi,
  Server,
  RefreshCw,
  Copy,
  Check,
  Shield,
  Navigation,
  ExternalLink,
} from "lucide-react";

interface IpData {
  ip: string;
  city: string;
  region: string;
  country_name: string;
  postal: string;
  latitude: number;
  longitude: number;
  org: string;
  asn: string;
  timezone: string;
}

export default function IpInfo() {
  const { t } = useTranslation();
  const [data, setData] = useState<IpData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchIp = async () => {
    setLoading(true);
    setError(null);
    try {
      // Using ipapi.co (Free tier: 1000 requests/day, supports HTTPS)
      const response = await fetch("https://ipapi.co/json/");
      if (!response.ok) {
        throw new Error("Failed to fetch IP data");
      }
      const jsonData = await response.json();
      if (jsonData.error) {
        throw new Error(jsonData.reason || "API Error");
      }
      setData(jsonData);
    } catch (err) {
      setError(
        "Could not retrieve IP information. Ad-blockers or network restrictions might be interfering."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIp();
  }, []);

  const copyToClipboard = () => {
    if (data?.ip) {
      navigator.clipboard.writeText(data.ip);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Globe className="w-8 h-8 text-blue-500" />
            {t("ip.title", "IP Address Info")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
            {t(
              "ip.description",
              "View your public IP address and location details."
            )}
          </p>
        </div>
        <button
          onClick={fetchIp}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          {t("common.refresh", "Refresh")}
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
          <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-xl md:col-span-2"></div>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-center">
          <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">
            Error Loading Data
          </h3>
          <p className="text-red-600 dark:text-red-400 max-w-md mx-auto">
            {error}
          </p>
          <button
            onClick={fetchIp}
            className="mt-4 text-blue-600 hover:underline"
          >
            Try Again
          </button>
        </div>
      ) : data ? (
        <div className="space-y-6">
          {/* Main IP Card */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="relative z-10 text-center space-y-2">
              <p className="text-blue-100 font-medium uppercase tracking-wider text-sm">
                Your Public IP
              </p>
              <div
                onClick={copyToClipboard}
                className="text-4xl md:text-6xl font-black font-mono tracking-tight cursor-pointer hover:scale-105 transition-transform inline-flex items-center gap-4"
                title="Click to copy"
              >
                {data.ip}
                {copied ? (
                  <Check className="w-6 h-6 md:w-8 md:h-8 text-green-300" />
                ) : (
                  <Copy className="w-6 h-6 md:w-8 md:h-8 opacity-0 group-hover:opacity-50 transition-opacity" />
                )}
              </div>
              {copied && (
                <p className="text-sm text-green-300 font-medium animate-in fade-in slide-in-from-bottom-1">
                  Copied to clipboard!
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Location Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <MapPin className="w-5 h-5 text-red-500" />
                {t("ip.location", "Location Details")}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                  <span className="text-gray-500 dark:text-gray-400">City</span>
                  <span className="font-medium">{data.city}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                  <span className="text-gray-500 dark:text-gray-400">
                    Region
                  </span>
                  <span className="font-medium">{data.region}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                  <span className="text-gray-500 dark:text-gray-400">
                    Country
                  </span>
                  <span className="font-medium">{data.country_name}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                  <span className="text-gray-500 dark:text-gray-400">
                    Postal Code
                  </span>
                  <span className="font-medium">{data.postal}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-gray-500 dark:text-gray-400">
                    Coordinates
                  </span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${data.latitude},${data.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium font-mono text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {data.latitude}, {data.longitude}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Network Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <NetworkIcon className="w-5 h-5 text-green-500" />
                {t("ip.network", "Network Details")}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                  <span className="text-gray-500 dark:text-gray-400">ISP</span>
                  <span
                    className="font-medium text-right max-w-[200px] truncate"
                    title={data.org}
                  >
                    {data.org}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                  <span className="text-gray-500 dark:text-gray-400">ASN</span>
                  <span className="font-medium">{data.asn}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-gray-500 dark:text-gray-400">
                    Timezone
                  </span>
                  <span className="font-medium">{data.timezone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function NetworkIcon(props: any) {
  return (
    <svg
      {...props}
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
}
