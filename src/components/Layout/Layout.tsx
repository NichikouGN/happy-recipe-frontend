import { useState } from "react";
import AIChatBox from "../AIChatBox/AIChatBox";
import { Navbar } from "../Navbar/Navbar";
import { Outlet } from "react-router-dom";
import Notifications from "../Notifications/Notifications";
import { FaBell } from "react-icons/fa";

const Layout = () => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <>
      <Navbar />
      <AIChatBox />
      <button
        aria-label="Toggle notifications"
        onClick={() => setNotificationsOpen((prev) => !prev)}
        style={{
          position: "fixed",
          bottom: "80svh",
          right: "1.5svh",
          width: "3rem",
          height: "3rem",
          borderRadius: "9999px",
          border: "none",
          background: "linear-gradient(to bottom right, var(--orange-400), var(--red-500))",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 16px rgba(0,0,0,0.3)",
          cursor: "pointer",
          zIndex: 12000,
        }}
      >
        <FaBell />
      </button>
      <Notifications isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
      <Outlet />
    </>
  );
};

export default Layout;
