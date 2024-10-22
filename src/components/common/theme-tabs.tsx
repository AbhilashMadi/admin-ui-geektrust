import { type Theme } from "@/context/theme-context";
import { type FC } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/hooks/context-hooks";
import { Constants } from "@/utils/constants";
import { MoonIcon, SunIcon, LaptopIcon } from "@radix-ui/react-icons";

const ThemeTabs: FC = () => {
  const { setTheme, theme } = useTheme();

  return (
    <Tabs value={theme} onValueChange={(v) => setTheme(v as Theme)}>
      <TabsList>
        <TabsTrigger value={Constants.DARK}><MoonIcon className="h-4" /></TabsTrigger>
        <TabsTrigger value={Constants.LIGHT}><SunIcon className="h-4" /></TabsTrigger>
        <TabsTrigger value={Constants.SYSTEM}><LaptopIcon className="h-4" /></TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ThemeTabs;
