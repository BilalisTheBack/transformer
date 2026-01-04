import { useState } from "react";
import { Type, Copy, Check } from "lucide-react";

interface FontPair {
  name: string;
  heading: string;
  body: string;
  headingWeight: string;
  bodyWeight: string;
}

const FONT_PAIRS: FontPair[] = [
  {
    name: "Modern Sans",
    heading: "Inter",
    body: "Inter",
    headingWeight: "700",
    bodyWeight: "400",
  },
  {
    name: "Classic Serif",
    heading: "Playfair Display",
    body: "Source Sans Pro",
    headingWeight: "700",
    bodyWeight: "400",
  },
  {
    name: "Tech Mono",
    heading: "Space Mono",
    body: "Roboto",
    headingWeight: "700",
    bodyWeight: "400",
  },
  {
    name: "Editorial",
    heading: "Libre Baskerville",
    body: "Open Sans",
    headingWeight: "700",
    bodyWeight: "400",
  },
  {
    name: "Minimal",
    heading: "Poppins",
    body: "Poppins",
    headingWeight: "600",
    bodyWeight: "400",
  },
  {
    name: "Elegant",
    heading: "Cormorant Garamond",
    body: "Proza Libre",
    headingWeight: "600",
    bodyWeight: "400",
  },
  {
    name: "Bold & Clean",
    heading: "Montserrat",
    body: "Lato",
    headingWeight: "700",
    bodyWeight: "400",
  },
  {
    name: "Soft & Friendly",
    heading: "Quicksand",
    body: "Nunito",
    headingWeight: "600",
    bodyWeight: "400",
  },
];

export default function FontPairingTool() {
  const [selectedPair, setSelectedPair] = useState(FONT_PAIRS[0]);
  const [copied, setCopied] = useState(false);

  const generateHTML = () => {
    return `<!-- Add to <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=${selectedPair.heading.replace(
      / /g,
      "+"
    )}:wght@${selectedPair.headingWeight}&family=${selectedPair.body.replace(
      / /g,
      "+"
    )}:wght@${selectedPair.bodyWeight}&display=swap" rel="stylesheet">`;
  };

  const generateCSS = () => {
    return `/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-family: '${selectedPair.heading}', serif;
  font-weight: ${selectedPair.headingWeight};
}

body, p, a, span {
  font-family: '${selectedPair.body}', sans-serif;
  font-weight: ${selectedPair.bodyWeight};
}`;
  };

  const copyCombined = () => {
    navigator.clipboard.writeText(generateHTML() + "\n\n" + generateCSS());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6 animate-in fade-in duration-500 pb-24">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg shadow-lg">
            <Type className="w-6 h-6 text-white" />
          </div>
          Font Pairing Tool
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover perfect font combinations for your projects
        </p>
      </header>

      {/* Font Pairs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {FONT_PAIRS.map((pair) => (
          <button
            key={pair.name}
            onClick={() => setSelectedPair(pair)}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              selectedPair.name === pair.name
                ? "border-pink-600 bg-pink-50 dark:bg-pink-900/20"
                : "border-gray-200 dark:border-gray-700 hover:border-pink-400 dark:hover:border-pink-600 bg-white dark:bg-gray-800"
            }`}
          >
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              {pair.name}
            </p>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {pair.heading}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {pair.body}
            </p>
          </button>
        ))}
      </div>

      {/* Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
        <link
          href={`https://fonts.googleapis.com/css2?family=${selectedPair.heading.replace(
            / /g,
            "+"
          )}:wght@${
            selectedPair.headingWeight
          }&family=${selectedPair.body.replace(/ /g, "+")}:wght@${
            selectedPair.bodyWeight
          }&display=swap`}
          rel="stylesheet"
        />

        <h1
          className="text-5xl mb-4 text-gray-900 dark:text-gray-100"
          style={{
            fontFamily: `'${selectedPair.heading}', serif`,
            fontWeight: selectedPair.headingWeight,
          }}
        >
          The Quick Brown Fox
        </h1>
        <h2
          className="text-3xl mb-4 text-gray-800 dark:text-gray-200"
          style={{
            fontFamily: `'${selectedPair.heading}', serif`,
            fontWeight: selectedPair.headingWeight,
          }}
        >
          Jumps Over The Lazy Dog
        </h2>
        <p
          className="text-lg leading-relaxed text-gray-700 dark:text-gray-300"
          style={{
            fontFamily: `'${selectedPair.body}', sans-serif`,
            fontWeight: selectedPair.bodyWeight,
          }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris.
        </p>
      </div>

      {/* Code Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            HTML (Google Fonts)
          </h3>
          <pre className="px-3 py-2 bg-gray-900 dark:bg-black rounded text-green-400 font-mono text-xs overflow-x-auto whitespace-pre-wrap">
            {generateHTML()}
          </pre>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            CSS
          </h3>
          <pre className="px-3 py-2 bg-gray-900 dark:bg-black rounded text-green-400 font-mono text-xs overflow-x-auto whitespace-pre-wrap">
            {generateCSS()}
          </pre>
        </div>
      </div>

      <button
        onClick={copyCombined}
        className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-medium shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 transition-colors"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        Copy HTML + CSS
      </button>
    </div>
  );
}
