import { Routes, Route } from "react-router-dom";
import Layout from "./layout.jsx";
import Home from "./pages/Home.jsx";
import Maps from "./pages/Maps.jsx";
import Records from "./pages/Records.jsx";
import NotFound from "./pages/NotFound.jsx";
import "./App.css";

function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<Home />} />
          <Route path="/maps" element={<Maps />} />
          <Route path="/records" element={<Records />} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;
