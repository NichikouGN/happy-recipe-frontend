import { useEffect } from "react";
import { useAuthContext } from "../../context/AuthContext";
import styles from "./Profile.module.css";
import ProfileSkeleton from "./ProfileSkeleton";
import ProfileContent from "./ProfileContent";

const Profile = () => {
  const { validateAccessToken, signInState } = useAuthContext();

  // Validate access token on component mount
  useEffect(() => {
    validateAccessToken().catch(() => {
      console.log("Access token is invalid");
    });
  }, [validateAccessToken]);

  return (
    <div className={styles["profile-page"]}>
      {signInState === "authorized" ? <ProfileContent /> : <ProfileSkeleton />}
    </div>
  );
};

export default Profile;
