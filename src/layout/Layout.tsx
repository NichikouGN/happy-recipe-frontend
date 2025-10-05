import styles from "./Layout.module.css";
import { Navbar } from "../components/Navbar/Navbar";
import Header from "../components/Header/Header";

export const Layout = () => {
  return (
    <div className={styles["layout-container"]}>
      <Navbar></Navbar>
    </div>
  );
};
