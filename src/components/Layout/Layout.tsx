import AIChatBox from "../AIChatBox/AIChatBox";
import { Navbar } from "../Navbar/Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Navbar />
      <AIChatBox />
      <Outlet />
    </>
  );
};

export default Layout;
