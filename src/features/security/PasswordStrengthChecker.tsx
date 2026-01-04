import { useState, useEffect } from "react";
import { Shield, Check, X, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function PasswordStrengthChecker() {
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const [feedback, setFeedback] = useState<string[]>([]);
  // const [entropy, setEntropy] = useState(0); // Removed unused state

  const calculateStrength = (pwd: string) => {
    let score = 0;
    const checks = {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      numbers: /[0-9]/.test(pwd),
      symbols: /[^A-Za-z0-9]/.test(pwd),
      longLength: pwd.length >= 12,
      veryLong: pwd.length >= 16,
    };

    // Diversity Score
    let diversityScore = 0;
    if (checks.uppercase) diversityScore += 10;
    if (checks.lowercase) diversityScore += 10;
    if (checks.numbers) diversityScore += 10;
    if (checks.symbols) diversityScore += 10;

    // Length Score (capped for low entropy)
    let lengthScore = Math.min(pwd.length * 2, 40);

    // Entropy / Repetition Check
    const uniqueChars = new Set(pwd.split("")).size;
    const repetitionPenalty = pwd.length - uniqueChars;
    // Sequential Check (simple)
    const isSequential =
      "0123456789".includes(pwd) ||
      "abcdefghijklmnopqrstuvwxyz".includes(pwd.toLowerCase());

    if (diversityScore === 0) {
      score = 0;
    } else {
      score = diversityScore + lengthScore;
      // Penalize repetitions
      if (repetitionPenalty > pwd.length / 2) score -= 20;
      if (isSequential) score -= 30;
      // Penalize pure long strings of same type (e.g. all numbers)
      if (
        pwd.length > 10 &&
        ((checks.numbers && !checks.lowercase && !checks.uppercase) ||
          (checks.lowercase && !checks.numbers && !checks.uppercase))
      ) {
        score -= 20;
      }
    }

    score = Math.max(0, Math.min(100, score));

    const newFeedback: string[] = [];
    if (!checks.length) newFeedback.push(t("passwordChecker.feedback.min8"));
    if (!checks.uppercase)
      newFeedback.push(t("passwordChecker.feedback.uppercase"));
    if (!checks.lowercase)
      newFeedback.push(t("passwordChecker.feedback.lowercase"));
    if (!checks.numbers)
      newFeedback.push(t("passwordChecker.feedback.numbers"));
    if (!checks.symbols)
      newFeedback.push(t("passwordChecker.feedback.special"));
    if (!checks.longLength)
      newFeedback.push(t("passwordChecker.feedback.length"));
    if (repetitionPenalty > pwd.length / 2 || isSequential) {
      newFeedback.push(t("passwordChecker.feedback.repeats"));
    }

    setFeedback(newFeedback);
    return score;
  };

  useEffect(() => {
    if (password) {
      setStrength(calculateStrength(password));
    } else {
      setStrength(0);
      setFeedback([]);
    }
  }, [password]);

  const getStrengthLabel = () => {
    if (strength === 0)
      return { label: t("passwordChecker.enter"), color: "gray" };
    if (strength < 40)
      return { label: t("passwordChecker.strengths.weak"), color: "red" };
    if (strength < 70)
      return { label: t("passwordChecker.strengths.medium"), color: "orange" };
    if (strength < 90)
      return { label: t("passwordChecker.strengths.strong"), color: "green" };
    return {
      label: t("passwordChecker.strengths.veryStrong"),
      color: "emerald",
    };
  };

  const estimateCrackTime = () => {
    if (!password) return "N/A";
    const uniqueChars = new Set(password.split("")).size;
    let charsetSize = 0;
    if (/[a-z]/.test(password)) charsetSize += 26;
    if (/[A-Z]/.test(password)) charsetSize += 26;
    if (/[0-9]/.test(password)) charsetSize += 10;
    if (/[^A-Za-z0-9]/.test(password)) charsetSize += 32;

    // Adjust effective length based on uniqueness
    // Ideally effective length = length sometimes, but for "1111..." it's much lower.
    // Simplifying: If unique chars are very low relative to length, effective length is reduced.
    // const entropyBits = Math.log2(Math.pow(charsetSize, password.length)); // Removed unused var

    // Simple penalty for low uniqueness:
    // If unique chars < 50% of length, drastic reduction in effective "guesses"
    let combinations = Math.pow(charsetSize, password.length);

    if (uniqueChars < password.length / 2) {
      // Treat as if length is much shorter
      combinations = Math.pow(charsetSize, uniqueChars + 2);
    }

    const guessesPerSecond = 1e10; // Modern GPU cluster
    const seconds = combinations / guessesPerSecond;

    if (seconds < 1) return t("common.instantly", "Instantly");

    // We can use a simple formatter or t() helpers. For now formatting manually with basic English logic
    // but ideally should be localized properly.
    // Let's use simple logic for now.

    const r = (n: number) => Math.round(n);
    if (seconds < 60) return `${r(seconds)} s`;
    if (seconds < 3600) return `${r(seconds / 60)} m`;
    if (seconds < 86400) return `${r(seconds / 3600)} h`;
    if (seconds < 31536000) return `${r(seconds / 86400)} d`;

    const years = seconds / 31536000;
    if (years > 1000) return "> 1000 y"; // Cap it
    return `${r(years)} y`;
  };

  const strengthInfo = getStrengthLabel();

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6 animate-in fade-in duration-500 pb-24">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <div className="p-2 bg-green-600 rounded-lg shadow-lg shadow-green-500/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          {t("passwordChecker.title")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("passwordChecker.description")}
        </p>
      </header>

      {/* Input */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("passwordChecker.enter")}
          </label>
          <div className="relative">
            <input
              // Fixed duplicate type attribute
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("passwordChecker.placeholder")}
              className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Strength Bar */}
        {password && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("passwordChecker.strength")}:{" "}
                <span
                  className={`text-${strengthInfo.color}-600 dark:text-${strengthInfo.color}-400`}
                >
                  {strengthInfo.label}
                </span>
              </span>
              <span className="text-sm text-gray-500">{strength}%</span>
            </div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 bg-gradient-to-r ${
                  strength < 40
                    ? "from-red-500 to-red-600"
                    : strength < 70
                    ? "from-orange-500 to-amber-600"
                    : strength < 90
                    ? "from-green-500 to-emerald-600"
                    : "from-emerald-500 to-green-600"
                }`}
                style={{ width: `${strength}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      {password && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Criteria Checklist */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {t("passwordChecker.criteria")}
            </h3>
            <div className="space-y-3">
              {[
                {
                  check: password.length >= 8,
                  label: t("passwordChecker.chars8"),
                },
                {
                  check: password.length >= 12,
                  label: t("passwordChecker.chars12"),
                },
                {
                  check: /[A-Z]/.test(password),
                  label: t("passwordChecker.uppercase"),
                },
                {
                  check: /[a-z]/.test(password),
                  label: t("passwordChecker.lowercase"),
                },
                {
                  check: /[0-9]/.test(password),
                  label: t("passwordChecker.numbers"),
                },
                {
                  check: /[^A-Za-z0-9]/.test(password),
                  label: t("passwordChecker.special"),
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  {item.check ? (
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <X className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                  )}
                  <span
                    className={
                      item.check
                        ? "text-gray-900 dark:text-gray-100"
                        : "text-gray-400 dark:text-gray-600"
                    }
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {t("passwordChecker.info")}
              </h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600 dark:text-gray-400">
                    {t("passwordChecker.length")}
                  </dt>
                  <dd className="font-mono text-gray-900 dark:text-gray-100">
                    {password.length} chars
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600 dark:text-gray-400">
                    {t("passwordChecker.crackTime")}
                  </dt>
                  <dd className="font-mono text-gray-900 dark:text-gray-100">
                    {estimateCrackTime()}
                  </dd>
                </div>
              </dl>
            </div>

            {feedback.length > 0 && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  {t("passwordChecker.suggestions")}
                </h4>
                <ul className="space-y-1">
                  {feedback.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-gray-600 dark:text-gray-400"
                    >
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Help */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800 text-sm text-blue-900 dark:text-blue-200">
        <p className="font-semibold mb-2">💡 {t("passwordChecker.tips")}:</p>
        <ul className="space-y-1 text-xs">
          <li>• {t("passwordChecker.tipsList.mix")}</li>
          <li>• {t("passwordChecker.tipsList.length")}</li>
          <li>• {t("passwordChecker.tipsList.common")}</li>
          <li>• {t("passwordChecker.tipsList.passphrase")}</li>
          <li>• {t("passwordChecker.tipsList.unique")}</li>
        </ul>
      </div>
    </div>
  );
}
