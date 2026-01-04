import { useState, useEffect } from "react";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("tool-favorites");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("tool-favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (toolId: string) => {
    setFavorites((prev) =>
      prev.includes(toolId)
        ? prev.filter((id) => id !== toolId)
        : [...prev, toolId]
    );
  };

  const isFavorite = (toolId: string) => favorites.includes(toolId);

  return { favorites, toggleFavorite, isFavorite };
}
