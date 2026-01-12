import { useState, useEffect } from "react";
import { Shield, Copy, Check } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PermissionGroup {
  read: boolean;
  write: boolean;
  execute: boolean;
}

export default function ChmodCalculator() {
  const { t } = useTranslation();
  const [owner, setOwner] = useState<PermissionGroup>({
    read: true,
    write: true,
    execute: false,
  });
  const [group, setGroup] = useState<PermissionGroup>({
    read: true,
    write: false,
    execute: false,
  });
  const [public_, setPublic] = useState<PermissionGroup>({
    read: true,
    write: false,
    execute: false,
  });
  const [octal, setOctal] = useState("644");
  const [symbolic, setSymbolic] = useState("-rw-r--r--");
  const [copied, setCopied] = useState(false);

  const calculate = () => {
    const calcGroup = (p: PermissionGroup) => {
      let val = 0;
      if (p.read) val += 4;
      if (p.write) val += 2;
      if (p.execute) val += 1;
      return val;
    };

    const calcSym = (p: PermissionGroup) => {
      return (
        (p.read ? "r" : "-") + (p.write ? "w" : "-") + (p.execute ? "x" : "-")
      );
    };

    const o = calcGroup(owner);
    const g = calcGroup(group);
    const p = calcGroup(public_);

    setOctal(`${o}${g}${p}`);
    setSymbolic(`-${calcSym(owner)}${calcSym(group)}${calcSym(public_)}`);
  };

  useEffect(() => {
    calculate();
  }, [owner, group, public_]);

  const handleCopy = () => {
    navigator.clipboard.writeText(`chmod ${octal}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const PermissionToggle = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: PermissionGroup;
    onChange: (v: PermissionGroup) => void;
  }) => (
    <div className="p-4 bg-app-bg/50 border border-app-border rounded-xl space-y-4">
      <h3 className="font-semibold text-app-text-sub flex items-center gap-2">
        <Shield className="w-4 h-4" />
        {label}
      </h3>
      <div className="grid grid-cols-3 gap-2">
        {["read", "write", "execute"].map((type) => (
          <button
            key={type}
            onClick={() =>
              onChange({
                ...value,
                [type]: !value[type as keyof PermissionGroup],
              })
            }
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border ${
              value[type as keyof PermissionGroup]
                ? "bg-app-primary/20 border-app-primary text-app-primary shadow-lg shadow-app-primary/10"
                : "bg-app-panel border-app-border text-app-text-passive hover:text-app-text-sub"
            }`}
          >
            {type.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter premium-gradient">
          {t("chmod.title", "Chmod Calculator")}
        </h1>
        <p className="text-app-text-sub">
          {t("chmod.subtitle", "Visually calculate Unix file permissions")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PermissionToggle
          label={t("chmod.owner", "Owner")}
          value={owner}
          onChange={setOwner}
        />
        <PermissionToggle
          label={t("chmod.group", "Group")}
          value={group}
          onChange={setGroup}
        />
        <PermissionToggle
          label={t("chmod.others", "Others")}
          value={public_}
          onChange={setPublic}
        />
      </div>

      <div className="bg-app-panel border border-app-border rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="text-sm font-bold text-app-text-sub uppercase tracking-widest">
              Octal Result
            </label>
            <div className="flex items-center gap-4">
              <div className="text-6xl md:text-8xl font-black font-mono tracking-tighter premium-gradient">
                {octal}
              </div>
              <button
                onClick={handleCopy}
                className="p-4 bg-app-bg border border-app-border rounded-xl hover:border-app-primary/50 transition-all group"
              >
                {copied ? (
                  <Check className="w-6 h-6 text-green-500" />
                ) : (
                  <Copy className="w-6 h-6 text-app-text-sub group-hover:text-app-primary" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-4 flex flex-col justify-center">
            <div className="space-y-1">
              <label className="text-sm font-bold text-app-text-sub uppercase tracking-widest">
                Symbolic Notation
              </label>
              <div className="text-2xl font-mono font-bold text-app-primary bg-app-primary/5 px-4 py-2 rounded-lg border border-app-primary/20 inline-block">
                {symbolic}
              </div>
            </div>
            <div className="p-4 bg-app-bg/50 border border-app-border rounded-xl">
              <code className="text-sm text-app-text-sub">
                $ chmod {octal} filename
              </code>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-app-panel border border-app-border rounded-xl space-y-4">
          <h3 className="font-bold flex items-center gap-2">
            <Shield className="w-5 h-5 text-app-primary" />
            Common Permissions
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              {
                label: "755 (Exec)",
                val: {
                  r: true,
                  w: true,
                  x: true,
                  gr: true,
                  gx: true,
                  pr: true,
                  px: true,
                },
              },
              {
                label: "644 (File)",
                val: {
                  r: true,
                  w: true,
                  x: false,
                  gr: true,
                  gx: false,
                  pr: true,
                  px: false,
                },
              },
              {
                label: "700 (Private)",
                val: {
                  r: true,
                  w: true,
                  x: true,
                  gr: false,
                  gx: false,
                  pr: false,
                  px: false,
                },
              },
              {
                label: "777 (Public)",
                val: {
                  r: true,
                  w: true,
                  x: true,
                  gr: true,
                  gx: true,
                  pr: true,
                  px: true,
                },
              },
            ].map((p) => (
              <button
                key={p.label}
                onClick={() => {
                  setOwner({
                    read: true,
                    write: true,
                    execute:
                      p.label.includes("Exec") ||
                      p.label.includes("777") ||
                      p.label.includes("700"),
                  });
                  setGroup({
                    read: p.label !== "700 (Private)",
                    write: p.label === "777 (Public)",
                    execute:
                      p.label === "755 (Exec)" || p.label === "777 (Public)",
                  });
                  setPublic({
                    read: p.label !== "700 (Private)",
                    write: p.label === "777 (Public)",
                    execute:
                      p.label === "755 (Exec)" || p.label === "777 (Public)",
                  });
                }}
                className="py-2 px-3 bg-app-bg border border-app-border rounded-lg text-xs hover:border-app-primary/50 transition-all text-app-text-sub"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 bg-app-panel border border-app-border rounded-xl space-y-2">
          <h3 className="font-bold">What is Chmod?</h3>
          <p className="text-sm text-app-text-sub leading-relaxed">
            The chmod command is used to change the access mode of a file. The
            name is an abbreviation of change mode. It controls who can read,
            write, or execute a file or directory.
          </p>
        </div>
      </div>
    </div>
  );
}
