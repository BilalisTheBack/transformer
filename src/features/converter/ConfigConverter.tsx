import { useState } from "react";
import yaml from "js-yaml";
// @ts-ignore
import * as TOML from "@toml-tools/parser";
// @ts-ignore
import smolToml from "smol-toml";

import { Copy, Check, Settings2 } from "lucide-react";

type Format = "json" | "yaml" | "toml";

export default function ConfigConverter() {
  const [inputFormat, setInputFormat] = useState<Format>("yaml");
  const [outputFormat, setOutputFormat] = useState<Format>("json");
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [copied, setCopied] = useState(false);

  const getOutput = () => {
    if (!input.trim()) return "";
    setError(null);
    try {
      // 1. Parse Input to JS Object
      let data: any;
      try {
        if (inputFormat === "json") data = JSON.parse(input);
        if (inputFormat === "yaml") data = yaml.load(input);
        if (inputFormat === "toml") data = smolToml.parse(input);
      } catch (e: any) {
        throw new Error(`Invalid ${inputFormat.toUpperCase()}: ${e.message}`);
      }

      // 2. Dump JS Object to Output Format
      if (outputFormat === "json") return JSON.stringify(data, null, 2);
      if (outputFormat === "yaml") return yaml.dump(data);
      if (outputFormat === "toml") return smolToml.stringify(data);

      return "";
    } catch (e: any) {
      setError(e.message);
      return "";
    }
  };

  const output = getOutput();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg">
            <Settings2 className="w-6 h-6 text-white" />
          </div>
          Config Converter
        </h1>
        <p className="text-neutral-400">
          Convert between YAML, JSON, and TOML configuration files.
        </p>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
        {/* Input */}
        <div className="flex flex-col bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800 bg-neutral-900/80">
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-500">From</span>
              <select
                value={inputFormat}
                onChange={(e) => setInputFormat(e.target.value as Format)}
                className="bg-neutral-800 border-none text-sm rounded px-2 py-1 text-white outline-none cursor-pointer hover:bg-neutral-700"
              >
                <option value="json">JSON</option>
                <option value="yaml">YAML</option>
                <option value="toml">TOML</option>
              </select>
            </div>
            <button
              onClick={() => setInput("")}
              className="text-xs text-neutral-500"
            >
              Clear
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent p-4 resize-none outline-none font-mono text-sm leading-relaxed"
            placeholder={`Paste ${inputFormat.toUpperCase()} here...`}
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="flex flex-col bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden relative">
          <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800 bg-neutral-900/80">
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-500">To</span>
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value as Format)}
                className="bg-neutral-800 border-none text-sm rounded px-2 py-1 text-white outline-none cursor-pointer hover:bg-neutral-700"
              >
                <option value="json">JSON</option>
                <option value="yaml">YAML</option>
                <option value="toml">TOML</option>
              </select>
            </div>
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

          {error ? (
            <div className="flex-1 p-4 text-red-400 font-mono text-sm whitespace-pre-wrap">
              {error}
            </div>
          ) : (
            <textarea
              readOnly
              value={output}
              className="flex-1 bg-transparent p-4 resize-none outline-none font-mono text-sm leading-relaxed text-orange-100"
              spellCheck={false}
            />
          )}
        </div>
      </div>
    </div>
  );
}
