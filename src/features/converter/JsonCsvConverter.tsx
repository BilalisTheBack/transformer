import { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import {
  FileSpreadsheet,
  Download,
  Copy,
  FileJson,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export default function JsonCsvConverter() {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [delimiter, setDelimiter] = useState<"auto" | "," | ";" | "\t">("auto");
  const [error, setError] = useState<string | null>(null);

  const handleConvert = (target: "csv" | "excel" | "json") => {
    setError(null);
    try {
      if (!input.trim()) return;

      if (target === "json") {
        // CSV to JSON logic
        Papa.parse(input, {
          header: true,
          skipEmptyLines: true,
          delimiter: delimiter === "auto" ? "" : delimiter,
          complete: (results) => {
            if (results.errors.length) {
              throw new Error(results.errors[0].message);
            }
            setOutput(JSON.stringify(results.data, null, 2));
          },
          error: (err: Error) => {
            throw new Error(err.message);
          },
        });
      } else {
        // JSON to CSV/Excel logic
        let data;
        try {
          data = JSON.parse(input);
        } catch {
          throw new Error("Invalid JSON input");
        }

        if (!Array.isArray(data)) {
          // If single object, wrap in array
          data = [data];
        }

        if (target === "csv") {
          const csv = Papa.unparse(data, {
            delimiter: delimiter === "auto" ? "," : delimiter,
          });
          setOutput(csv);
        } else {
          // Excel export
          const ws = XLSX.utils.json_to_sheet(data);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
          XLSX.writeFile(wb, "converted_data.xlsx");
        }
      }
    } catch (err: any) {
      setError((err as Error).message);
      setOutput("");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    // Could add toast here
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <FileJson className="w-8 h-8 text-orange-500" />
            {t("converter.json_csv_title")}
          </h1>
          <p className="text-neutral-400">{t("converter.description")}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
        {/* Input Section */}
        <div className="flex flex-col gap-4 bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-neutral-300">
              {t("common.input")}
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setInput("")}
                className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-red-400 transition-colors"
                title={t("common.clear")}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl p-4 font-mono text-sm resize-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 outline-none transition-all placeholder-neutral-600"
            placeholder='[{"id": 1, "name": "John"}]'
          />
          <div className="flex gap-2 items-center">
            <div className="flex-1 flex gap-2">
              {/* Utils buttons could go here */}
              <button
                onClick={() => {
                  try {
                    setInput(JSON.stringify(JSON.parse(input), null, 2));
                  } catch {}
                }}
                className="px-3 py-1.5 text-xs bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
              >
                {t("converter.prettify")}
              </button>
              <button
                onClick={() => {
                  try {
                    setInput(JSON.stringify(JSON.parse(input)));
                  } catch {}
                }}
                className="px-3 py-1.5 text-xs bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
              >
                {t("converter.minify")}
              </button>
            </div>
          </div>
        </div>

        {/* Controls (Middle - Visual only for grid, actually mapped below logic-wise) */}

        {/* Output Section */}
        <div className="flex flex-col gap-4 bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-neutral-300">
              {t("common.output")}
            </label>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-green-400 transition-colors"
                title={t("common.copy")}
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  const blob = new Blob([output], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "converted.csv";
                  a.click();
                }}
                className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-blue-400 transition-colors"
                title={t("common.download")}
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {error ? (
            <div className="flex-1 p-4 text-red-500 font-mono text-sm">
              Error: {error}
            </div>
          ) : (
            <textarea
              readOnly
              value={output}
              className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl p-4 font-mono text-sm resize-none outline-none focus:border-green-500 transition-colors text-neutral-400"
              placeholder="..."
            />
          )}
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center gap-4 p-4 bg-neutral-900 border border-neutral-800 rounded-xl">
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-400">
            {t("converter.delimiter")}:
          </span>
          <select
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value as any)}
            className="bg-neutral-800 border-none rounded-lg px-3 py-1.5 text-sm outline-none cursor-pointer"
          >
            <option value="auto">{t("converter.auto_detect")}</option>
            <option value=",">{t("converter.comma")}</option>
            <option value=";">{t("converter.semicolon")}</option>
            <option value={"\t"}>{t("converter.tab")}</option>
          </select>
        </div>

        <div className="h-6 w-px bg-neutral-800" />

        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => handleConvert("csv")}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-colors font-medium shadow-lg shadow-orange-900/20"
          >
            {t("converter.to_csv")}
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleConvert("excel")}
            className="flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded-lg transition-colors font-medium shadow-lg shadow-green-900/20"
          >
            {t("converter.to_excel")}
            <FileSpreadsheet className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleConvert("json")}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors font-medium border border-neutral-700"
          >
            {t("converter.to_json")}
            <FileJson className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
