import { useCallback, useEffect, useState, type ChangeEvent } from "react";
import styles from "./Upload.module.css";
import { FaPlus, FaMinus } from "react-icons/fa";
import Preview from "./Preview";
import { useUserStore } from "../../stores/userStore";
import { Toast } from "../../stores/toastStore";
import { pushPost } from "../../api/upload";
import { formatConsoleError } from "../../consoleError";
import { useAuthStore } from "../../stores/authStore";
import { useNavigate } from "react-router-dom";
import { AuthError } from "../../errors/AuthError";

export interface uploadPostStructure {
  title: string;
  coverImgFile: File | null;
  cookTime: number | null;
  servings: number | null;
  difficulty: "easy" | "medium" | "hard";
  description: string;
  steps: {
    stepNum: number;
    stepDesc: string;
    stepImgFile?: File | null;
  }[];
}

const titleMaxLength = 100;
const descriptionMaxLength = 1000;
const stepDescMaxLength = 300;
const durationMaxMins = 600;
const servingsMax = 24;
const imageMaxSizeMB = 5;
const imageAllowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

const Upload = () => {
  const userInformation = useUserStore((state) => state.userInformation);
  const signInState = useAuthStore((state) => state.signInState);
  const navigate = useNavigate();

  const [uploadPost, setUploadPost] = useState<uploadPostStructure>({
    title: "",
    coverImgFile: null,
    cookTime: null,
    servings: null,
    difficulty: "easy",
    description: "",
    steps: [{ stepNum: 1, stepDesc: "", stepImgFile: null }],
  });

  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleTitleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > titleMaxLength) return;

    setUploadPost((prev) => ({
      ...prev,
      title: e.target.value,
    }));
  }, []);

  const handleDescriptionChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > descriptionMaxLength) return;
    setUploadPost((prev) => ({
      ...prev,
      description: e.target.value,
    }));
  }, []);

  const handleCookTimeChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value < 0 || value > durationMaxMins || value % 1 !== 0) return;

    setUploadPost((prev) => ({
      ...prev,
      cookTime: value,
    }));
  }, []);

  const handleServingsChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value < 0 || value > servingsMax || value % 1 !== 0) return;
    setUploadPost((prev) => ({
      ...prev,
      servings: value,
    }));
  }, []);

  // Add new step
  const addSteps = useCallback(() => {
    setUploadPost((prev) => ({
      ...prev,
      steps: [...prev.steps, { stepNum: prev.steps.length + 1, stepDesc: "", stepImgFile: null }],
    }));
  }, []);

  const removeSteps = useCallback(() => {
    setUploadPost((prev) => {
      if (prev.steps.length <= 1) return prev;
      const updatedSteps = prev.steps.slice(0, -1).map((step, index) => ({
        ...step,
        stepNum: index + 1,
      }));
      return {
        ...prev,
        steps: updatedSteps,
      };
    });
  }, []);

  // Handle step description change
  const handleStepDescriptionChange = useCallback(
    (index: number, e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.value.length > stepDescMaxLength) return;

      setUploadPost((prev) => {
        const updatedSteps = [...prev.steps];
        updatedSteps[index].stepDesc = e.target.value;
        return {
          ...prev,
          steps: updatedSteps,
        };
      });
    },
    []
  );

  // Handle step image upload
  const handleStepImage = useCallback((index: number, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      e.target.value = "";
      return;
    }

    if (imageFileValidation(file!) === false) {
      e.target.value = "";
      return;
    }

    setUploadPost((prev) => {
      const updatedSteps = [...prev.steps];
      updatedSteps[index].stepImgFile = file;
      return {
        ...prev,
        steps: updatedSteps,
      };
    });
  }, []);

  const imageFileValidation = (file: File): Boolean => {
    if (file.size > imageMaxSizeMB * 1024 * 1024) {
      Toast({
        title: "File Too Large",
        message: "Please upload an image smaller than 5MB.",
        type: "error",
      });
      return false;
    }

    if (!imageAllowedTypes.includes(file.type)) {
      Toast({
        title: "Invalid File Type",
        message: "Please upload a JPEG, PNG, JPG, or WEBP image.",
        type: "error",
      });
      return false;
    }
    return true;
  };

  // Handle header image upload
  const handleHeaderImage = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      e.target.value = "";
      return;
    }

    if (imageFileValidation(file!) === false) {
      e.target.value = "";
      return;
    }

    setUploadPost((prev) => ({
      ...prev,
      coverImgFile: file,
    }));
  }, []);

  // Handle upload
  const handleUpload = async () => {
    if (
      !uploadPost.title ||
      !uploadPost.description ||
      uploadPost.steps.length === 0 ||
      !uploadPost.coverImgFile ||
      uploadPost.cookTime === null ||
      uploadPost.servings === null
    ) {
      Toast({
        title: "Missing Fields",
        message: "Please fill in all required fields.",
        type: "error",
      });
      return;
    }

    if (isUploading) return;

    setIsUploading(true);

    try {
      await pushPost(uploadPost);
      Toast({
        title: "Upload Successful",
        message: "Your post has been uploaded successfully.",
        type: "success",
      });
      setUploadPost({
        title: "",
        coverImgFile: null,
        cookTime: 0,
        servings: 1,
        difficulty: "easy",
        description: "",
        steps: [{ stepNum: 1, stepDesc: "", stepImgFile: null }],
      });
    } catch (error) {
      if (error instanceof AuthError && error.status === 401) {
        await useAuthStore.getState().requestNewAccessToken();

        try {
          await pushPost(uploadPost);
          Toast({
            title: "Upload Successful",
            message: "Your post has been uploaded successfully.",
            type: "success",
          });
          setUploadPost({
            title: "",
            coverImgFile: null,
            cookTime: 0,
            servings: 1,
            difficulty: "easy",
            description: "",
            steps: [{ stepNum: 1, stepDesc: "", stepImgFile: null }],
          });
        } catch (error) {
          formatConsoleError("upload.ts", "pushPost after token refresh", error);
          Toast({
            title: "Upload Failed",
            message: "You aren't signed in. Please sign in again.",
            type: "error",
          });
        }
      } else {
        formatConsoleError("upload.ts", "pushPost", error);
        Toast({
          title: "Upload Failed",
          message: "There was an error uploading your post. Please try again.",
          type: "error",
        });
      }
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (signInState !== "authorized") {
      navigate("/profile");
    }
  });

  return (
    <>
      <div className={`${styles["upload-page"]} ${showPreview ? styles["blurred"] : ""}`}>
        <section className={styles["section"]}>
          <div className={styles["section-title"]}>Post Image</div>
          <input
            className={styles["input"]}
            type="file"
            accept="image/*"
            onChange={handleHeaderImage}
          />

          {uploadPost.coverImgFile && (
            <img
              src={URL.createObjectURL(uploadPost.coverImgFile)}
              alt="Preview"
              className={styles["cover-image"]}
            />
          )}
        </section>

        <section className={styles["section"]}>
          <div className={styles["section-title"]}>
            Title ({titleMaxLength - uploadPost.title.length})
          </div>
          <input
            className={styles["input"]}
            type="text"
            value={uploadPost.title}
            placeholder="Enter title here..."
            onChange={handleTitleChange}
          />
        </section>

        <section className={styles["section"]}>
          <div className={styles["section-title"]}>
            Description ({descriptionMaxLength - uploadPost.description.length})
          </div>
          <input
            className={styles["input"]}
            type="text"
            value={uploadPost.description}
            placeholder="Enter title here..."
            onChange={handleDescriptionChange}
          />
        </section>

        <section className={styles["section"]}>
          <div className={styles["section-title"]} style={{ justifyContent: "space-between" }}>
            <div>Duration</div>
            <div>Difficulty</div>
            <div>Servings</div>
          </div>
          <div className={styles["info-input-group"]}>
            <input
              className={styles["input"]}
              type="number"
              placeholder="(max 600 mins)"
              value={uploadPost.cookTime ?? ""}
              onChange={handleCookTimeChange}
            />
            <select
              className={styles["select"]}
              value={uploadPost.difficulty}
              onChange={(e) =>
                setUploadPost((prev) => ({
                  ...prev,
                  difficulty: e.target.value as any,
                }))
              }
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <input
              type="number"
              value={uploadPost.servings ?? ""}
              placeholder="(max 24 servings)"
              className={styles["input"]}
              onChange={handleServingsChange}
            />
          </div>
        </section>

        <section className={styles["section"]}>
          <div className={styles["section-title"]}>Steps</div>
          {uploadPost.steps.map((step, index) => (
            <div className={styles["step"]} key={index}>
              <div className={styles["step-wrapper"]}>
                <div className={styles["step-number"]}>
                  Step {step.stepNum} ({stepDescMaxLength - step.stepDesc.length})
                </div>
                <input
                  value={step.stepDesc}
                  type="text"
                  className={styles["step-input"]}
                  placeholder="Enter title here..."
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    handleStepDescriptionChange(index, e);
                  }}
                />
              </div>

              <div className={styles["step-image-uploader-wrapper"]}>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className={styles["step-image-uploader"]}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleStepImage(index, e)}
                />
              </div>
              {step.stepImgFile && (
                <img className={styles["step-image"]} src={URL.createObjectURL(step.stepImgFile)} />
              )}
            </div>
          ))}
          <div className={styles["action-container"]}>
            <button className={styles["add-step-button"]} onClick={removeSteps}>
              <FaMinus size={24} />
            </button>
            <button className={styles["add-step-button"]} onClick={addSteps}>
              <FaPlus size={24} />
            </button>
          </div>
        </section>

        <section
          className={styles["section"]}
          style={{
            flexDirection: "row",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          <button
            className={styles["preview-button"]}
            onClick={() => {
              setUploadPost({
                title: "",
                coverImgFile: null,
                cookTime: 0,
                servings: 1,
                difficulty: "easy",
                description: "",
                steps: [{ stepNum: 1, stepDesc: "", stepImgFile: null }],
              });
            }}
          >
            Reset
          </button>

          <button
            className={styles["preview-button"]}
            onClick={() => {
              setShowPreview(!showPreview);
            }}
          >
            Preview
          </button>
          <button className={styles["upload-button"]} onClick={handleUpload}>
            Upload
          </button>
        </section>
      </div>

      {showPreview && (
        <Preview
          uploadPost={uploadPost}
          userInformation={userInformation}
          setShowPreview={setShowPreview}
        />
      )}
    </>
  );
};

export default Upload;
