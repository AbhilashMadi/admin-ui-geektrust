import { type FC, type ReactNode, createContext, useEffect, useMemo, useState } from "react";
import { StorageKeys } from "@/utils/storage-keys";
import { Constants } from "@/utils/constants";

export type Theme = Constants.DARK | Constants.LIGHT | Constants.SYSTEM;

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export const ThemeProviderContext = createContext<ThemeProviderState>({
  theme: Constants.SYSTEM,
  setTheme: () => null,
});

interface IThemeContext {
  defaultTheme?: Theme;
  children: ReactNode;
}

const ThemeContext: FC<IThemeContext> = ({ children, defaultTheme = Constants.LIGHT }) => {
  const [theme, setThemeState] = useState<Theme>(() => (localStorage.getItem(StorageKeys.APP_THEME) as Theme) ?? defaultTheme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(Constants.LIGHT, Constants.DARK);

    if (theme === Constants.SYSTEM) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? Constants.DARK
        : Constants.LIGHT;

      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem(StorageKeys.APP_THEME, newTheme);
    setThemeState(newTheme);
  };

  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>;
};

export default ThemeContext;
