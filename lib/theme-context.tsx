// lib/theme-context.tsx
import { createContext, useContext } from "react";
import { useColorScheme } from "react-native";

type ThemeContextType = { colorScheme: "light" | "dark" };

const ThemeContext = createContext<ThemeContextType>({ colorScheme: "light" });

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = useColorScheme();
  return (
    <ThemeContext.Provider
      value={{ colorScheme: colorScheme === "dark" ? "dark" : "light" }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
