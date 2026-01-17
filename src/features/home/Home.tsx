import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  Star,
  Clock,
  List,
  LayoutGrid,
  FileJson,
  Eraser,
  Image as ImageIcon,
  Share2,
} from "lucide-react";

import { useFavorites } from "../../hooks/useFavorites";
import { useRecentTools } from "../../hooks/useRecentTools";
import { useDraggableScroll } from "../../hooks/useDraggableScroll";
import { useState, useEffect, useMemo } from "react";
import { TOOLS_CONFIG } from "../../config/tools";

export default function Home() {
  const { t } = useTranslation();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { recentTools, clearRecent } = useRecentTools();
  const {
    ref: scrollerRef,
    onMouseDown,
    onMouseLeave,
    onMouseUp,
    onMouseMove,
    onClickCapture,
    isMouseDown,
  } = useDraggableScroll();

  const [viewMode, setViewMode] = useState<"grid" | "list">(() => {
    return (localStorage.getItem("viewMode") as "grid" | "list") || "grid";
  });

  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("viewMode", viewMode);
  }, [viewMode]);

  const sections = useMemo(() => {
    return TOOLS_CONFIG.map((section) => ({
      ...section,
      title: t(`categories.${section.id}`),
      tools: section.tools.map((tool) => ({
        ...tool,
        title: t(`commands.${tool.id}`),
      })),
    }));
  }, [t]);

  // Combined filters for Favorites and Recent
  const filteredFavorites = useMemo(() => {
    const favTools = sections
      .flatMap((s) => s.tools)
      .filter((tool) => favorites.includes(tool.id));

    if (!activeCategory) return favTools;

    const activeSection = sections.find((s) => s.id === activeCategory);
    if (!activeSection) return favTools;

    return favTools.filter((tool) =>
      activeSection.tools.some((t) => t.id === tool.id)
    );
  }, [favorites, sections, activeCategory]);

  const filteredRecent = useMemo(() => {
    const recent = sections
      .flatMap((s) => s.tools)
      .filter((tool) => recentTools.some((rt) => rt.path === tool.path));

    if (!activeCategory) return recent;

    const activeSection = sections.find((s) => s.id === activeCategory);
    if (!activeSection) return recent;

    return recent.filter((tool) =>
      activeSection.tools.some((t) => t.id === tool.id)
    );
  }, [recentTools, sections, activeCategory]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 md:space-y-12 pb-24 relative overflow-x-hidden">
      {/* Hero Section */}
      <div className="w-full text-center space-y-6 md:space-y-8 pt-6 md:pt-12 px-4">
        <div className="space-y-2 md:space-y-4 w-full">
          <h1 className="text-4xl md:text-7xl font-bold gradient-text-optimized pb-1 md:pb-2 break-words w-full">
            The Transformer
          </h1>
          <p className="text-lg md:text-xl text-app-text-sub max-w-2xl mx-auto leading-relaxed break-words w-full">
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
          className="inline-flex items-center gap-2 md:gap-3 px-4 py-2 md:px-6 md:py-3 bg-app-panel border border-app-border rounded-full text-app-text-sub text-xs md:text-sm hover:border-app-primary/50 hover:shadow-lg hover:shadow-app-primary/10 transition-all cursor-pointer group"
        >
          <span>{t("common.press")}</span>
          <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border border-app-border bg-app-bg px-2 font-mono text-[10px] font-medium text-app-text-sub group-hover:border-app-primary/50 group-hover:text-app-text transition-colors">
            <span className="text-xs">⌘</span>K
          </kbd>
          <span>{t("common.to_search")}</span>
        </div>
      </div>

      {/* Category Quick Scroller */}
      <div className="sticky top-0 z-30 w-full left-0 right-0 bg-app-bg/80 backdrop-blur-xl md:bg-transparent md:backdrop-blur-none border-b border-app-border/50 md:border-none md:relative">
        <div
          ref={scrollerRef}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          onClickCapture={onClickCapture}
          className={`flex overflow-x-auto no-scrollbar px-4 md:px-0 w-full select-none ${
            isMouseDown ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          <div className="flex gap-2.5 py-4 md:py-0">
            <button
              onClick={() => setActiveCategory(null)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm flex items-center gap-2 ${
                activeCategory === null
                  ? "bg-app-primary text-white shadow-app-primary/20 scale-105"
                  : "bg-app-panel border border-app-border text-app-text-sub hover:text-app-primary"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              {t("common.all", "All")}
            </button>
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setActiveCategory(section.id);
                  document
                    .getElementById(`section-${section.id}`)
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm ${
                  activeCategory === section.id
                    ? "bg-app-primary text-white shadow-app-primary/20 scale-105"
                    : "bg-app-panel border border-app-border text-app-text-sub hover:text-app-primary hover:border-app-primary/50"
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>
          <div className="flex gap-2 ml-4 pl-4 border-l border-app-border py-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2.5 rounded-xl border transition-all ${
                viewMode === "grid"
                  ? "bg-app-primary/10 border-app-primary text-app-primary"
                  : "bg-app-panel border-app-border text-app-text-sub"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2.5 rounded-xl border transition-all ${
                viewMode === "list"
                  ? "bg-app-primary/10 border-app-primary text-app-primary"
                  : "bg-app-panel border-app-border text-app-text-sub"
              }`}
              title="List View"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Favorites Section */}
      {filteredFavorites.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              {t("recent_tools_favorites", "Favorites")}
              {activeCategory && (
                <span className="text-sm font-normal text-app-text-sub">
                  in {sections.find((s) => s.id === activeCategory)?.title}
                </span>
              )}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 px-1">
            {filteredFavorites.map((tool) => (
              <Link
                key={tool.id}
                to={tool.path}
                className="group relative flex flex-col p-4 md:p-6 bg-app-panel border border-app-border rounded-xl hover:border-app-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center text-white mb-3 md:mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <tool.icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2 group-hover:text-app-primary transition-colors line-clamp-1 gradient-text-optimized">
                  {tool.title}
                </h3>
                <div className="mt-auto pt-4 flex items-center justify-between">
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
                      className={`w-4 h-4 fill-yellow-400 text-yellow-400`}
                    />
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent Tools Section */}
      {filteredRecent.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-app-primary" />
              {t("recent_tools")}
              {activeCategory && (
                <span className="text-sm font-normal text-app-text-sub">
                  in {sections.find((s) => s.id === activeCategory)?.title}
                </span>
              )}
            </h2>
            <button
              onClick={clearRecent}
              className="text-xs text-app-text-sub hover:text-red-400 transition-colors"
            >
              {t("clear")}
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 px-1">
            {filteredRecent
              .slice(0, 10) // Limit to 10
              .map((tool) => (
                <Link
                  key={tool.id}
                  to={tool.path}
                  className="group relative flex flex-col p-4 md:p-6 bg-app-panel border border-app-border rounded-xl hover:border-app-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center text-white mb-3 md:mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <tool.icon className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2 group-hover:text-app-primary transition-colors line-clamp-1 gradient-text-optimized">
                    {tool.title}
                  </h3>
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="text-xs text-app-text-sub">
                      Launch Tool →
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(tool.id);
                      }}
                      className={`p-1.5 hover:bg-app-bg rounded-lg transition-all ${
                        isFavorite(tool.id)
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      }`}
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

      {/* Featured Tools Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2 px-2">
          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          {t("featured_tools")}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 px-1">
          {[
            {
              id: "json-csv",
              icon: FileJson,
              title: t("commands.json-csv"),
              path: "/json-csv",
              color: "from-orange-500 to-red-600",
              badge: "Popular",
            },
            {
              id: "bg-remover",
              icon: Eraser,
              title: t("bgRemover.title"),
              path: "/bg-remover",
              color: "from-purple-600 to-indigo-600",
              badge: "AI Powered",
            },
            {
              id: "img-conv",
              icon: ImageIcon,
              title: t("commands.img-conv"),
              path: "/image-converter",
              color: "from-purple-500 to-pink-600",
            },
            {
              id: "compress",
              icon: Share2,
              title: t("commands.compress"),
              path: "/compress",
              color: "from-pink-600 to-rose-600",
            },
          ].map((tool) => (
            <Link
              key={tool.id}
              to={tool.path}
              className="group relative flex flex-col p-4 md:p-6 bg-app-panel border border-app-border rounded-xl hover:border-app-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {tool.badge && (
                <div className="absolute top-2 right-2 md:top-3 md:right-3 px-2 py-0.5 md:py-1 bg-app-primary/10 text-app-primary text-[10px] md:text-xs font-medium rounded-full border border-app-primary/20">
                  {tool.badge}
                </div>
              )}
              <div
                className={`w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center text-white mb-3 md:mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                <tool.icon className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2 group-hover:text-app-primary transition-colors line-clamp-1">
                {tool.title}
              </h3>
              <div className="mt-auto pt-4 flex items-center justify-between">
                <span className="text-xs text-app-text-sub">Launch Tool →</span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(tool.id);
                  }}
                  className={`p-1.5 hover:bg-app-bg rounded-lg transition-all ${
                    isFavorite(tool.id)
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
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

      {/* Tools Grid */}
      <div className="space-y-10 md:space-y-16">
        {sections
          .filter((section) => !activeCategory || section.id === activeCategory)
          .map((section) => (
            <div
              key={section.id}
              id={`section-${section.id}`}
              className="space-y-4 md:space-y-6 scroll-mt-24 md:scroll-mt-6"
            >
              <div className="flex items-center gap-3 px-2">
                <div className="h-6 md:h-8 w-1 bg-app-primary rounded-full" />
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                  {section.title}
                </h2>
              </div>
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 px-1"
                    : "flex flex-col gap-2 px-1"
                }
              >
                {section.tools.map((tool) => (
                  <Link
                    key={tool.id}
                    to={tool.path}
                    className={
                      viewMode === "grid"
                        ? "group relative flex flex-col p-4 md:p-6 bg-app-panel border border-app-border rounded-xl hover:border-app-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 min-h-[140px] md:min-h-[160px]"
                        : "group relative flex items-center p-3 h-14 bg-app-panel border border-app-border rounded-xl hover:bg-app-primary/5 hover:border-app-primary/30 transition-all"
                    }
                  >
                    <div
                      className={
                        viewMode === "grid"
                          ? "flex items-start justify-between mb-3 md:mb-4"
                          : "flex items-center flex-1 min-w-0"
                      }
                    >
                      <div
                        className={
                          viewMode === "grid"
                            ? `w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`
                            : `w-8 h-8 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center text-white mr-4 shadow-sm group-hover:scale-110 transition-transform`
                        }
                      >
                        <tool.icon
                          className={
                            viewMode === "grid"
                              ? "w-5 h-5 md:w-6 md:h-6"
                              : "w-4 h-4"
                          }
                        />
                      </div>
                      {viewMode === "list" && (
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm md:text-base font-semibold group-hover:text-app-primary transition-colors truncate">
                            {tool.title}
                          </h3>
                          <p className="text-[10px] text-app-text-mute uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                            Go to {section.title.slice(0, -1)} Tool
                          </p>
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite(tool.id);
                        }}
                        className={
                          viewMode === "grid"
                            ? `p-2 hover:bg-app-bg rounded-lg transition-all ${
                                isFavorite(tool.id)
                                  ? "opacity-100"
                                  : "opacity-0 group-hover:opacity-100"
                              }`
                            : `p-2 ml-4 hover:bg-app-bg rounded-lg transition-all ${
                                isFavorite(tool.id)
                                  ? "opacity-100"
                                  : "opacity-0 group-hover:opacity-100"
                              }`
                        }
                      >
                        <Star
                          className={
                            viewMode === "grid"
                              ? `w-5 h-5 ${
                                  isFavorite(tool.id)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-app-text-sub hover:text-yellow-400"
                                }`
                              : `w-4 h-4 ${
                                  isFavorite(tool.id)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-app-text-passive hover:text-yellow-400"
                                }`
                          }
                        />
                      </button>
                    </div>
                    {viewMode === "grid" && (
                      <h3 className="text-base md:text-lg font-semibold mt-auto group-hover:text-app-primary transition-colors line-clamp-1">
                        {tool.title}
                      </h3>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
