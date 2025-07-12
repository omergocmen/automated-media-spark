import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const THEME_KEY = "theme";

export function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    // İlk yüklemede localStorage veya sistem temasını uygula
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light") {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
      setIsLight(true);
    } else {
      document.body.classList.remove("light");
      document.body.classList.add("dark");
      setIsLight(false);
    }
  }, []);

  const toggleTheme = () => {
    if (isLight) {
      document.body.classList.remove("light");
      document.body.classList.add("dark");
      localStorage.setItem(THEME_KEY, "dark");
      setIsLight(false);
    } else {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
      localStorage.setItem(THEME_KEY, "light");
      setIsLight(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full border border-border bg-card/70 hover:bg-card transition-colors shadow-glow focus:outline-none"
      aria-label="Tema değiştirici"
      title={isLight ? "Koyu moda geç" : "Açık moda geç"}
    >
      {isLight ? <Sun className="w-5 h-5 text-orange-400" /> : <Moon className="w-5 h-5 text-purple-400" />}
    </button>
  );
} 