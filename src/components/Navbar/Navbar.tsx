import styles from "./Navbar.module.css";
import { FaHome, FaUser } from "react-icons/fa";
import { FaGlobe } from "react-icons/fa6";
import { RiContactsBookUploadFill } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

type menuItems = "home" | "discover" | "profile" | "upload";

const navItems = [
  { path: "/", menu: "home", icon: FaHome, label: "Home" },
  {
    path: "/discover",
    menu: "discover",
    icon: FaGlobe,
    label: "Discover",
  },
  {
    path: "/upload",
    menu: "upload",
    icon: RiContactsBookUploadFill,
    label: "Upload",
  },
  { path: "/profile", menu: "profile", icon: FaUser, label: "Profile" },
] as const;

const restricted = ["upload", "notices"];

export const Navbar = () => {
  const { signInState } = useAuthContext();

  const location = useLocation();
  const path = location.pathname;
  let currentMenu: menuItems = "home";

  //Sync navbar with url
  if (path.startsWith("/discover")) currentMenu = "discover";
  else if (path.startsWith("/profile")) currentMenu = "profile";
  else if (path.startsWith("/upload")) currentMenu = "upload";
  else if (path.startsWith("/search")) currentMenu = "discover";

  return (
    <div className={styles["navbar-container"]}>
      {navItems
        .filter(
          (item) =>
            signInState === "authorized" || !restricted.includes(item.menu)
        )
        .map(({ path, menu, icon: Icon, label }) => {
          if (signInState !== "authorized") {
            if (menu === "upload") {
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
              tabIndex={0}
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
