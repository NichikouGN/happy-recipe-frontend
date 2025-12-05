import styles from "./Profile.module.css";
import { IoSettingsSharp } from "react-icons/io5";
import { useNavigate } from "react-router";
import { FaUser } from "react-icons/fa";
// import { LuText } from "react-icons/lu";

const ProfileSkeleton = () => {
  const navigate = useNavigate();
  return (
    <>
      <button className={styles["user-btn"]}>
        <div className={styles["user-avatar-wrapper"]}>
          <FaUser size={60} className={styles["avatar"]} />
          <div className={styles["user-id"]}></div>
        </div>

        <div className={`${styles["user-info"]} ${styles["loading"]}`}></div>
      </button>

      <button className={styles["setting-btn"]}>
        <IoSettingsSharp size={28} />
        <p>Settings</p>
      </button>

      <button
        className={styles["login-btn"]}
        onClick={() => navigate("/login")}
      >
        <p>Log in to see your profile</p>
      </button>
    </>
  );
};

export default ProfileSkeleton;
