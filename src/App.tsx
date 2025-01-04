import { type FC } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootErrorBoundary from "@components/error-boundarys/root-error-boundary";
import Frame from "@components/layouts/frame";
import SuspenseLoader from "@components/common/suspense-loader";

const App: FC = () => {

  const routes = createBrowserRouter([
    {
      path: "/",
      element: <Frame />,
      errorElement: <RootErrorBoundary />,
      children: [
        {
          index: true,
          lazy: async () => {
            const module = await import("@pages/admin-table/admin-table");
            return { Component: module.default };
          },
        },
        {
          path: "tic-tac-toe",
          lazy: async () => {
            const module = await import("@pages/tic-tac-toe/Game");
            return { Component: module.default };
          },
        },
      ],
    },
    {
      path: "*",
      element: <>Not Found</>,
    },
  ]);

  return <RouterProvider
    router={routes}
    fallbackElement={<div className="min-h-dvh flex-center"><SuspenseLoader /></div>} />;
};

export default App;
