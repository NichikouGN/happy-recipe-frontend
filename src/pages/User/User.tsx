import styles from "../Profile/Profile.module.css";
import { useAuthStore } from "../../stores/authStore";
import UserContent from "./UserContent";
import UserSkeleton from "./UserSkeleton";
import { useParams } from "react-router-dom";
import { useState } from "react";
import UserError from "./UserError";

interface userStructure {
  userId: string;
  username: string;
  displayName: string;
  bio: string;
  profileImageURL: string;
}

const User = () => {
  const { userId } = useParams<{ userId: string }>();
  const [userInformation, setUserInformation] = useState<userStructure | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");

  const fetchUserInformation = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${userId}`);
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      setUserInformation(data.userInformation);
      setLoadState("loaded");
    } catch (error) {
      setLoadState("error");
    }
  };

  return (
    <div className={styles["profile-page"]}>
      {loadState === "loaded" && userInformation ? (
        <UserContent />
      ) : loadState === "loading" ? (
        <UserSkeleton />
      ) : (
        <UserError />
      )}
    </div>
  );
};

export default User;
