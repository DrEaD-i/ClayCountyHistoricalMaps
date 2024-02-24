import TopNav from "./components/TopNav.jsx";

export default function Layout({ children }) {
  return (
    <>
      <img src="ccbanner.png" alt="Clay County Museum" className="banner" />
      <TopNav />
      <main>{children}</main>
      <footer>
        <p>Location: 518 Lincoln Ave, Clay Center, KS 67432 </p>
        <p>Hours: Tues-Sun 1-5PM </p>
        <p>Connect with us! (785) 632-3786 · ccmuseum@twinvalley.net</p>
      </footer>
    </>
  );
}
