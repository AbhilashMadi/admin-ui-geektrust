import { type FC } from "react";
import { Outlet } from "react-router-dom";

import Header from "@components/common/header";
import Footer from "@components/common/footer";
import ThemeContext from "@context/theme-context";

const Frame: FC = () => {

  return (
    <ThemeContext>
      <Header />
      <Outlet />
      <Footer />
    </ThemeContext>
  )
}

export default Frame;