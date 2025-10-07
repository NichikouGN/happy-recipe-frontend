import styles from "./Layout.module.css";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar/Navbar";

export const Layout = () => {
  return (
    <div className={styles["layout-container"]}>
      <Navbar />
      <Outlet />
    </div>
  );
};
