import { Link } from "react-router-dom";
import { useState } from "react";
import "./TopNav.css";

export default function TopNav() {
  const [active, setActive] = useState(
    window.location.pathname.replace("/ClayCountyHistoricalMaps", ""),
  );

  return (
    <nav className="topnav">
      <ul className="nav-list">
        <li>
          <Link
            className={active === "" || active === "/" ? "active" : null}
            onClick={() => setActive("")}
            to="/"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            className={active === "/maps" ? "active" : null}
            onClick={() => setActive("/maps")}
            to="/maps"
          >
            Maps
          </Link>
        </li>
        <li>
          <Link
            className={active === "/records" ? "active" : null}
            onClick={() => setActive("/records")}
            to="/records"
          >
            Records
          </Link>
        </li>
      </ul>
      <input type="text" placeholder="Search.." />
    </nav>
  );
}
