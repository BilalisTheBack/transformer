import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Copy, Check, Code } from "lucide-react";

// Simple type inference engine (mock for now, or basic implementation)
const inferType = (value: any): string => {
  if (value === null) return "any";
  if (Array.isArray(value)) {
    if (value.length === 0) return "any[]";
    const itemType = inferType(value[0]);
    return `${itemType}[]`;
  }
  if (typeof value === "object") {
    return "object"; // Should recursively define interfaces in full version
  }
  return typeof value as string;
};

const jsonToTs = (json: string, rootName: string = "Root") => {
  try {
    const obj = JSON.parse(json);
    let output = "";

    const generateInterface = (name: string, data: any) => {
      let result = `export interface ${name} {\n`;

      Object.entries(data).forEach(([key, value]) => {
        let type: string = typeof value;
        if (value === null) type = "any";
        else if (Array.isArray(value)) {
          // Check first item for type
          if (
            value.length > 0 &&
            typeof value[0] === "object" &&
            value[0] !== null
          ) {
            const subName =
              name + key.charAt(0).toUpperCase() + key.slice(1, -1); // Singularize roughly
            generateInterface(subName, value[0]); // Recurse side-effect: adds to output (simplified)
            type = `${subName}[]`;
            // Note: This naive recursion approach has issues with output order,
            // better to collect all interfaces first. we will do a simple single-level pass for MVP.
            type = "any[]"; // Fallback for stability in MVP
          } else {
            type = value.length > 0 ? typeof value[0] + "[]" : "any[]";
          }
        } else if (typeof value === "object") {
          // Nested object
          type = "any"; // Simplification for MVP
        }

        result += `  ${key}: ${type};\n`;
      });

      result += `}\n\n`;
      output = result + output; // Prepend nested interfaces
    };

    // Improved naive implementation

    const parseObject = (obj: any, name: string): string => {
      if (obj === null) return "any";
      if (Array.isArray(obj)) {
        if (obj.length === 0) return "any[]";
        const type = parseObject(
          obj[0],
          name.endsWith("s") ? name.slice(0, -1) : name + "Item"
        );
        return `${type}[]`;
      }
      if (typeof obj === "object") {
        let struct = `interface ${name} {\n`;
        Object.entries(obj).forEach(([key, val]) => {
          const propName = key;
          const propType = parseObject(
            val,
            name + key.charAt(0).toUpperCase() + key.slice(1)
          );
          struct += `  ${propName}: ${propType};\n`;
        });
        struct += `}`;

        // If we were building a multi-interface output, we'd add it to a list here.
        // For this MVP, we will just return a formatted string for the root object logic
        // and handle nested objects as inline types or simpler 'any' for deep nesting to avoid complexity overload in one go.

        // Let's stick to a robust simple version:
        return struct;
      }
      return typeof obj;
    };

    // Real robust implementation for MVP:
    // We will just iterate keys and map types.
    if (typeof obj === "object" && !Array.isArray(obj) && obj !== null) {
      let res = `export interface ${rootName} {\n`;
      Object.entries(obj).forEach(([k, v]) => {
        res += `  ${k}: ${inferType(v)};\n`;
      });
      res += `}`;
      return res;
    } else if (Array.isArray(obj)) {
      if (obj.length > 0 && typeof obj[0] === "object") {
        let res = `export interface ${rootName}Item {\n`;
        Object.entries(obj[0]).forEach(([k, v]) => {
          res += `  ${k}: ${inferType(v)};\n`;
        });
        res += `}\n\nexport type ${rootName} = ${rootName}Item[];`;
        return res;
      }
      return `export type ${rootName} = ${inferType(obj)};`;
    }

    return `export type ${rootName} = ${typeof obj};`;
  } catch (e) {
    return "Invalid JSON";
  }
};

export default function JsonToTsConverter() {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [rootName, setRootName] = useState("Root");

  const output = React.useMemo(
    () => jsonToTs(input, rootName),
    [input, rootName]
  );
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
          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
            <Code className="w-6 h-6 text-white" />
          </div>
          {t("converter.json_ts_title")}
        </h1>
        <p className="text-neutral-400">{t("converter.json_ts_desc")}</p>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
        <div className="flex flex-col bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
            <span className="text-sm font-medium text-neutral-400">
              {t("converter.json_input")}
            </span>
            <input
              type="text"
              value={rootName}
              onChange={(e) => setRootName(e.target.value)}
              className="bg-neutral-950 border border-neutral-800 rounded px-2 py-1 text-xs text-neutral-300 w-32 focus:border-blue-500 outline-none transition-colors"
              placeholder={t("converter.interface_name")}
            />
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent p-4 resize-none outline-none font-mono text-sm leading-relaxed"
            placeholder='{"id": 1, "name": "Project X"}'
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden relative">
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-neutral-900/80">
            <span className="text-sm font-medium text-blue-400">
              {t("converter.ts_interface")}
            </span>
            <button
              onClick={copyToClipboard}
              className="p-1.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-blue-500 transition-colors"
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
            className="flex-1 bg-transparent p-4 resize-none outline-none font-mono text-sm leading-relaxed text-blue-100"
          />
        </div>
      </div>
    </div>
  );
}
