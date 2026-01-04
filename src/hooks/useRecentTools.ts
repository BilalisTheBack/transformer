import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface RecentTool {
  path: string;
  timestamp: number;
}

export function useRecentTools() {
  const [recentTools, setRecentTools] = useState<RecentTool[]>(() => {
    const saved = localStorage.getItem("recent-tools");
    return saved ? JSON.parse(saved) : [];
  });
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") return;

    setRecentTools((prev) => {
      const filtered = prev.filter((tool) => tool.path !== location.pathname);
      const newRecent = [
        { path: location.pathname, timestamp: Date.now() },
        ...filtered,
      ].slice(0, 10); // Keep last 10

      localStorage.setItem("recent-tools", JSON.stringify(newRecent));
      return newRecent;
    });
  }, [location.pathname]);

  const clearRecent = () => {
    setRecentTools([]);
    localStorage.removeItem("recent-tools");
  };

  return { recentTools, clearRecent };
}
