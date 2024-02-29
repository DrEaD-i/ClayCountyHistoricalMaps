import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Maps from "./pages/Maps.jsx";
import Records from "./pages/Records.jsx";
import NotFound from "./pages/NotFound.jsx";
import App from "./App.jsx";
import "./index.css";

const router = createBrowserRouter(
  [
    { path: "/", element: <Home />, errorElement: <NotFound /> },
    { path: "/maps", element: <Maps /> },
    { path: "/records", element: <Records /> },
  ],
  { basename: "/ClayCountyHistoricalMaps" },
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
