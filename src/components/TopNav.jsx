export default function TopNav() {
  const active = window.location.pathname;
  return (
    <nav className="topnav">
      <a className={active === "/" ? "active" : null} href="/">
        Home
      </a>
      <a className={active === "/maps" ? "active" : null} href="/maps">
        Maps
      </a>
      <a className={active === "/records" ? "active" : null} href="/records">
        Records
      </a>
      <input type="text" placeholder="Search.." />
    </nav>
  );
}
