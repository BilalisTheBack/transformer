import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Regex, Info, AlertTriangle } from "lucide-react";

export default function RegexTester() {
  const { t } = useTranslation();
  const [pattern, setPattern] = useState("\\w+@\\w+\\.\\w+");
  const [flags, setFlags] = useState({
    global: true,
    ignoreCase: true,
    multiline: false,
  });
  const [text, setText] = useState(
    "Contact us at support@example.com or sales@example.org for more info."
  );

  // Construct regex object safely
  const regex = useMemo(() => {
    try {
      let flagStr = "";
      if (flags.global) flagStr += "g";
      if (flags.ignoreCase) flagStr += "i";
      if (flags.multiline) flagStr += "m";
      return new RegExp(pattern, flagStr);
    } catch (e) {
      return null;
    }
  }, [pattern, flags]);

  // Find all matches
  const matches = useMemo(() => {
    if (!regex || !text) return [];
    const results = [];
    // Reset lastIndex if global is set, otherwise exec acts weird
    // but we re-create regex on change so it should be fine.
    // However, for non-global regex, exec only returns the first match repeatedly if we loop
    // so we handle that.

    if (!flags.global) {
      const match = regex.exec(text);
      if (match) results.push({ ...match, index: match.index, 0: match[0] });
      return results;
    }

    let match;
    // Prevent infinite loops with zero-width matches
    let lastIndex = 0;
    while ((match = regex.exec(text)) !== null) {
      results.push({ ...match, index: match.index, 0: match[0] });
      if (match.index === regex.lastIndex) {
        regex.lastIndex++; // Avoid infinite loop for zero-width assertions
      }
      if (regex.lastIndex === lastIndex && regex.lastIndex < text.length) {
        // Safety break if stuck
        regex.lastIndex++;
      }
      lastIndex = regex.lastIndex;
    }
    return results;
  }, [regex, text, flags.global]);

  // Generate highlighted segments
  const segments = useMemo(() => {
    if (!regex || matches.length === 0) return [{ text, isMatch: false }];

    const segs = [];
    let lastIdx = 0;

    matches.forEach((m) => {
      // Non-match part before
      if (m.index > lastIdx) {
        segs.push({ text: text.slice(lastIdx, m.index), isMatch: false });
      }
      // Match part
      segs.push({ text: m[0], isMatch: true });
      lastIdx = m.index + m[0].length;
    });

    // Remaining part
    if (lastIdx < text.length) {
      segs.push({ text: text.slice(lastIdx), isMatch: false });
    }

    return segs;
  }, [regex, matches, text]);

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-24">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Regex className="w-8 h-8 text-pink-500" />
          {t("regex.title", "Regex Tester")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
          {t(
            "regex.description",
            "Test and debug regular expressions in real-time."
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Input & Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pattern Input */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("regex.pattern", "Regular Expression Pattern")}
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-gray-400 font-mono text-lg">
                  /
                </span>
                <input
                  type="text"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  className={`w-full pl-6 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border ${
                    regex
                      ? "border-gray-300 dark:border-gray-600"
                      : "border-red-500 focus:ring-red-500"
                  } rounded-lg font-mono text-sm md:text-base focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all`}
                  placeholder="\w+"
                />
                {regex && (
                  <div className="absolute right-3 flex items-center gap-1">
                    {flags.global && (
                      <span className="text-xs font-mono text-pink-500 font-bold">
                        g
                      </span>
                    )}
                    {flags.ignoreCase && (
                      <span className="text-xs font-mono text-pink-500 font-bold">
                        i
                      </span>
                    )}
                    {flags.multiline && (
                      <span className="text-xs font-mono text-pink-500 font-bold">
                        m
                      </span>
                    )}
                  </div>
                )}
              </div>
              {!regex && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Invalid Regex
                </p>
              )}
            </div>

            {/* Flags */}
            <div className="flex flex-wrap gap-4">
              {[
                {
                  key: "global",
                  label: "Global (g)",
                  desc: "Find all matches",
                },
                {
                  key: "ignoreCase",
                  label: "Ignore Case (i)",
                  desc: "Case insensitive",
                },
                {
                  key: "multiline",
                  label: "Multiline (m)",
                  desc: "^ and $ match lines",
                },
              ].map((flag) => (
                <label
                  key={flag.key}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={flags[flag.key as keyof typeof flags]}
                      onChange={() =>
                        setFlags((f) => ({
                          ...f,
                          [flag.key]: !f[flag.key as keyof typeof flags],
                        }))
                      }
                      className="peer sr-only"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-pink-300 dark:peer-focus:ring-pink-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-pink-600"></div>
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-pink-600 transition-colors select-none">
                    {flag.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Test String Input */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("regex.testString", "Test String")}
              </label>
              <div className="text-xs text-gray-500">
                {matches.length}{" "}
                {matches.length === 1
                  ? t("regex.match", "Match")
                  : t("regex.matches", "Matches")}
              </div>
            </div>

            <div className="relative min-h-[200px] md:min-h-[300px]">
              {/* Backdrop for Highlighting (Behind textarea) */}
              <div className="absolute inset-0 p-3 font-mono text-sm md:text-base whitespace-pre-wrap break-words overflow-hidden pointer-events-none text-transparent leading-relaxed tracking-wide">
                {segments.map((seg, i) => (
                  <span
                    key={i}
                    className={
                      seg.isMatch
                        ? "bg-yellow-200/50 dark:bg-yellow-500/30 rounded-sm"
                        : ""
                    }
                  >
                    {seg.text}
                  </span>
                ))}
                {/* Extra char to match textarea height behavior */}
                <span>&nbsp;</span>
              </div>

              {/* Actual Input */}
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="absolute inset-0 w-full h-full p-3 bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg font-mono text-sm md:text-base leading-relaxed tracking-wide resize-none focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-gray-900 dark:text-gray-100"
                placeholder="Enter text to test..."
                spellCheck={false}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Match Details */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 h-full flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-500" />
              {t("regex.matchDetails", "Match Details")}
            </h3>

            <div className="flex-1 overflow-y-auto max-h-[500px] space-y-3 custom-scrollbar pr-2">
              {matches.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  {t("regex.noMatches", "No matches found.")}
                </div>
              ) : (
                matches.map((match, i) => (
                  <div
                    key={i}
                    className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700 text-sm"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-pink-600 dark:text-pink-400">
                        Match {i + 1}
                      </span>
                      <span className="text-xs text-gray-500 font-mono">
                        Index: {match.index}
                      </span>
                    </div>
                    <div className="font-mono bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700 overflow-x-auto text-gray-800 dark:text-gray-200 break-all">
                      {match[0]}
                    </div>
                    {/* Capture Groups */}
                    {match.length > 1 && (
                      <div className="mt-2 space-y-1">
                        <p className="text-xs text-gray-500 font-medium">
                          Capture Groups:
                        </p>
                        {Array.from(match)
                          .slice(1)
                          .map((group, groupIdx) => (
                            <div key={groupIdx} className="flex gap-2 text-xs">
                              <span className="text-gray-400 font-mono w-4 text-right">
                                {groupIdx + 1}:
                              </span>
                              <span className="font-mono text-gray-600 dark:text-gray-400 truncate">
                                {group}
                              </span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
