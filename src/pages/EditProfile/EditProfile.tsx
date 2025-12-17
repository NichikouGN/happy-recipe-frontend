import { Link } from "react-router-dom";
import styles from "./EditProfile.module.css";
import { IoClose } from "react-icons/io5";
import { useUserStore } from "../../stores/userStore";
import { uploadProfileChanges } from "../../api/editProfile";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const EditProfileSchema = z.object({
  displayName: z.string().min(3, "Display name must be at least 3 characters long"),
  bio: z.string().max(160, "Bio must be at most 160 characters long"),
  profileImageUrl: z.instanceof(File).refine((file) => !file || file.size <= 5000000, {
    message: "Profile image must be less than 5MB",
  }),
});

interface newUserInformation {
  displayName: string;
  bio: string;
  profileImageUrl: File;
}

const EditProfile = () => {
  const userInformation = useUserStore.getState().userInformation;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof EditProfileSchema>>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      displayName: userInformation.displayName,
      bio: userInformation.bio || "",
    },
  });

  const onSubmit = (data: z.infer<typeof EditProfileSchema>) => {
    const updatedInfo: newUserInformation = {
      displayName: data.displayName,
      bio: data.bio,
      profileImageUrl: data.profileImageUrl ? data.profileImageUrl : new File([], ""),
    };
    uploadProfileChanges(updatedInfo);
  };

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
            {...register("profileImageUrl")}
          />
          <img
            src={
              watch("profileImageUrl") instanceof File
                ? URL.createObjectURL(watch("profileImageUrl"))
                : watch("profileImageUrl")
            }
            className={styles["preview-profile-image"]}
          />
        </section>

        <div className={styles["divider"]}>•</div>

        <section className={styles["edit-section"]}>
          <h2>Display Name</h2>
          <input
            className={styles["input"]}
            type="text"
            placeholder="Enter display name..."
            {...register("displayName")}
          />
        </section>

        <div className={styles["divider"]}>•</div>

        <section className={styles["edit-section"]}>
          <h2>Bio</h2>
          <textarea
            className={`${styles["input"]} ${styles["bio-input"]}`}
            placeholder="Enter bio..."
            {...register("bio")}
          />
        </section>

        <section className={styles["action-section"]}>
          <button
            className={styles["revert-button"]}
            onClick={() =>
              reset({
                displayName: userInformation.displayName,
                bio: userInformation.bio || "",
                profileImageUrl: new File([], userInformation.profileImageUrl),
              })
            }
          >
            Revert
          </button>
          <button className={styles["save-button"]} onClick={handleSubmit(onSubmit)}>
            Save Changes
          </button>
        </section>
      </main>
    </div>
  );
};

export default EditProfile;
