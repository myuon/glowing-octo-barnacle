import LoginPage from "./pages/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { IndexPage } from "./pages/Index";
import { ImportPage } from "./pages/Import";
import { IndexLayout } from "./layouts/Index";
import { MonthlyPage } from "./pages/Monthly";
import { css, Global } from "@emotion/react";
import { theme } from "./components/theme";
import { ItemPage } from "./pages/Item";

const router = createBrowserRouter([
  {
    path: "/",
    element: <IndexLayout />,
    children: [
      {
        path: "/import",
        element: <ImportPage />,
      },
      {
        path: "/monthly/:ym",
        element: <MonthlyPage />,
      },
      {
        path: "/item/:uniqueKey",
        element: <ItemPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        index: true,
        element: <IndexPage />,
      },
    ],
  },
]);

const App = () => {
  return (
    <>
      <Global
        styles={css`
          body {
            @media screen and (min-width: 760px) {
              width: 760px;
              margin: 0 auto;
            }
          }

          a {
            color: ${theme.palette.primary.main};
          }

          a:hover,
          a:active {
            color: ${theme.palette.primary.dark};
          }
        `}
      />
      <RouterProvider router={router} />
    </>
  );
};

export default App;
