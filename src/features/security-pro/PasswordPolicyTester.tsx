import { useState, useMemo } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Settings2,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface PolicyRequirement {
  id: string;
  label: string;
  test: (pw: string) => boolean;
}

export default function PasswordPolicyTester() {
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [policy, setPolicy] = useState({
    minLength: 12,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecial: true,
  });

  const requirements: PolicyRequirement[] = [
    {
      id: "length",
      label: `${t("securityPro.passwordPolicy.minLength")}: ${
        policy.minLength
      }`,
      test: (pw) => pw.length >= policy.minLength,
    },
    {
      id: "upper",
      label: t("securityPro.passwordPolicy.requireUpper"),
      test: (pw) => /[A-Z]/.test(pw),
    },
    {
      id: "lower",
      label: "Lowercase letters",
      test: (pw) => /[a-z]/.test(pw),
    },
    {
      id: "number",
      label: t("securityPro.passwordPolicy.requireNumbers"),
      test: (pw) => /\d/.test(pw),
    },
    {
      id: "special",
      label: t("securityPro.passwordPolicy.requireSpecial"),
      test: (pw) => /[!@#$%^&*(),.?":{}|<>]/.test(pw),
    },
  ];

  const results = useMemo(() => {
    return requirements.map((req) => ({
      ...req,
      met: req.test(password),
    }));
  }, [password, policy]);

  const strength = useMemo(() => {
    const metCount = results.filter((r) => r.met).length;
    const total = results.length;
    if (metCount === total)
      return {
        label: "Exceptional",
        color: "bg-green-500",
        text: "text-green-500",
      };
    if (metCount >= 3)
      return { label: "Good", color: "bg-yellow-500", text: "text-yellow-500" };
    return { label: "Weak", color: "bg-red-500", text: "text-red-500" };
  }, [results]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <div className="p-2 bg-slate-600 rounded-lg shadow-lg shadow-slate-500/20">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <span className="gradient-text-optimized">
            {t("securityPro.passwordPolicy.title")}
          </span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("securityPro.passwordPolicy.description")}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Settings Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-app-panel border border-app-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-app-primary" />
              {t("securityPro.passwordPolicy.config")}
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-app-text-sub mb-3 flex items-center justify-between">
                  {t("securityPro.passwordPolicy.minLength")}
                  <span className="text-app-primary font-bold">
                    {policy.minLength}
                  </span>
                </label>
                <input
                  type="range"
                  min="4"
                  max="32"
                  value={policy.minLength}
                  onChange={(e) =>
                    setPolicy({
                      ...policy,
                      minLength: parseInt(e.target.value),
                    })
                  }
                  className="w-full h-2 bg-app-bg rounded-lg appearance-none cursor-pointer accent-app-primary"
                />
              </div>

              {[
                {
                  id: "requireUppercase",
                  label: t("securityPro.passwordPolicy.requireUpper"),
                },
                {
                  id: "requireNumbers",
                  label: t("securityPro.passwordPolicy.requireNumbers"),
                },
                {
                  id: "requireSpecial",
                  label: t("securityPro.passwordPolicy.requireSpecial"),
                },
              ].map((field) => (
                <label
                  key={field.id}
                  className="flex items-center justify-between cursor-pointer group"
                >
                  <span className="text-sm font-medium text-app-text-sub group-hover:text-app-text transition-colors">
                    {field.label}
                  </span>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={(policy as any)[field.id]}
                      onChange={(e) =>
                        setPolicy({ ...policy, [field.id]: e.target.checked })
                      }
                    />
                    <div className="w-11 h-6 bg-app-bg rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border border-app-border peer-checked:bg-app-primary"></div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-app-panel border border-app-border rounded-2xl p-6 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Lightbulb className="w-12 h-12" />
            </div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              {t("securityPro.passwordPolicy.tips")}
            </h3>
            <p className="text-sm text-app-text-sub leading-relaxed">
              {t("securityPro.passwordPolicy.tipsDesc")}
            </p>
          </div>
        </div>

        {/* Tester Panel */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-app-panel border border-app-border rounded-2xl p-8 space-y-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-app-primary/5 via-transparent to-transparent pointer-events-none" />

            <div className="flex flex-col space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("securityPro.passwordPolicy.placeholder")}
                  className="w-full bg-app-bg border-2 border-app-border rounded-2xl px-6 py-4 text-xl font-mono focus:ring-4 focus:ring-app-primary/20 focus:border-app-primary outline-none transition-all placeholder:text-app-text-passive"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-app-border rounded-xl transition-colors text-app-text-sub"
                >
                  {showPassword ? (
                    <EyeOff className="w-6 h-6" />
                  ) : (
                    <Eye className="w-6 h-6" />
                  )}
                </button>
              </div>

              {/* Strength Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold flex items-center gap-2">
                    {t("securityPro.passwordPolicy.compliance")}:{" "}
                    <span className={`${strength.text}`}>{strength.label}</span>
                  </span>
                  <span className="text-app-text-sub">
                    {password.length} chars
                  </span>
                </div>
                <div className="h-3 w-full bg-app-bg rounded-full overflow-hidden border border-app-border">
                  <div
                    className={`h-full ${strength.color} transition-all duration-500 shadow-[0_0_15px_rgba(var(--app-primary-rgb),0.3)]`}
                    style={{
                      width: `${
                        (results.filter((r) => r.met).length / results.length) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {results.map((res) => (
                <div
                  key={res.id}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                    res.met
                      ? "bg-green-500/5 border-green-500/20 text-green-500"
                      : "bg-app-bg border-app-border text-app-text-sub"
                  }`}
                >
                  {res.met ? (
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 shrink-0 opacity-20" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      res.met ? "" : "opacity-80"
                    }`}
                  >
                    {res.label}
                  </span>
                </div>
              ))}
            </div>

            {!password && (
              <div className="p-4 bg-app-bg/50 border border-app-border border-dashed rounded-xl text-center mt-4">
                <p className="text-sm text-app-text-sub">
                  {t("securityPro.passwordPolicy.readyDesc")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
