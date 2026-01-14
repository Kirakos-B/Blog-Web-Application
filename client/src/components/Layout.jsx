import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer"; // Import the footer

export default function Layout() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="content-area">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
