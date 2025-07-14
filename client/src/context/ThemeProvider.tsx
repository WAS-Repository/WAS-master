import { createContext, useState, useEffect, ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check for saved theme
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    
    // Always default to dark theme for professional IDE look
    if (!savedTheme) {
      return "dark";
    }
    
    return savedTheme || "dark"; // Default to dark for professional IDE look
  });

  useEffect(() => {
    // Apply theme class to document element
    const root = document.documentElement;
    
    if (theme === "dark") {
      root.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      root.classList.remove("dark");
      document.body.classList.remove("dark");
    }
    
    // Also apply dark theme styles directly
    document.body.style.backgroundColor = theme === "dark" ? "#25292E" : "#F4F7FA";
    document.body.style.color = theme === "dark" ? "#CECECE" : "#333333";
    
    // Save theme to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
