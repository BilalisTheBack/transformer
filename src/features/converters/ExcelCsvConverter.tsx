import { useState } from "react";
// import { useTranslation } from "react-i18next"; // Unused
import { FileSpreadsheet, Table, Download } from "lucide-react";
import * as XLSX from "xlsx";

export default function ExcelCsvConverter() {
  // const { t } = useTranslation(); // Unused
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [mode, setMode] = useState<"excel2csv" | "csv2excel">("excel2csv");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    const reader = new FileReader();

    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

      if (data.length > 0) {
        setColumns(data[0] as string[]);
        setData(data.slice(1));
      }
    };

    reader.readAsBinaryString(uploadedFile);
  };

  const download = (format: "csv" | "xlsx") => {
    if (!file || data.length === 0) return;

    const ws = XLSX.utils.json_to_sheet(
      data.map((row) => {
        const obj: any = {};
        columns.forEach((col, i) => {
          obj[col] = row[i];
        });
        return obj;
      })
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    if (format === "csv") {
      XLSX.writeFile(wb, "converted.csv");
    } else {
      XLSX.writeFile(wb, "converted.xlsx");
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6 animate-in fade-in duration-500 pb-24">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <div className="p-2 bg-green-600 rounded-lg shadow-lg shadow-green-500/20">
            <FileSpreadsheet className="w-6 h-6 text-white" />
          </div>
          Excel &lt;-&gt; CSV Converter
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Convert between Excel spreadsheets and CSV formats.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex gap-2 mb-4 p-1 bg-gray-100 dark:bg-gray-900 rounded-lg">
              <button
                onClick={() => {
                  setMode("excel2csv");
                  setFile(null);
                  setData([]);
                }}
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
                  mode === "excel2csv"
                    ? "bg-white dark:bg-gray-800 shadow text-green-600 dark:text-green-400"
                    : "text-gray-500"
                }`}
              >
                Excel to CSV
              </button>
              <button
                onClick={() => {
                  setMode("csv2excel");
                  setFile(null);
                  setData([]);
                }}
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
                  mode === "csv2excel"
                    ? "bg-white dark:bg-gray-800 shadow text-green-600 dark:text-green-400"
                    : "text-gray-500"
                }`}
              >
                CSV to Excel
              </button>
            </div>

            <div
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                file
                  ? "border-green-500 bg-green-50 dark:bg-green-900/10"
                  : "border-gray-300 dark:border-gray-600 hover:border-green-500"
              }`}
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              {file ? (
                <FileSpreadsheet className="w-10 h-10 text-green-600 mb-2" />
              ) : (
                <Table className="w-10 h-10 text-gray-400 mb-2" />
              )}
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {file
                  ? file.name
                  : `Upload ${mode === "excel2csv" ? "Excel" : "CSV"} File`}
              </p>
              <input
                id="file-upload"
                type="file"
                accept={mode === "excel2csv" ? ".xlsx, .xls" : ".csv"}
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>

            {data.length > 0 && (
              <button
                onClick={() => download(mode === "excel2csv" ? "csv" : "xlsx")}
                className="w-full mt-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium shadow-lg shadow-green-500/25 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download {mode === "excel2csv" ? "CSV" : "Excel"}
              </button>
            )}
          </div>
        </div>

        {/* Data Preview */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Table className="w-4 h-4" /> Data Preview
            </h3>
            <span className="text-xs text-gray-500">
              {data.length > 0 ? `${data.length} rows` : "No data loaded"}
            </span>
          </div>

          <div className="flex-1 overflow-auto">
            {data.length > 0 ? (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                  <tr>
                    {columns.map((col, i) => (
                      <th
                        key={i}
                        className="px-6 py-3 whitespace-nowrap border-b border-gray-200 dark:border-gray-700"
                      >
                        {col || `Col ${i + 1}`}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, 100).map((row: any[], i) => (
                    <tr
                      key={i}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      {columns.map((_, colIndex) => (
                        <td
                          key={colIndex}
                          className="px-6 py-2 whitespace-nowrap text-gray-600 dark:text-gray-300"
                        >
                          {row[colIndex]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <Table className="w-16 h-16 mb-4 opacity-20" />
                <p>Upload a file to preview data</p>
              </div>
            )}
          </div>
          {data.length > 100 && (
            <div className="p-2 text-center text-xs text-gray-500 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              Showing first 100 rows only
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
