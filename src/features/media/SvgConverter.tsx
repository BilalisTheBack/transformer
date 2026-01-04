import React, { useState } from "react";
import { Activity, Copy, Check } from "lucide-react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

export default function SvgConverter() {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [componentName, setComponentName] = useState("Icon");
  const [typescript, setTypescript] = useState(true);

  const [copied, setCopied] = useState(false);

  const generateJsx = () => {
    if (!input.trim()) return "";

    let svgContent = input;

    // Simple cleanup: remove XML declaration
    svgContent = svgContent.replace(/<\?xml.*?\?>/g, "");
    // Remove comments
    svgContent = svgContent.replace(/<!--.*?-->/g, "");
    // Convert class to className
    svgContent = svgContent.replace(/class=/g, "className=");
    // Convert kebab-case attributes to camelCase (basic heuristic)
    svgContent = svgContent.replace(
      /([a-z]+)-([a-z]+)=/g,
      (_, p1, p2) => `${p1}${p2.charAt(0).toUpperCase() + p2.slice(1)}=`
    );

    const propsInterface = typescript
      ? `interface ${componentName}Props extends React.SVGProps<SVGSVGElement> {}\n\n`
      : "";
    const propsType = typescript ? `: ${componentName}Props` : "";

    return `${propsInterface}export default function ${componentName}(props${propsType}) {
  return (
    ${svgContent.trim().replace(/^<svg/, "<svg {...props}")}
  );
}`;
  };

  const output = React.useMemo(
    () => generateJsx(),
    [input, componentName, typescript]
  );

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <header>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          {t("media.svg.title")}
        </h1>
        <p className="text-neutral-400">{t("media.svg.description")}</p>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
        {/* Input */}
        <div className="flex flex-col bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800 bg-neutral-900/80">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-neutral-400">
                {t("media.svg.rawSvg")}
              </span>
              <div className="flex items-center gap-2 bg-neutral-800 rounded-lg p-1">
                <button
                  onClick={() => setTypescript(true)}
                  className={clsx(
                    "px-2 py-0.5 text-xs rounded transition-colors",
                    typescript
                      ? "bg-blue-600 text-white"
                      : "text-neutral-400 hover:text-white"
                  )}
                >
                  TSX
                </button>
                <button
                  onClick={() => setTypescript(false)}
                  className={clsx(
                    "px-2 py-0.5 text-xs rounded transition-colors",
                    !typescript
                      ? "bg-yellow-600 text-white"
                      : "text-neutral-400 hover:text-white"
                  )}
                >
                  JSX
                </button>
              </div>
            </div>

            <input
              type="text"
              value={componentName}
              onChange={(e) => setComponentName(e.target.value)}
              className="bg-neutral-950 border border-neutral-800 rounded px-2 py-1 text-xs text-neutral-300 w-32 focus:border-pink-500 outline-none transition-colors"
              placeholder={t("media.svg.componentName") as string}
            />
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent p-4 resize-none outline-none font-mono text-sm leading-relaxed text-neutral-100"
            placeholder="<svg ...>...</svg>"
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="flex flex-col bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden relative">
          <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800 bg-neutral-900/80">
            <span className="text-sm font-medium text-neutral-400">
              {t("media.svg.reactComponent")}
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
            className="flex-1 bg-transparent p-4 resize-none outline-none font-mono text-sm leading-relaxed text-pink-100"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
