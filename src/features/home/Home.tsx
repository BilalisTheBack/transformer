import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  FileJson,
  Image as ImageIcon,
  FileType,
  FileCode,
  ArrowRightLeft,
  Settings,
  Activity,
  Palette,
  QrCode,
  Square,
  Binary,
  Database,
  Terminal,
  FileText,
  Lock,
  Fingerprint,
  Link as LinkIcon,
  Code2,
  Share2,
  Regex,
  Globe,
  Eraser,
  FileSpreadsheet,
  CaseUpper,
  Wand2,
  ShieldAlert,
  Star,
  Clock,
} from "lucide-react";

import { useFavorites } from "../../hooks/useFavorites";
import { useRecentTools } from "../../hooks/useRecentTools";

export default function Home() {
  const { t } = useTranslation();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { recentTools, clearRecent } = useRecentTools();

  const sections = [
    {
      id: "converters",
      title: t("categories.converters"),
      tools: [
        {
          id: "json-csv",
          icon: FileJson,
          title: t("commands.json-csv"),
          path: "/json-csv",
          color: "from-orange-500 to-red-600",
        },
        {
          id: "json-ts",
          icon: FileCode,
          title: t("commands.json-ts"),
          path: "/json-ts",
          color: "from-blue-600 to-indigo-600",
        },
        {
          id: "config",
          icon: Settings,
          title: t("commands.config"),
          path: "/config",
          color: "from-gray-600 to-slate-700",
        },
        {
          id: "xml-json",
          icon: ArrowRightLeft,
          title: t("commands.xml-json"),
          path: "/xml-json",
          color: "from-orange-500 to-amber-600",
        },
        {
          id: "excel-csv",
          icon: FileSpreadsheet,
          title: t("commands.excel-csv"),
          path: "/excel-csv",
          color: "from-green-600 to-emerald-700",
        },
        {
          id: "curl",
          icon: Terminal,
          title: t("commands.curl"),
          path: "/curl",
          color: "from-green-600 to-emerald-700",
        },
      ],
    },
    {
      id: "media",
      title: t("categories.media"),
      tools: [
        {
          id: "img-conv",
          icon: ImageIcon,
          title: t("commands.img-conv"),
          path: "/image-converter",
          color: "from-purple-500 to-pink-600",
        },
        {
          id: "img-format",
          icon: FileType,
          title: t("commands.img-format"),
          path: "/img-format",
          color: "from-blue-500 to-cyan-600",
        },
        {
          id: "svg",
          icon: Code2,
          title: t("commands.svg"),
          path: "/svg",
          color: "from-amber-500 to-orange-600",
        },
        {
          id: "color",
          icon: Palette,
          title: t("commands.color"),
          path: "/color",
          color: "from-pink-500 to-rose-600",
        },
        {
          id: "ocr",
          icon: FileText,
          title: t("commands.ocr"),
          path: "/ocr",
          color: "from-neutral-600 to-neutral-800",
        },
        {
          id: "bg-remover",
          icon: Eraser,
          title: t("bgRemover.title"),
          path: "/bg-remover",
          color: "from-purple-600 to-indigo-600",
        },
        {
          id: "compress",
          icon: Share2,
          title: t("commands.compress"),
          path: "/compress",
          color: "from-pink-600 to-rose-600",
        },
        {
          id: "crop",
          icon: Eraser,
          title: t("commands.crop"),
          path: "/crop",
          color: "from-teal-600 to-emerald-600",
        },
        {
          id: "img-pdf",
          icon: FileText,
          title: t("commands.img-pdf"),
          path: "/img-pdf",
          color: "from-red-600 to-rose-600",
        },
        {
          id: "pdf-img",
          icon: ImageIcon,
          title: t("commands.pdf-img"),
          path: "/pdf-img",
          color: "from-orange-600 to-amber-600",
        },
        {
          id: "exif-cleaner",
          icon: ShieldAlert,
          title: t("commands.exif-cleaner"),
          path: "/exif-cleaner",
          color: "from-red-500 to-pink-600",
        },
      ],
    },
    {
      id: "text",
      title: t("categories.text"),
      tools: [
        {
          id: "text-md",
          icon: FileCode,
          title: t("commands.text-md"),
          path: "/markdown",
          color: "from-emerald-500 to-green-600",
        },
        {
          id: "text-diff",
          icon: ArrowRightLeft,
          title: t("commands.text-diff"),
          path: "/diff",
          color: "from-amber-500 to-yellow-600",
        },
        {
          id: "log-analyzer",
          icon: Activity,
          title: t("commands.log-analyzer"),
          path: "/log-analyzer",
          color: "from-rose-500 to-red-600",
        },
        {
          id: "lorem",
          icon: FileText,
          title: t("lorem.title"),
          path: "/lorem",
          color: "from-purple-500 to-indigo-600",
        },
      ],
    },
    {
      id: "developer",
      title: t("categories.developer"),
      tools: [
        {
          id: "jwt",
          icon: Lock,
          title: t("jwt.title"),
          path: "/jwt",
          color: "from-yellow-600 to-orange-700",
        },
        {
          id: "base64",
          icon: Binary,
          title: t("base64.title"),
          path: "/base64",
          color: "from-cyan-600 to-blue-700",
        },
        {
          id: "epoch",
          icon: Clock,
          title: t("epoch.title"),
          path: "/epoch",
          color: "from-violet-600 to-purple-700",
        },
        {
          id: "json-yaml",
          icon: FileJson,
          title: t("jsonYaml.title"),
          path: "/json-yaml",
          color: "from-teal-600 to-green-700",
        },
        {
          id: "sql",
          icon: Database,
          title: t("sql.title"),
          path: "/sql",
          color: "from-blue-700 to-indigo-800",
        },
        {
          id: "metadata",
          icon: Binary,
          title: t("metadata.title"),
          path: "/metadata",
          color: "from-fuchsia-600 to-purple-800",
        },
        {
          id: "seo",
          icon: Share2,
          title: t("seo.title"),
          path: "/seo",
          color: "from-indigo-600 to-cyan-600",
        },
        {
          id: "minifier",
          icon: Wand2,
          title: t("commands.minifier"),
          path: "/minifier",
          color: "from-cyan-600 to-sky-700",
        },
        {
          id: "validator",
          icon: FileJson,
          title: t("commands.validator"),
          path: "/json-validator",
          color: "from-green-600 to-teal-700",
        },
        {
          id: "beautifier",
          icon: Wand2,
          title: t("commands.beautifier"),
          path: "/beautifier",
          color: "from-fuchsia-600 to-pink-700",
        },
        {
          id: "text-case",
          icon: CaseUpper,
          title: t("commands.text-case"),
          path: "/text-case",
          color: "from-violet-600 to-indigo-700",
        },
        {
          id: "regex",
          icon: Regex,
          title: t("regex.title"),
          path: "/regex",
          color: "from-yellow-500 to-amber-600",
        },
        {
          id: "http-status",
          icon: Globe,
          title: t("commands.http-status"),
          path: "/http-status",
          color: "from-blue-500 to-indigo-600",
        },
        {
          id: "user-agent",
          icon: Globe,
          title: t("commands.user-agent"),
          path: "/user-agent",
          color: "from-cyan-500 to-teal-600",
        },
        {
          id: "cron-generator",
          icon: Clock,
          title: t("commands.cron-generator"),
          path: "/cron-generator",
          color: "from-emerald-500 to-green-600",
        },
        {
          id: "env-generator",
          icon: FileText,
          title: t("commands.env-generator"),
          path: "/env-generator",
          color: "from-slate-500 to-gray-600",
        },
        {
          id: "mock-data",
          icon: Database,
          title: t("commands.mock-data"),
          path: "/mock-data",
          color: "from-orange-500 to-red-600",
        },
      ],
    },
    {
      id: "security",
      title: t("categories.security"),
      tools: [
        {
          id: "hash",
          icon: Fingerprint,
          title: t("hash.title"),
          path: "/hash",
          color: "from-slate-600 to-zinc-700",
        },
        {
          id: "uuid",
          icon: Fingerprint,
          title: t("uuid.title"),
          path: "/uuid",
          color: "from-indigo-600 to-blue-700",
        },
        {
          id: "url",
          icon: LinkIcon,
          title: t("url.title"),
          path: "/url-encode",
          color: "from-sky-600 to-cyan-700",
        },
        {
          id: "fingerprint",
          icon: Fingerprint,
          title: t("fingerprint.title"),
          path: "/fingerprint",
          color: "from-rose-600 to-red-700",
        },
        {
          id: "password",
          icon: Lock,
          title: t("password.title"),
          path: "/password",
          color: "from-emerald-600 to-green-700",
        },
        {
          id: "password-strength",
          icon: Lock,
          title: t("commands.password-strength"),
          path: "/password-strength",
          color: "from-red-600 to-rose-700",
        },
        {
          id: "jwt-generator",
          icon: Lock,
          title: t("commands.jwt-generator"),
          path: "/jwt-generator",
          color: "from-orange-600 to-amber-700",
        },
        {
          id: "csrf-token",
          icon: Lock,
          title: t("commands.csrf-token"),
          path: "/csrf-token",
          color: "from-blue-600 to-indigo-700",
        },
        {
          id: "secure-key",
          icon: Lock,
          title: t("commands.secure-key"),
          path: "/secure-key",
          color: "from-purple-600 to-violet-700",
        },
        {
          id: "email-header",
          icon: Lock,
          title: t("commands.email-header"),
          path: "/email-header",
          color: "from-cyan-600 to-sky-700",
        },
        {
          id: "ip",
          icon: Globe,
          title: t("ip.title"),
          path: "/ip",
          color: "from-teal-500 to-cyan-600",
        },
      ],
    },
    {
      id: "visual",
      title: t("categories.visual"),
      tools: [
        {
          id: "palette",
          icon: Palette,
          title: t("colorPalette.title"),
          path: "/palette",
          color: "from-pink-500 to-rose-600",
        },
        {
          id: "qr",
          icon: QrCode,
          title: t("qrCode.title"),
          path: "/qr",
          color: "from-slate-700 to-gray-800",
        },
        {
          id: "box-shadow",
          icon: Square,
          title: t("boxShadow.title"),
          path: "/box-shadow",
          color: "from-indigo-500 to-purple-600",
        },
        {
          id: "gradient",
          icon: Palette,
          title: t("commands.gradient"),
          path: "/gradient",
          color: "from-orange-500 to-red-600",
        },
        {
          id: "glassmorphism",
          icon: Palette,
          title: t("commands.glassmorphism"),
          path: "/glassmorphism",
          color: "from-blue-500 to-cyan-600",
        },
        {
          id: "neumorphism",
          icon: Palette,
          title: t("commands.neumorphism"),
          path: "/neumorphism",
          color: "from-slate-500 to-gray-600",
        },
        {
          id: "clamp",
          icon: Code2,
          title: t("commands.clamp"),
          path: "/clamp",
          color: "from-green-500 to-emerald-600",
        },
        {
          id: "font-pairing",
          icon: FileText,
          title: t("commands.font-pairing"),
          path: "/font-pairing",
          color: "from-purple-500 to-violet-600",
        },
      ],
    },
    {
      id: "seo",
      title: t("categories.seo"),
      tools: [
        {
          id: "meta-tags",
          icon: Globe,
          title: t("commands.meta-tags"),
          path: "/meta-tags",
          color: "from-blue-500 to-indigo-600",
        },
        {
          id: "robots-txt",
          icon: FileText,
          title: t("commands.robots-txt"),
          path: "/robots-txt",
          color: "from-green-500 to-emerald-600",
        },
        {
          id: "sitemap",
          icon: Share2,
          title: t("commands.sitemap"),
          path: "/sitemap",
          color: "from-orange-500 to-amber-600",
        },
        {
          id: "page-speed",
          icon: Activity,
          title: t("commands.page-speed"),
          path: "/page-speed",
          color: "from-purple-500 to-pink-600",
        },
        {
          id: "seo-preview",
          icon: Globe,
          title: t("commands.seo-preview"),
          path: "/seo-preview",
          color: "from-cyan-500 to-sky-600",
        },
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24 animate-in fade-in duration-500">
      {/* Hero Section */}
      <div className="text-center space-y-8 pt-12">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 pb-2">
            The Transformer
          </h1>
          <p className="text-xl text-app-text-sub max-w-2xl mx-auto leading-relaxed">
            {t("home.subtitle")}
          </p>
        </div>

        {/* Search Helper */}
        <div
          onClick={() =>
            window.dispatchEvent(
              new KeyboardEvent("keydown", { key: "k", metaKey: true })
            )
          }
          className="inline-flex items-center gap-3 px-6 py-3 bg-app-panel border border-app-border rounded-full text-app-text-sub text-sm hover:border-app-primary/50 hover:shadow-lg hover:shadow-app-primary/10 transition-all cursor-pointer group"
        >
          <span>{t("common.press")}</span>
          <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border border-app-border bg-app-bg px-2 font-mono text-[10px] font-medium text-app-text-sub group-hover:border-app-primary/50 group-hover:text-app-text transition-colors">
            <span className="text-xs">⌘</span>K
          </kbd>
          <span>{t("common.to_search")}</span>
        </div>
      </div>

      {/* Favorites Section */}
      {recentTools.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-app-primary" />
              {t("recent_tools")}
            </h2>
            <button
              onClick={clearRecent}
              className="text-xs text-app-text-sub hover:text-red-400 transition-colors"
            >
              {t("clear")}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {sections
              .flatMap((s) => s.tools)
              .filter((tool) => recentTools.some((rt) => rt.path === tool.path))
              .slice(0, 10) // Limit to 10
              .map((tool) => (
                <Link
                  key={tool.id}
                  to={tool.path}
                  className="group relative flex flex-col p-6 bg-app-panel border border-app-border rounded-xl hover:border-app-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <tool.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-app-primary transition-colors">
                    {tool.title}
                  </h3>
                  <div className="mt-auto pt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs text-app-text-sub">
                      Launch Tool →
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(tool.id);
                      }}
                      className="p-1.5 hover:bg-app-bg rounded-lg transition-colors"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          isFavorite(tool.id)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-app-text-sub"
                        }`}
                      />
                    </button>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}

      {/* Tools Grid */}
      <div className="space-y-16">
        {sections.map((section) => (
          <div key={section.id} className="space-y-6">
            <div className="flex items-center gap-3 px-2">
              <div className="h-8 w-1 bg-app-primary rounded-full" />
              <h2 className="text-2xl font-bold tracking-tight">
                {section.title}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {section.tools.map((tool) => (
                <Link
                  key={tool.id}
                  to={tool.path}
                  className="group relative flex flex-col p-6 bg-app-panel border border-app-border rounded-xl hover:border-app-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 min-h-[160px]"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <tool.icon className="w-6 h-6" />
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(tool.id);
                      }}
                      className="p-2 hover:bg-app-bg rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          isFavorite(tool.id)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-app-text-sub hover:text-yellow-400"
                        }`}
                      />
                    </button>
                  </div>
                  <h3 className="text-lg font-semibold mt-auto group-hover:text-app-primary transition-colors">
                    {tool.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
