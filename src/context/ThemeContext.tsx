import {
  useState,
  useContext,
  useCallback,
  useEffect,
  createContext,
  type FC,
  type ReactNode,
} from "react";

const ThemeContext = createContext<
  | {
      themeColor: string;
      updateTheme: () => void;
    }
  | undefined
>(undefined);

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [themeColor, setThemeColor] = useState<string>(() => {
    try {
      const savedTheme = localStorage.getItem("app-theme");
      return savedTheme === "light" || savedTheme === "dark"
        ? savedTheme
        : "light";
    } catch (err) {
      console.log("unable to retrieve saved theme, default to light");
      return "light";
    }
  });

  const updateTheme = useCallback(() => {
    setThemeColor((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("app-theme", themeColor);
    localStorage.setItem("app-theme", themeColor);
  }, [themeColor]);

  return (
    <ThemeContext.Provider value={{ themeColor, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("Error");
  }

  return context;
};
