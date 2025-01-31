import { ThemeProviderContext } from "@/context/theme-context";
import { useContext } from "react";

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (!context) throw new Error("useTheme must be used within a ThemeContext")

  return context;
}
