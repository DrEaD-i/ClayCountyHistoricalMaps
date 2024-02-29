import Layout from "./layout.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Maps from "./pages/Maps.jsx";
import Records from "./pages/Records.jsx";
import NotFound from "./pages/NotFound.jsx";
import "./App.css";

const router = createBrowserRouter(
  [
    { path: "/", element: <Home />, errorElemcnt: <NotFound /> },
    { path: "/maps", element: <Maps /> },
    { path: "/records", element: <Records /> },
  ],
  { basename: "/ClayCountyHistoricalMaps" }
);

function App() {
  return (
    <>
      <Layout>
        <RouterProvider router={router} />
      </Layout>
    </>
  );
}

export default App;
