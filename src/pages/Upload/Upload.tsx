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
  cookTime: number;
  servings: number;
  difficulty: "easy" | "medium" | "hard";
  description: string;
  steps: {
    stepNum: number;
    stepDesc: string;
    stepImgFile?: File | null;
  }[];
}

const Upload = () => {
  const userInformation = useUserStore((state) => state.userInformation);
  const signInState = useAuthStore((state) => state.signInState);
  const navigate = useNavigate();

  const [uploadPost, setUploadPost] = useState<uploadPostStructure>({
    title: "",
    coverImgFile: null,
    cookTime: 0,
    servings: 1,
    difficulty: "easy",
    description: "",
    steps: [{ stepNum: 1, stepDesc: "", stepImgFile: null }],
  });

  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

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
  const handleStepDescriptionChange = useCallback((index: number, value: string) => {
    setUploadPost((prev) => {
      const updatedSteps = [...prev.steps];
      updatedSteps[index].stepDesc = value;
      return {
        ...prev,
        steps: updatedSteps,
      };
    });
  }, []);

  // Handle step image upload
  const handleStepImage = useCallback((index: number, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadPost((prev) => {
        const updatedSteps = [...prev.steps];
        updatedSteps[index].stepImgFile = file;
        return {
          ...prev,
          steps: updatedSteps,
        };
      });
    }
  }, []);

  // Handle header image upload
  const handleHeaderImage = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadPost((prev) => ({
        ...prev,
        coverImgFile: file,
      }));
    }
  }, []);

  // Handle upload
  const handleUpload = async () => {
    if (
      !uploadPost.title ||
      !uploadPost.description ||
      uploadPost.steps.length === 0 ||
      !uploadPost.coverImgFile
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
          <div className={styles["section-title"]}>Title</div>
          <input
            className={styles["input"]}
            type="text"
            value={uploadPost.title}
            placeholder="Enter title here..."
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setUploadPost((prev) => ({ ...prev, title: e.target.value }))
            }
          />
        </section>

        <section className={styles["section"]}>
          <div className={styles["section-title"]}>Descripton</div>
          <input
            className={styles["input"]}
            type="text"
            value={uploadPost.description}
            placeholder="Enter title here..."
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setUploadPost((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
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
              value={uploadPost.cookTime}
              placeholder="Enter title here..."
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setUploadPost((prev) => ({
                  ...prev,
                  cookTime: Number(e.target.value),
                }))
              }
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
              value={uploadPost.servings}
              className={styles["input"]}
              placeholder="Enter title here..."
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setUploadPost((prev) => ({
                  ...prev,
                  servings: Number(e.target.value),
                }))
              }
            />
          </div>
        </section>

        <section className={styles["section"]}>
          <div className={styles["section-title"]}>Steps</div>
          {uploadPost.steps.map((step, index) => (
            <div className={styles["step"]} key={index}>
              <div className={styles["step-wrapper"]}>
                <div className={styles["step-number"]}>Step {step.stepNum}</div>
                <input
                  value={step.stepDesc}
                  type="text"
                  className={styles["step-input"]}
                  placeholder="Enter title here..."
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    handleStepDescriptionChange(index, e.target.value);
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
          authorName={userInformation.username}
          setShowPreview={setShowPreview}
        />
      )}
    </>
  );
};

export default Upload;
