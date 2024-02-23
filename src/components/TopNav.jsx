import { Link } from "react-router-dom";
import { useState } from "react";

export default function TopNav() {
  const [active, setActive] = useState(window.location.pathname);

  return (
    <nav className="topnav">
      <Link
        className={active === "/" ? "active" : null}
        onClick={() => setActive("/")}
        to="/">
        Home
      </Link>
      <Link
        className={active === "/maps" ? "active" : null}
        onClick={() => setActive("/maps")}
        to="/maps">
        Maps
      </Link>
      <Link
        className={active === "/records" ? "active" : null}
        onClick={() => setActive("/records")}
        to="/records">
        Records
      </Link>
      <input type="text" placeholder="Search.." />
    </nav>
  );
}
