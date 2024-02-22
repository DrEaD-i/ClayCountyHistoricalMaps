import Home from "../pages/Home.jsx";
import Maps from "../pages/Maps.jsx";
import Records from "../pages/Records.jsx";
import NotFound from "../pages/NotFound.jsx";

const routes = [
  { body: <NotFound />, path: "/404" },
  { body: <Home />, path: "/" },
  { body: <Maps />, path: "/maps" },
  { body: <Records />, path: "/records" },
];

export default function Router() {
  const pathName = new URL(window.location).pathname;
  const route =
    routes[routes.findIndex((e) => e.path === pathName)] || routes[0];

  return route.body;
}
