import styles from "./Navbar.module.css";
import { FaHome, FaUser } from "react-icons/fa";
import { FaBell, FaMagnifyingGlass } from "react-icons/fa6";
import { RiContactsBookUploadFill } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

type menuItems = "home" | "search" | "profile" | "notices" | "upload";

const navItems = [
  { path: "/", menu: "home", icon: FaHome, label: "Home" },
  {
    path: "/search",
    menu: "search",
    icon: FaMagnifyingGlass,
    label: "Search",
  },
  {
    path: "/upload",
    menu: "upload",
    icon: RiContactsBookUploadFill,
    label: "Upload",
  },
  {
    path: "/notices",
    menu: "notices",
    icon: FaBell,
    label: "Notices",
  },
  { path: "/profile", menu: "profile", icon: FaUser, label: "Profile" },
] as const;

const restricted = ["upload", "notices"];

export const Navbar = () => {
  const { loginState } = useAuthContext();
  const location = useLocation();
  const path = location.pathname;
  let currentMenu: menuItems = "home";

  if (path.startsWith("/search")) currentMenu = "search";
  else if (path.startsWith("/profile")) currentMenu = "profile";
  else if (path.startsWith("/notices")) currentMenu = "notices";
  else if (path.startsWith("/upload")) currentMenu = "upload";

  return (
    <div className={styles["navbar-container"]}>
      {navItems
        .filter(
          (item) =>
            loginState === "authorized" || !restricted.includes(item.menu)
        )
        .map(({ path, menu, icon: Icon, label }) => {
          if (loginState !== "authorized") {
            if (menu === "upload" || menu === "notices") {
            }
          }
          const isActive = currentMenu === menu;
          return (
            <Link
              to={path}
              className={`${styles["navbar-item"]}  ${
                styles[isActive ? "current" : ""]
              }`}
              key={menu}
            >
              <div
                className={`${styles["navbar-item__icon"]}  ${
                  styles[isActive ? "current" : ""]
                }`}
              >
                <Icon />
              </div>

              <div
                className={`${styles["navbar-item__label"]} ${
                  styles[isActive ? "current" : ""]
                }`}
              >
                {label}
              </div>
            </Link>
          );
        })}
    </div>
  );
};
