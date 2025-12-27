import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import CommandPalette from "./CommandPalette";
import {
  Terminal,
  Settings,
  Github,
  Command as CommandIcon,
} from "lucide-react";

export default function Layout() {
  const [isPaletteOpen, setPaletteOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setPaletteOpen((current) => !current);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-app-bg text-app-text flex font-sans transition-colors duration-200">
      {/* Sidebar */}
      <aside className="w-16 flex flex-col items-center py-6 border-r border-app-border bg-app-nav/80 backdrop-blur-md fixed h-full z-40 transition-colors duration-200">
        <button
          onClick={() => navigate("/")}
          className="w-10 h-10 bg-app-primary rounded-lg flex items-center justify-center mb-8 shadow-lg shadow-app-primary/20 hover:bg-app-primary-hover transition-colors cursor-pointer"
        >
          <Terminal className="text-white w-6 h-6" />
        </button>

        <nav className="flex-1 w-full flex flex-col items-center gap-6">
          <button
            onClick={() => setPaletteOpen(true)}
            className="w-10 h-10 rounded-lg hover:bg-app-border flex items-center justify-center text-app-text-sub hover:text-app-text transition-colors group relative"
            title="Open Command Palette (Ctrl+K)"
          >
            <CommandIcon className="w-5 h-5" />
            <div className="absolute left-14 bg-app-panel border border-app-border text-app-text text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
              Search (Ctrl+K)
            </div>
          </button>

          <div className="h-px w-8 bg-app-border" />
        </nav>

        <div className="flex flex-col items-center gap-4 mt-auto">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-lg hover:bg-app-border flex items-center justify-center text-app-text-sub hover:text-app-text transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
          <button
            onClick={() => navigate("/settings")}
            className="w-10 h-10 rounded-lg hover:bg-app-border flex items-center justify-center text-app-text-sub hover:text-app-text transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-16 p-8 relative">
        <Outlet />
      </main>

      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setPaletteOpen(false)}
      />
    </div>
  );
}
