import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Copy,
  RefreshCw,
  ShieldCheck,
  Check,
  Shield,
  ShieldX,
} from "lucide-react";

export default function PasswordGenerator() {
  const { t } = useTranslation();
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [exclude, setExclude] = useState("");
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState(0);

  const calculateStrength = useCallback((pwd: string) => {
    let s = 0;
    if (pwd.length > 8) s++;
    if (pwd.length > 12) s++;
    if (/[A-Z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd)) s++;
    if (/[^A-Za-z0-9]/.test(pwd)) s++;
    return s;
  }, []);

  const generatePassword = useCallback(() => {
    const sets = {
      uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      lowercase: "abcdefghijklmnopqrstuvwxyz",
      numbers: "0123456789",
      symbols: "!@#$%^&*()_+~`|}{[]:;?><,./-=",
    };

    let charset = "";
    if (options.uppercase) charset += sets.uppercase;
    if (options.lowercase) charset += sets.lowercase;
    if (options.numbers) charset += sets.numbers;
    if (options.symbols) charset += sets.symbols;

    // Filter excluded characters
    if (exclude) {
      // Create a set of excluded characters for cleaner checking
      const excludedSet = new Set(exclude.split(""));
      charset = charset
        .split("")
        .filter((char) => !excludedSet.has(char))
        .join("");
    }

    if (charset === "") return;

    let newPassword = "";
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
      newPassword += charset[array[i] % charset.length];
    }

    setPassword(newPassword);
    setStrength(calculateStrength(newPassword));
  }, [length, options, exclude, calculateStrength]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrengthColor = (s: number) => {
    if (s <= 2) return "bg-red-500";
    if (s <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthLabel = (s: number) => {
    if (s <= 2) return "Weak";
    if (s <= 3) return "Medium";
    return "Strong";
  };

  const getStrengthIcon = (s: number) => {
    if (s <= 2) return <ShieldX className="w-5 h-5 text-red-500" />;
    if (s <= 3) return <Shield className="w-5 h-5 text-yellow-500" />;
    return <ShieldCheck className="w-5 h-5 text-green-500" />;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-indigo-500" />
          {t("password.title")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("password.description")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="md:col-span-1 space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex justify-between">
              {t("password.length")}
              <span className="text-indigo-600 font-bold">{length}</span>
            </label>
            <input
              type="range"
              min="4"
              max="64"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>

          <div className="space-y-3">
            {[
              ["uppercase", t("password.uppercase")],
              ["lowercase", t("password.lowercase")],
              ["numbers", t("password.numbers")],
              ["symbols", t("password.symbols")],
            ].map(([key, label]) => (
              <label
                key={key}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={options[key as keyof typeof options]}
                  onChange={(e) =>
                    setOptions({ ...options, [key]: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {label}
                </span>
              </label>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("password.exclude")}
            </label>
            <input
              type="text"
              value={exclude}
              onChange={(e) => setExclude(e.target.value)}
              placeholder={t("password.excludePlaceholder")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={generatePassword}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            {t("password.generate")}
          </button>
        </div>

        {/* Output */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-center min-h-[300px]">
            <div className="relative group">
              <div
                className="font-mono text-4xl md:text-5xl text-center text-gray-800 dark:text-gray-100 break-all cursor-pointer hover:text-indigo-600 transition-colors"
                onClick={handleCopy}
              >
                {password}
              </div>
              <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={handleCopy}
                  className="p-2 text-gray-500 hover:text-indigo-600 bg-gray-100 dark:bg-gray-700 rounded-lg"
                  title={t("password.copy")}
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="mt-8 flex justify-center items-center gap-3">
              {getStrengthIcon(strength)}
              <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${getStrengthColor(
                    strength
                  )}`}
                  style={{ width: `${(strength / 5) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {getStrengthLabel(strength)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
