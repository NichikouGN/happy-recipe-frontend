import AIChatBox from "../AIChatBox/AIChatBox";
import { Navbar } from "../Navbar/Navbar";
import { Outlet } from "react-router-dom";
import styles from "./Layout.module.css";

const Layout = () => {
  return (
    <>
      <Navbar />
      <div className={styles["hovering-container"]}>
        <AIChatBox />
      </div>

      <Outlet />
    </>
  );
};

export default Layout;
