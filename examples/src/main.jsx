import React from "react";
import ReactDOM from "react-dom/client";
import { PromptProvider } from "prompt-react-router-dom";
import App from "./App";
import "./index.css";
import {
  RouterProvider,
  createBrowserRouter,
  Outlet,
  Link,
} from "react-router-dom";

const Navigation = () => {
  return (
    <>
      <p>
        <Link to="/">home</Link>
      </p>
      <p>
        <Link to="/2">2</Link>
      </p>
      <Outlet />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigation />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: "/2",
        element: <p>2</p>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <PromptProvider value={router.subscribe}>
    <RouterProvider router={router} />
  </PromptProvider>
);
