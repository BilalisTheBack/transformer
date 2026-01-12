import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Search,
  Command,
  X,
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
  Regex,
  Globe,
  Eraser,
  Archive,
  Crop as CropIcon,
  FileSpreadsheet,
  CaseUpper,
  Wand2,
  Zap,
  ShieldAlert,
  Info,
  Smartphone,
  Eye,
  Key,
  Mail,
  GitMerge,
  Gauge,
  FileKey,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
}: CommandPaletteProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const sections = [
    {
      id: "converters",
      title: t("categories.converters"),
      items: [
        {
          id: "json-csv",
          label: t("commands.json-csv"),
          path: "/json-csv",
          icon: FileJson,
          keywords: ["excel", "data", "sheet", "table"],
        },
        {
          id: "json-ts",
          label: t("commands.json-ts"),
          path: "/json-ts",
          icon: FileCode,
        },
        {
          id: "config",
          label: t("commands.config"),
          path: "/config",
          icon: Settings,
        },
        {
          id: "curl",
          label: t("commands.curl"),
          path: "/curl",
          icon: Terminal,
        },
        {
          id: "xml-json",
          label: t("commands.xml-json"),
          path: "/xml-json",
          icon: ArrowRightLeft,
        },
        {
          id: "excel-csv",
          label: t("commands.excel-csv"),
          path: "/excel-csv",
          icon: FileSpreadsheet,
        },
      ],
    },
    {
      id: "media",
      title: t("categories.media"),
      items: [
        {
          id: "img-conv",
          label: t("commands.img-conv"),
          path: "/image-converter",
          icon: ImageIcon,
          keywords: ["photo", "picture", "resize", "crop"],
        },
        {
          id: "img-format",
          label: t("commands.img-format"),
          path: "/img-format",
          icon: FileType,
        },
        { id: "svg", label: t("commands.svg"), path: "/svg", icon: Code2 },
        {
          id: "color",
          label: t("commands.color"),
          path: "/color",
          icon: Palette,
        },
        { id: "ocr", label: t("commands.ocr"), path: "/ocr", icon: FileText },
        {
          id: "bg-remover",
          label: t("bgRemover.title"),
          path: "/bg-remover",
          icon: Eraser,
        },
        {
          id: "compress",
          label: t("commands.compress"),
          path: "/compress",
          icon: Archive,
        },
        {
          id: "crop",
          label: t("commands.crop"),
          path: "/crop",
          icon: CropIcon,
        },
        {
          id: "img-pdf",
          label: t("commands.img-pdf"),
          path: "/img-pdf",
          icon: FileText,
        },
        {
          id: "pdf-img",
          label: t("commands.pdf-img"),
          path: "/pdf-img",
          icon: ImageIcon,
        },
        {
          id: "exif-cleaner",
          label: t("commands.exif-cleaner"),
          path: "/exif-cleaner",
          icon: ShieldAlert,
        },
      ],
    },
    {
      id: "text",
      title: t("categories.text"),
      items: [
        {
          id: "text-md",
          label: t("commands.text-md"),
          path: "/markdown",
          icon: FileCode,
        },
        {
          id: "text-diff",
          label: t("commands.text-diff"),
          path: "/diff",
          icon: ArrowRightLeft,
        },
        {
          id: "log-analyzer",
          label: t("commands.log-analyzer"),
          path: "/log-analyzer",
          icon: Activity,
        },
        {
          id: "lorem",
          label: t("lorem.title"),
          path: "/lorem",
          icon: FileText,
        },
      ],
    },
    {
      id: "developer",
      title: t("categories.developer"),
      items: [
        { id: "jwt", label: t("jwt.title"), path: "/jwt", icon: Lock },
        {
          id: "base64",
          label: t("base64.title"),
          path: "/base64",
          icon: Binary,
        },
        {
          id: "epoch",
          label: t("epoch.title"),
          path: "/epoch",
          icon: Clock,
          keywords: ["unix", "timestamp", "time", "date"],
        },
        {
          id: "json-yaml",
          label: t("jsonYaml.title"),
          path: "/json-yaml",
          icon: FileJson,
        },
        {
          id: "sql",
          label: t("sql.title"),
          path: "/sql",
          icon: Database,
          keywords: ["db", "database", "query", "format", "beautifier"],
        },
        {
          id: "metadata",
          label: t("metadata.title"),
          path: "/metadata",
          icon: Binary,
        },
        {
          id: "seo",
          label: t("seo.title"),
          path: "/seo",
          icon: Share2,
        },
        {
          id: "minifier",
          label: t("commands.minifier"),
          path: "/minifier",
          icon: Zap,
        },
        {
          id: "validator",
          label: t("commands.validator"),
          path: "/json-validator",
          icon: FileJson,
        },
        {
          id: "beautifier",
          label: t("commands.beautifier"),
          path: "/beautifier",
          icon: Wand2,
        },
        {
          id: "text-case",
          label: t("commands.text-case"),
          path: "/text-case",
          icon: CaseUpper,
        },
        {
          id: "regex",
          label: t("regex.title"),
          path: "/regex",
          icon: Regex,
        },
        {
          id: "http-status",
          label: t("commands.http-status"),
          path: "/http-status",
          icon: Info,
        },
        {
          id: "user-agent",
          label: t("commands.user-agent"),
          path: "/user-agent",
          icon: Smartphone,
        },
        {
          id: "cron-generator",
          label: t("commands.cron-generator"),
          path: "/cron-generator",
          icon: Clock,
        },
        {
          id: "env-generator",
          label: t("commands.env-generator"),
          path: "/env-generator",
          icon: FileText,
        },
        {
          id: "mock-data",
          label: t("commands.mock-data"),
          path: "/mock-data",
          icon: Database,
        },
      ],
    },
    {
      id: "security",
      title: t("categories.security"),
      items: [
        {
          id: "hash",
          label: t("hash.title"),
          path: "/hash",
          icon: Fingerprint,
        },
        {
          id: "uuid",
          label: t("uuid.title"),
          path: "/uuid",
          icon: Fingerprint,
        },
        {
          id: "url",
          label: t("url.title"),
          path: "/url-encode",
          icon: LinkIcon,
        },
        {
          id: "fingerprint",
          label: t("fingerprint.title"),
          path: "/fingerprint",
          icon: Fingerprint,
        },
        {
          id: "password",
          label: t("password.title"),
          path: "/password",
          icon: Lock,
        },
        {
          id: "password-strength",
          label: t("commands.password-strength"),
          path: "/password-strength",
          icon: Eye,
        },
        {
          id: "jwt-generator",
          label: t("commands.jwt-generator"),
          path: "/jwt-generator",
          icon: FileKey,
        },
        {
          id: "csrf-token",
          label: t("commands.csrf-token"),
          path: "/csrf-token",
          icon: Key,
        },
        {
          id: "secure-key",
          label: t("commands.secure-key"),
          path: "/secure-key",
          icon: Key,
        },
        {
          id: "email-header",
          label: t("commands.email-header"),
          path: "/email-header",
          icon: Mail,
        },
        {
          id: "ip",
          label: t("ip.title"),
          path: "/ip",
          icon: Globe,
          keywords: ["address", "network", "location", "whois"],
        },
      ],
    },
    {
      id: "seo",
      title: t("categories.seo"),
      items: [
        {
          id: "meta-tags",
          label: t("commands.meta-tags"),
          path: "/meta-tags",
          icon: Globe,
        },
        {
          id: "robots-txt",
          label: t("commands.robots-txt"),
          path: "/robots-txt",
          icon: FileText,
        },
        {
          id: "sitemap",
          label: t("commands.sitemap"),
          path: "/sitemap",
          icon: GitMerge,
        },
        {
          id: "page-speed",
          label: t("commands.page-speed"),
          path: "/page-speed",
          icon: Gauge,
        },
        {
          id: "seo-preview",
          label: t("commands.seo-preview"),
          path: "/seo-preview",
          icon: Search,
        },
      ],
    },
    {
      id: "visual",
      title: t("categories.visual"),
      items: [
        {
          id: "palette",
          label: t("colorPalette.title"),
          path: "/palette",
          icon: Palette,
        },
        { id: "qr", label: t("qrCode.title"), path: "/qr", icon: QrCode },
        {
          id: "box-shadow",
          label: t("boxShadow.title"),
          path: "/box-shadow",
          icon: Square,
        },
      ],
    },
    {
      id: "settings",
      title: t("categories.settings"),
      items: [
        {
          id: "settings",
          label: t("commands.settings"),
          path: "/settings",
          icon: Settings,
        },
      ],
    },
  ];

  const [actions, setActions] = useState<any[]>([]);

  useEffect(() => {
    const lowerQuery = query.toLowerCase().trim();
    const quickActions = [];

    // UUID Quick Action
    if (lowerQuery === "uuid" || lowerQuery === "> uuid") {
      quickActions.push({
        id: "action-uuid",
        label: t("uuid.generate"),
        action: () => {
          const uuid = crypto.randomUUID();
          navigator.clipboard.writeText(uuid);
        },
        description: "Generate & Copy UUIDv4",
        icon: Command,
      });
    }

    // Epoch Quick Action
    if (
      lowerQuery === "now" ||
      lowerQuery === "time" ||
      lowerQuery === "epoch"
    ) {
      quickActions.push({
        id: "action-epoch",
        label: t("epoch.currentTime"),
        action: () => {
          const now = Math.floor(Date.now() / 1000).toString();
          navigator.clipboard.writeText(now);
        },
        description: "Copy Current Unix Timestamp",
        icon: Command,
      });
    }

    setActions(quickActions);
  }, [query, t]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
      }
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const filteredSections = sections
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.keywords?.some((k: string) =>
            k.toLowerCase().includes(query.toLowerCase())
          ) ||
          item.path.toLowerCase().includes(query.toLowerCase())
      ),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-24 bg-black/60 backdrop-blur-md transition-opacity">
      <div className="relative w-full max-w-lg bg-app-panel border border-app-border rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 max-h-[80vh] flex flex-col">
        <div className="flex items-center px-4 py-3 border-b border-app-border">
          <Search className="w-5 h-5 text-app-text-sub mr-3" />
          <input
            autoFocus
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-app-text placeholder-app-text-passive"
            placeholder={t("search_placeholder")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={onClose} className="p-1 hover:bg-app-bg rounded">
            <X className="w-4 h-4 text-app-text-sub" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {actions.length > 0 && (
            <>
              <div className="px-4 py-2 text-xs font-medium text-app-text-sub uppercase tracking-wider">
                Quick Actions
              </div>
              {actions.map((action) => (
                <button
                  key={action.id}
                  className="w-full flex items-center px-4 py-2.5 text-left text-app-text hover:bg-app-bg transition-colors group"
                  onClick={() => {
                    action.action();
                    onClose();
                  }}
                >
                  <action.icon className="w-4 h-4 mr-3 text-app-primary group-hover:text-app-primary-hover" />
                  <div className="flex flex-col">
                    <span>{action.label}</span>
                    <span className="text-xs text-app-text-mute">
                      {action.description}
                    </span>
                  </div>
                </button>
              ))}
              <div className="my-2 border-t border-app-border" />
            </>
          )}

          {filteredSections.length === 0 && actions.length === 0 ? (
            <div className="px-4 py-8 text-center text-app-text-sub text-sm">
              No results found.
            </div>
          ) : (
            filteredSections.map((section) => (
              <div key={section.id}>
                {/* Only show header if searching or if it's not the flat view preference (but user asked for grouping) */}
                <div className="px-4 py-2 text-xs font-medium text-app-text-sub uppercase tracking-wider bg-app-bg/50 sticky top-0 backdrop-blur-sm z-10">
                  {section.title}
                </div>
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    className="w-full flex items-center px-4 py-2.5 text-left text-app-text hover:bg-app-bg transition-colors group"
                    onClick={() => {
                      navigate(item.path);
                      onClose();
                    }}
                  >
                    <item.icon className="w-4 h-4 mr-3 text-app-text-passive group-hover:text-app-text-sub" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            ))
          )}
        </div>

        <div className="px-4 py-2 bg-app-bg border-t border-app-border flex items-center justify-between text-xs text-app-text-sub shrink-0">
          <div className="flex items-center gap-2">
            <span className="bg-app-panel border border-app-border px-1.5 py-0.5 rounded">
              ↑↓
            </span>
            <span>to navigate</span>
            <span className="bg-app-panel border border-app-border px-1.5 py-0.5 rounded ml-2">
              ↵
            </span>
            <span>to select</span>
          </div>
          <div className="flex items-center gap-2">
            <span>ESC to close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
