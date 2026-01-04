import { useState } from "react";
import { Mail, Search, Copy, Check, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ParsedHeader {
  from?: string;
  to?: string;
  subject?: string;
  date?: string;
  messageId?: string;
  receivedIPs: string[];
  spfResult?: string;
  dkimResult?: string;
  dmarcResult?: string;
  returnPath?: string;
  warnings: string[];
}

export default function EmailHeaderAnalyzer() {
  const { t } = useTranslation();
  const [headers, setHeaders] = useState("");
  const [parsed, setParsed] = useState<ParsedHeader | null>(null);
  const [copied, setCopied] = useState(false);

  const parseHeaders = () => {
    const lines = headers.split("\n");
    const result: ParsedHeader = {
      receivedIPs: [],
      warnings: [],
    };

    lines.forEach((line) => {
      const lower = line.toLowerCase();

      // Basic headers
      if (lower.startsWith("from:")) {
        result.from = line.substring(5).trim();
      } else if (lower.startsWith("to:")) {
        result.to = line.substring(3).trim();
      } else if (lower.startsWith("subject:")) {
        result.subject = line.substring(8).trim();
      } else if (lower.startsWith("date:")) {
        result.date = line.substring(5).trim();
      } else if (lower.startsWith("message-id:")) {
        result.messageId = line.substring(11).trim();
      } else if (lower.startsWith("return-path:")) {
        result.returnPath = line.substring(12).trim();
      }

      // Extract IPs from Received headers
      if (lower.startsWith("received:")) {
        const ipMatch = line.match(/\[(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\]/);
        if (ipMatch) {
          result.receivedIPs.push(ipMatch[1]);
        }
      }

      // SPF/DKIM/DMARC
      if (lower.includes("spf=")) {
        const match = line.match(/spf=(\w+)/i);
        if (match) result.spfResult = match[1];
      }
      if (lower.includes("dkim=")) {
        const match = line.match(/dkim=(\w+)/i);
        if (match) result.dkimResult = match[1];
      }
      if (lower.includes("dmarc=")) {
        const match = line.match(/dmarc=(\w+)/i);
        if (match) result.dmarcResult = match[1];
      }
    });

    // Security warnings
    if (result.spfResult && result.spfResult.toLowerCase() !== "pass") {
      result.warnings.push(t("emailHeader.spfPass"));
    }
    if (result.dkimResult && result.dkimResult.toLowerCase() !== "pass") {
      result.warnings.push(t("emailHeader.dkimFail"));
    }
    if (
      result.from &&
      result.returnPath &&
      !result.from.includes(result.returnPath.replace(/[<>]/g, ""))
    ) {
      result.warnings.push(t("emailHeader.mismatch"));
    }
    if (result.receivedIPs.length === 0) {
      result.warnings.push(t("emailHeader.noIp"));
    }

    setParsed(result);
  };

  const copyData = () => {
    if (!parsed) return;
    const text = JSON.stringify(parsed, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadExample = () => {
    setHeaders(`From: sender@example.com
To: recipient@example.com
Subject: Test Email
Date: Sat, 4 Jan 2026 12:00:00 +0000
Message-ID: <abc123@example.com>
Return-Path: <sender@example.com>
Received: from mail.example.com ([192.168.1.100])
  by mx.example.com with SMTP id xyz789
  for <recipient@example.com>; Sat, 4 Jan 2026 12:00:00 +0000
Authentication-Results: mx.example.com;
  spf=pass smtp.mailfrom=example.com;
  dkim=pass header.d=example.com;
  dmarc=pass header.from=example.com`);
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6 animate-in fade-in duration-500 pb-24">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <div className="p-2 bg-rose-600 rounded-lg shadow-lg shadow-rose-500/20">
            <Mail className="w-6 h-6 text-white" />
          </div>
          {t("emailHeader.title")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("emailHeader.description")}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        {/* Input */}
        <div className="flex flex-col gap-4 min-h-0">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm flex-1 flex flex-col min-h-0">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("emailHeader.rawHeaders")}
              </label>
              <button
                onClick={loadExample}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                {t("emailHeader.loadExample")}
              </button>
            </div>
            <textarea
              value={headers}
              onChange={(e) => setHeaders(e.target.value)}
              placeholder={t("emailHeader.placeholder")}
              className="flex-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs resize-none focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
            />
          </div>

          <button
            onClick={parseHeaders}
            disabled={!headers.trim()}
            className="w-full py-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 transition-colors"
          >
            <Search className="w-4 h-4" /> {t("emailHeader.analyze")}
          </button>
        </div>

        {/* Results */}
        {parsed && (
          <div className="flex flex-col gap-4 min-h-0 overflow-y-auto">
            {/* Warnings */}
            {parsed.warnings.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
                <h3 className="font-semibold text-red-900 dark:text-red-200 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  {t("emailHeader.warnings")}
                </h3>
                <ul className="space-y-1">
                  {parsed.warnings.map((warning, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-red-800 dark:text-red-300"
                    >
                      • {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Basic Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {t("emailHeader.basicInfo")}
                </h3>
                <button
                  onClick={copyData}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                >
                  {copied ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  {t("common.copy")}
                </button>
              </div>
              <dl className="space-y-2 text-sm">
                {[
                  { label: t("emailHeader.from"), value: parsed.from },
                  { label: t("emailHeader.to"), value: parsed.to },
                  { label: t("emailHeader.subject"), value: parsed.subject },
                  { label: t("emailHeader.date"), value: parsed.date },
                  {
                    label: t("emailHeader.messageId"),
                    value: parsed.messageId,
                  },
                  {
                    label: t("emailHeader.returnPath"),
                    value: parsed.returnPath,
                  },
                ].map(
                  (item) =>
                    item.value && (
                      <div key={item.label} className="grid grid-cols-3 gap-2">
                        <dt className="text-gray-600 dark:text-gray-400">
                          {item.label}:
                        </dt>
                        <dd className="col-span-2 font-mono text-xs text-gray-900 dark:text-gray-100 break-all">
                          {item.value}
                        </dd>
                      </div>
                    )
                )}
              </dl>
            </div>

            {/* Authentication */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                {t("emailHeader.authResults")}
              </h3>
              <div className="space-y-2">
                {[
                  { name: t("emailHeader.spf"), result: parsed.spfResult },
                  { name: t("emailHeader.dkim"), result: parsed.dkimResult },
                  { name: t("emailHeader.dmarc"), result: parsed.dmarcResult },
                ].map((auth) => (
                  <div
                    key={auth.name}
                    className="flex justify-between items-center"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {auth.name}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        auth.result?.toLowerCase() === "pass"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : auth.result
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400"
                      }`}
                    >
                      {auth.result || "N/A"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* IP Trace */}
            {parsed.receivedIPs.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  {t("emailHeader.ipTrace")} ({parsed.receivedIPs.length})
                </h3>
                <div className="space-y-1">
                  {parsed.receivedIPs.map((ip, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        {idx + 1}.
                      </span>
                      <code className="text-gray-900 dark:text-gray-100 font-mono">
                        {ip}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
