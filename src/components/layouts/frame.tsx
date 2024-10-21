import { type FC } from "react";
import { Outlet } from "react-router-dom";

import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import ThemeContext from "@/context/theme-context";

const Frame: FC = () => {

  return (
    <ThemeContext>
      <Header />
      <main className="min-h-[calc(100dvh-6rem)]"><Outlet /></main>
      <Footer />
    </ThemeContext>
  )
}

export default Frame;