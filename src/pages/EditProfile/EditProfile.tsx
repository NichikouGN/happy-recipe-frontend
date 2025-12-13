import { Link } from "react-router-dom";
import styles from "./EditProfile.module.css";
import { IoClose } from "react-icons/io5";
import type { userInformation } from "../../types/userType";
import { useUserStore } from "../../stores/userStore";
import { useCallback, useState, type ChangeEvent } from "react";
import { uploadProfileChanges } from "../../api/editProfile";

interface newUserInformation
  extends Omit<userInformation, "userId" | "username" | "isVerified" | "email"> {}

const EditProfile = () => {
  const userInformation = useUserStore.getState().userInformation;

  const [newUserInformation, setNewUserInformation] = useState<newUserInformation>({
    displayName: userInformation.displayName,
    bio: userInformation.bio || "",
    profileImageUrl: userInformation.profileImageUrl,
  });

  const handleUserProfileImage = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewUserInformation((prev) => ({
        ...prev,
        profileImageUrl: URL.createObjectURL(file),
      }));
    }
  }, []);

  return (
    <div className={styles["edit-profile-page"]}>
      <header className={styles["header"]}>
        <h1>Edit Profile</h1>
        <Link to="/profile" className={styles["return-btn"]}>
          <IoClose className={styles["return-btn-icon"]} />
        </Link>
      </header>
      <main className={styles["content"]}>
        <section className={styles["edit-section"]}>
          <h2>Profile Image</h2>
          <input
            className={styles["input"]}
            type="file"
            accept="image/*"
            onChange={handleUserProfileImage}
          />
          <img
            src={newUserInformation.profileImageUrl}
            className={styles["preview-profile-image"]}
          />
        </section>

        <div className={styles["divider"]}>•</div>

        <section className={styles["edit-section"]}>
          <h2>Display Name</h2>
          <input
            value={newUserInformation.displayName}
            className={styles["input"]}
            type="text"
            placeholder="Enter display name..."
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNewUserInformation((prev) => ({ ...prev, displayName: e.target.value }))
            }
          />
        </section>

        <div className={styles["divider"]}>•</div>

        <section className={styles["edit-section"]}>
          <h2>Bio</h2>
          <textarea
            value={newUserInformation.bio}
            className={`${styles["input"]} ${styles["bio-input"]}`}
            placeholder="Enter bio..."
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setNewUserInformation((prev) => ({ ...prev, bio: e.target.value }))
            }
          />
        </section>

        <section className={styles["action-section"]}>
          <button
            className={styles["revert-button"]}
            onClick={() =>
              setNewUserInformation({
                displayName: userInformation.displayName,
                bio: userInformation.bio || "",
                profileImageUrl: userInformation.profileImageUrl,
              })
            }
          >
            Revert
          </button>
          <button
            className={styles["save-button"]}
            onClick={() => {
              uploadProfileChanges(newUserInformation);
            }}
          >
            Save Changes
          </button>
        </section>
      </main>
    </div>
  );
};

export default EditProfile;
