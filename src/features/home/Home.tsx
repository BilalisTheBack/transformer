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
  Clock,
  Database,
  Terminal,
  FileText,
  Lock,
  Fingerprint,
  Link as LinkIcon,
  Code2,
  Share2,
} from "lucide-react";

export default function Home() {
  const { t } = useTranslation();

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
          color: "from-red-600 to-rose-700",
        },
        {
          id: "uuid",
          icon: Fingerprint,
          title: t("uuid.title"),
          path: "/uuid",
          color: "from-indigo-600 to-violet-700",
        },
        {
          id: "url",
          icon: LinkIcon,
          title: t("url.title"),
          path: "/url-encode",
          color: "from-sky-600 to-blue-700",
        },
        {
          id: "fingerprint",
          icon: Fingerprint,
          title: t("fingerprint.title"),
          path: "/fingerprint",
          color: "from-rose-600 to-red-800",
        },
        {
          id: "password",
          icon: Lock,
          title: t("password.title"),
          path: "/password",
          color: "from-indigo-600 to-purple-700",
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
          color: "from-slate-700 to-black",
        },
        {
          id: "box-shadow",
          icon: Square,
          title: t("boxShadow.title"),
          path: "/box-shadow",
          color: "from-indigo-500 to-violet-600",
        },
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center pt-12 space-y-6">
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-app-text to-app-text-passive bg-clip-text text-transparent">
          The Transformer
        </h1>
        <p className="text-xl text-app-text-sub max-w-2xl mx-auto leading-relaxed">
          {t("welcome")}
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-app-panel border border-app-border rounded-full text-sm text-app-text-sub font-medium">
          <span>{t("common.press")}</span>
          <kbd className="px-2 py-0.5 bg-app-bg border border-app-border rounded text-app-text font-sans text-xs">
            Ctrl + K
          </kbd>
          <span>{t("common.to_search")}</span>
        </div>
      </div>

      <div className="space-y-12">
        {sections.map((section) => (
          <div key={section.id} className="space-y-6">
            <h2 className="text-2xl font-bold text-app-text flex items-center gap-3 border-b border-app-border pb-2">
              <span className="w-2 h-8 bg-app-primary rounded-full"></span>
              {section.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {section.tools.map((tool) => (
                <Link
                  key={tool.id}
                  to={tool.path}
                  className="group relative p-6 bg-app-panel border border-app-border rounded-2xl hover:border-app-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-app-primary/5 hover:-translate-y-1"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <tool.icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-lg font-semibold text-app-text mb-2 group-hover:text-app-primary transition-colors">
                    {tool.title}
                  </h3>

                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                    <ArrowRightLeft className="w-5 h-5 text-app-text-mute" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Settings Section (Moved to Bottom) */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-app-text flex items-center gap-3 border-b border-app-border pb-2">
            <span className="w-2 h-8 bg-slate-500 rounded-full"></span>
            {t("categories.settings")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              to="/settings"
              className="group relative p-6 bg-app-panel border border-app-border rounded-2xl hover:border-app-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-app-primary/5 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-app-text mb-2 group-hover:text-app-primary transition-colors">
                {t("commands.settings")}
              </h3>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
