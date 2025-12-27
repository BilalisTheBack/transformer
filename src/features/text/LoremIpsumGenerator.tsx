import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Copy, RefreshCw, FileText, Check } from "lucide-react";

const LOREM_WORDS = [
  "lorem",
  "ipsum",
  "dolor",
  "sit",
  "amet",
  "consectetur",
  "adipiscing",
  "elit",
  "sed",
  "do",
  "eiusmod",
  "tempor",
  "incididunt",
  "ut",
  "labore",
  "et",
  "dolore",
  "magna",
  "aliqua",
  "enim",
  "ad",
  "minim",
  "veniam",
  "quis",
  "nostrud",
  "exercitation",
  "ullamco",
  "laboris",
  "nisi",
  "aliquip",
  "ex",
  "ea",
  "commodo",
  "consequat",
  "duis",
  "aute",
  "irure",
  "in",
  "reprehenderit",
  "voluptate",
  "velit",
  "esse",
  "cillum",
  "fugiat",
  "nulla",
  "pariatur",
  "excepteur",
  "sint",
  "occaecat",
  "cupidatat",
  "non",
  "proident",
  "sunt",
  "culpa",
  "qui",
  "officia",
  "deserunt",
  "mollit",
  "anim",
  "id",
  "est",
  "laborum",
];

export default function LoremIpsumGenerator() {
  const { t } = useTranslation();
  const [count, setCount] = useState(3);
  const [type, setType] = useState<"paragraphs" | "sentences" | "words">(
    "paragraphs"
  );
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const getRandomWord = useCallback(() => {
    return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
  }, []);

  const generateSentence = useCallback(
    (wordCount: number) => {
      const words: string[] = [];
      for (let i = 0; i < wordCount; i++) {
        words.push(getRandomWord());
      }
      // Capitalize first letter
      words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
      return words.join(" ") + ".";
    },
    [getRandomWord]
  );

  const generateParagraph = useCallback(
    (sentenceCount: number) => {
      const sentences: string[] = [];
      for (let i = 0; i < sentenceCount; i++) {
        const wordCount = Math.floor(Math.random() * 10) + 5; // 5-14 words per sentence
        sentences.push(generateSentence(wordCount));
      }
      return sentences.join(" ");
    },
    [generateSentence]
  );

  const generateText = useCallback(() => {
    let result = "";

    if (type === "words") {
      const words: string[] = [];
      if (startWithLorem && count >= 2) {
        words.push("Lorem", "ipsum");
        for (let i = 2; i < count; i++) {
          words.push(getRandomWord());
        }
      } else {
        for (let i = 0; i < count; i++) {
          words.push(getRandomWord());
        }
      }
      result = words.join(" ") + ".";
    } else if (type === "sentences") {
      const sentences: string[] = [];
      for (let i = 0; i < count; i++) {
        const wordCount = Math.floor(Math.random() * 10) + 5;
        if (i === 0 && startWithLorem) {
          sentences.push(
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          );
        } else {
          sentences.push(generateSentence(wordCount));
        }
      }
      result = sentences.join(" ");
    } else {
      // paragraphs
      const paragraphs: string[] = [];
      for (let i = 0; i < count; i++) {
        const sentenceCount = Math.floor(Math.random() * 4) + 3; // 3-6 sentences per paragraph
        if (i === 0 && startWithLorem) {
          paragraphs.push(
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " +
              generateParagraph(sentenceCount - 1)
          );
        } else {
          paragraphs.push(generateParagraph(sentenceCount));
        }
      }
      result = paragraphs.join("\n\n");
    }

    setText(result);
  }, [
    count,
    type,
    startWithLorem,
    getRandomWord,
    generateSentence,
    generateParagraph,
  ]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <FileText className="w-8 h-8 text-purple-500" />
          {t("lorem.title")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("lorem.description")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Controls */}
        <div className="md:col-span-1 space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("lorem.count")}
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("lorem.type")}
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="paragraphs">{t("lorem.paragraphs")}</option>
              <option value="sentences">{t("lorem.sentences")}</option>
              <option value="words">{t("lorem.words")}</option>
            </select>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={startWithLorem}
              onChange={(e) => setStartWithLorem(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {t("lorem.startWith")}
            </span>
          </label>

          <button
            onClick={generateText}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            {t("lorem.generate")}
          </button>
        </div>

        {/* Output */}
        <div className="md:col-span-3">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Generated Text
              </h3>
              <button
                onClick={handleCopy}
                disabled={!text}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    {t("lorem.copied")}
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    {t("lorem.copy")}
                  </>
                )}
              </button>
            </div>
            <div className="min-h-[400px] max-h-[600px] overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              {text ? (
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {text}
                </p>
              ) : (
                <p className="text-gray-400 dark:text-gray-500 italic text-center">
                  Click generate to create Lorem Ipsum text...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
