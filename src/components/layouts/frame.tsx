import { type FC } from "react";
import { Outlet } from "react-router-dom";

import Footer from "@components/common/footer";
import Header from "@components/common/header";
import ThemeContext from "@context/theme-context";
import { Toaster } from "@ui/toaster";

const Frame: FC = () => {

  return (
    <ThemeContext>
      <Header />
      <Outlet />
      <Footer />
      <Toaster />
    </ThemeContext>
  )
}

export default Frame;