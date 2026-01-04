import { useState } from "react";
import { Database, RefreshCw, Download, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function MockDataGenerator() {
  const { t } = useTranslation();
  const [count, setCount] = useState(5);
  const [fields, setFields] = useState<
    { id: string; name: string; type: string }[]
  >([
    { id: crypto.randomUUID(), name: "id", type: "id" },
    { id: crypto.randomUUID(), name: "name", type: "name" },
    { id: crypto.randomUUID(), name: "email", type: "email" },
  ]);
  const [generatedData, setGeneratedData] = useState<any[]>([]);

  const fieldTypes = [
    { value: "id", label: t("dev.mock.types.id") },
    { value: "name", label: t("dev.mock.types.fullName") },
    { value: "firstName", label: t("dev.mock.types.firstName") },
    { value: "lastName", label: t("dev.mock.types.lastName") },
    { value: "email", label: t("dev.mock.types.email") },
    { value: "phone", label: t("dev.mock.types.phone") },
    { value: "age", label: t("dev.mock.types.age") },
    { value: "address", label: t("dev.mock.types.address") },
    { value: "city", label: t("dev.mock.types.city") },
    { value: "country", label: t("dev.mock.types.country") },
    { value: "company", label: t("dev.mock.types.company") },
    { value: "jobTitle", label: t("dev.mock.types.jobTitle") },
    { value: "url", label: t("dev.mock.types.url") },
    { value: "boolean", label: t("dev.mock.types.boolean") },
    { value: "number", label: t("dev.mock.types.number") },
  ];

  const generateValue = (type: string): any => {
    const firstNames = [
      "John",
      "Jane",
      "Alex",
      "Sarah",
      "Michael",
      "Emma",
      "David",
      "Lisa",
      "Chris",
      "Anna",
    ];
    const lastNames = [
      "Smith",
      "Johnson",
      "Williams",
      "Brown",
      "Jones",
      "Garcia",
      "Miller",
      "Davis",
      "Rodriguez",
      "Martinez",
    ];
    const cities = [
      "New York",
      "Los Angeles",
      "Chicago",
      "Houston",
      "Phoenix",
      "Philadelphia",
      "San Antonio",
      "San Diego",
      "Dallas",
      "San Jose",
    ];
    const countries = [
      "USA",
      "Canada",
      "UK",
      "Germany",
      "France",
      "Japan",
      "Australia",
      "Brazil",
      "India",
      "China",
    ];
    const companies = [
      "TechCorp",
      "DataSys",
      "CloudAI",
      "WebSolutions",
      "DevTools",
      "AppWorks",
      "CodeLab",
      "ByteForce",
      "NetGuru",
      "SoftFactory",
    ];
    const jobTitles = [
      "Software Engineer",
      "Product Manager",
      "Designer",
      "Data Analyst",
      "DevOps Engineer",
      "Marketing Manager",
      "Sales Director",
      "HR Specialist",
    ];

    switch (type) {
      case "id":
        return crypto.randomUUID();
      case "name":
        return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${
          lastNames[Math.floor(Math.random() * lastNames.length)]
        }`;
      case "firstName":
        return firstNames[Math.floor(Math.random() * firstNames.length)];
      case "lastName":
        return lastNames[Math.floor(Math.random() * lastNames.length)];
      case "email":
        const fname =
          firstNames[
            Math.floor(Math.random() * firstNames.length)
          ].toLowerCase();
        const lname =
          lastNames[Math.floor(Math.random() * lastNames.length)].toLowerCase();
        return `${fname}.${lname}@example.com`;
      case "phone":
        return `+1-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(
          Math.random() * 900 + 100
        )}-${Math.floor(Math.random() * 9000 + 1000)}`;
      case "age":
        return Math.floor(Math.random() * 63 + 18);
      case "address":
        return `${Math.floor(Math.random() * 9999 + 1)} ${
          ["Main", "Oak", "Pine", "Maple", "Cedar"][
            Math.floor(Math.random() * 5)
          ]
        } St`;
      case "city":
        return cities[Math.floor(Math.random() * cities.length)];
      case "country":
        return countries[Math.floor(Math.random() * countries.length)];
      case "company":
        return companies[Math.floor(Math.random() * companies.length)];
      case "jobTitle":
        return jobTitles[Math.floor(Math.random() * jobTitles.length)];
      case "url":
        return `https://example-${Math.floor(Math.random() * 1000)}.com`;
      case "boolean":
        return Math.random() > 0.5;
      case "number":
        return Math.floor(Math.random() * 1000 + 1);
      default:
        return "N/A";
    }
  };

  const generate = () => {
    const data = [];
    for (let i = 0; i < count; i++) {
      const item: any = {};
      fields.forEach((field) => {
        item[field.name] = generateValue(field.type);
      });
      data.push(item);
    }
    setGeneratedData(data);
  };

  const addField = () => {
    setFields([
      ...fields,
      { id: crypto.randomUUID(), name: "field", type: "name" },
    ]);
  };

  const removeField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const updateField = (id: string, key: "name" | "type", value: string) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, [key]: value } : f)));
  };

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(generatedData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mock-data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6 animate-in fade-in duration-500 pb-24">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <div className="p-2 bg-amber-600 rounded-lg shadow-lg shadow-amber-500/20">
            <Database className="w-6 h-6 text-white" />
          </div>
          {t("dev.mock.title")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("dev.mock.description")}
        </p>
      </header>

      {/* Config */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("dev.mock.count", { count })}
          </label>
          <input
            type="range"
            min="1"
            max="50"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {t("dev.mock.fields")}
          </label>
          <div className="space-y-2">
            {fields.map((field) => (
              <div key={field.id} className="flex gap-2">
                <input
                  type="text"
                  value={field.name}
                  onChange={(e) =>
                    updateField(field.id, "name", e.target.value)
                  }
                  placeholder={t("dev.mock.fieldNamePlaceholder")}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                />
                <select
                  value={field.type}
                  onChange={(e) =>
                    updateField(field.id, "type", e.target.value)
                  }
                  className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                >
                  {fieldTypes.map((ft) => (
                    <option key={ft.value} value={ft.value}>
                      {ft.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => removeField(field.id)}
                  disabled={fields.length === 1}
                  className="p-2 text-gray-400 hover:text-red-600 disabled:opacity-30 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            <button
              onClick={addField}
              className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" /> {t("dev.mock.addField")}
            </button>
          </div>
        </div>

        <button
          onClick={generate}
          className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> {t("dev.mock.generate")}
        </button>
      </div>

      {/* Output */}
      {generatedData.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {t("dev.mock.generated")}
            </h3>
            <button
              onClick={downloadJson}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
            >
              <Download className="w-4 h-4" /> {t("dev.mock.download")}
            </button>
          </div>

          <pre className="px-4 py-3 bg-gray-900 dark:bg-black rounded-lg text-green-400 font-mono text-xs overflow-auto max-h-96">
            {JSON.stringify(generatedData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
