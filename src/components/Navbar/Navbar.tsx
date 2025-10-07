import styles from "./Navbar.module.css";
import { FaHome, FaUser } from "react-icons/fa";
import { FaBell, FaMagnifyingGlass } from "react-icons/fa6";
import { RiContactsBookUploadFill } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";

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

export const Navbar = () => {
  const location = useLocation();
  const path = location.pathname;
  let currentMenu: menuItems = "home";

  if (path.startsWith("/search")) currentMenu = "search";
  else if (path.startsWith("/profile")) currentMenu = "profile";
  else if (path.startsWith("/notices")) currentMenu = "notices";
  else if (path.startsWith("/upload")) currentMenu = "upload";

  return (
    <div className={styles["navbar-container"]}>
      {navItems.map(({ path, menu, icon: Icon, label }) => {
        const isActive = currentMenu === menu;
        return (
          <Link
            to={path}
            className={`${styles["navbar-item"]}  ${
              styles[isActive ? "current" : ""]
            }`}
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
