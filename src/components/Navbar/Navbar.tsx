import { useState } from "react";
import styles from "./Navbar.module.css";
import Button from "../Button/Button";
import { useThemeContext } from "../../context/ThemeContext";
import { FaHome } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { FaCompass } from "react-icons/fa";
import { FaBell } from "react-icons/fa6";
import { RiContactsBookUploadFill } from "react-icons/ri";
import { FaMagnifyingGlass } from "react-icons/fa6";

export const Navbar = () => {
  const [collapse, setCollapse] = useState<boolean>(true);
  const [currentMenu, setCurrentMenu] = useState<
    "home" | "search" | "account" | "notifications" | "upload"
  >("home");
  // const { themeColor, updateTheme } = useThemeContext();
  return (
    <div className={styles["navbar-container"]}>
      <button
        className={styles["navbar-item"]}
        onClick={() => {
          setCurrentMenu("home");
        }}
      >
        <div
          className={`${styles["navbar-item__icon"]}  ${
            styles[currentMenu === "home" ? "current" : ""]
          }`}
        >
          <FaHome />
        </div>
        <div
          className={`${styles["navbar-item__label"]} ${
            styles[currentMenu === "home" ? "current" : ""]
          }`}
        >
          Home
        </div>
      </button>

      <button
        className={styles["navbar-item"]}
        onClick={() => {
          setCurrentMenu("search");
        }}
      >
        <div
          className={`${styles["navbar-item__icon"]}  ${
            styles[currentMenu === "search" ? "current" : ""]
          }`}
        >
          <FaMagnifyingGlass />
        </div>
        <div
          className={`${styles["navbar-item__label"]} ${
            styles[currentMenu === "search" ? "current" : ""]
          }`}
        >
          Search
        </div>
      </button>

      <button
        className={styles["navbar-item"]}
        onClick={() => {
          setCurrentMenu("upload");
        }}
      >
        <div
          className={`${styles["navbar-item__icon"]}  ${
            styles[currentMenu === "upload" ? "current" : ""]
          }`}
        >
          <RiContactsBookUploadFill />
        </div>
        <div
          className={`${styles["navbar-item__label"]} ${
            styles[currentMenu === "upload" ? "current" : ""]
          }`}
        >
          Upload
        </div>
      </button>

      <button
        className={styles["navbar-item"]}
        onClick={() => {
          setCurrentMenu("notifications");
        }}
      >
        <div
          className={`${styles["navbar-item__icon"]}  ${
            styles[currentMenu === "notifications" ? "current" : ""]
          }`}
        >
          <FaBell />
        </div>
        <div
          className={`${styles["navbar-item__label"]} ${
            styles[currentMenu === "notifications" ? "current" : ""]
          }`}
        >
          Notifications
        </div>
      </button>

      <button
        className={styles["navbar-item"]}
        onClick={() => {
          setCurrentMenu("account");
        }}
      >
        <div
          className={`${styles["navbar-item__icon"]}  ${
            styles[currentMenu === "account" ? "current" : ""]
          }`}
        >
          <FaUser />
        </div>
        <div
          className={`${styles["navbar-item__label"]} ${
            styles[currentMenu === "account" ? "current" : ""]
          }`}
        >
          Account
        </div>
      </button>
    </div>
  );
};
