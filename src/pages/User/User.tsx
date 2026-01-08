import styles from "../Profile/Profile.module.css";
import UserContent from "./UserContent";
import UserSkeleton from "./UserSkeleton";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import UserError from "./UserError";
import type { userInformation } from "../../types/userType";
import { useUserStore } from "../../stores/userStore";

const User = () => {
  const { userId } = useParams<{ userId: string }>();
  const [userInformation, setUserInformation] = useState<userInformation | null>(null);
  // const userInformation = useUserStore((state) => state.userInformation);
  const [loadState, setLoadState] = useState<"loading" | "loaded">("loading");

  useEffect(() => {
    const fetchUserInformation = async () => {
      console.log("Fetching user information for userId:", userId);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${userId}`);
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data: userInformation = await res.json();
        setUserInformation(data);
        setLoadState("loaded");
      } catch (error) {
        setLoadState("loaded");
      }
    };

    fetchUserInformation();
  }, [userId]);

  return (
    <div className={styles["profile-page"]}>
      {loadState === "loading" && <UserSkeleton />}
      {loadState === "loaded" && userInformation && (
        <UserContent userInformation={userInformation} />
      )}
      {loadState === "loaded" && !userInformation && <UserError />}
    </div>
  );
};

export default User;
