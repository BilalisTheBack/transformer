import React, { useState } from "react";
import { Terminal, Copy, Check } from "lucide-react";

const mockCurlConversion = (curl: string) => {
  if (!curl.trim().startsWith("curl"))
    return '// Please paste a valid curl command starting with "curl"';

  // Very basic Mock parser for MVP demonstration
  // Real implementation would use a library like 'curl-to-json' then generate code

  const urlMatch = curl.match(/['"](https?:\/\/[^'"]+)['"]/);
  const url = urlMatch ? urlMatch[1] : "URL_NOT_FOUND";

  const methodMatch = curl.match(/-X\s+([A-Z]+)/);
  const method = methodMatch ? methodMatch[1] : "GET";

  return `
// Javascript Fetch
fetch('${url}', {
  method: '${method}',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data));

// Python Requests
import requests

response = requests.${method.toLowerCase()}('${url}')
print(response.json())
`;
};

export default function CurlConverter() {
  const [input, setInput] = useState("");
  const output = React.useMemo(() => mockCurlConversion(input), [input]);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-slate-600 to-slate-800 rounded-lg">
            <Terminal className="w-6 h-6 text-white" />
          </div>
          cURL Converter
        </h1>
        <p className="text-neutral-400">
          Convert cURL commands to Fetch, Python, or Axios code.
        </p>
      </header>

      <div className="flex-1 grid grid-cols-1 gap-6 min-h-0">
        <div className="flex flex-col bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden h-1/3">
          <div className="px-4 py-2 border-b border-neutral-800 bg-neutral-900/80 text-sm font-medium text-neutral-400">
            Paste cURL Command
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent p-4 resize-none outline-none font-mono text-sm leading-relaxed"
            placeholder="curl -X POST https://api.example.com/data ..."
          />
        </div>

        <div className="flex flex-col bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden flex-1">
          <div className="px-4 py-2 border-b border-neutral-800 bg-neutral-900/80 flex justify-between items-center">
            <span className="text-sm font-medium text-neutral-400">
              Generated Code
            </span>
            <button
              onClick={copyToClipboard}
              className="text-neutral-400 hover:text-white"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
          <textarea
            readOnly
            value={output}
            className="flex-1 bg-gray-950 p-4 resize-none outline-none font-mono text-sm leading-relaxed text-green-400"
          />
        </div>
      </div>
    </div>
  );
}
