import { type FC } from "react";
import ThemeTabs from "@/components/common/theme-tabs";

const Header: FC = () => {

  return (<header className="flex justify-end h-[3rem] p-3">
    <ThemeTabs />
  </header>);
}

export default Header;