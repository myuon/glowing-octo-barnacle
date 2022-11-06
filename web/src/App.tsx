import "./App.css";
import LoginPage from "./pages/Login";
import { AuthProvider } from "./components/auth";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { IndexPage } from "./pages/Index";
import { ImportPage } from "./pages/Import";
import { IndexLayout } from "./layouts/Index";

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
        index: true,
        element: <IndexPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
