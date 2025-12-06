import { useCallback, useState, type ChangeEvent } from "react";
import styles from "./Upload.module.css";
import { IoAdd } from "react-icons/io5";
import Preview from "./Preview";
import { useUserContext } from "../../context/userContext";
import { useToastContext } from "../../context/ToastContext";
import type { FullPostStructure } from "../../types/PostType";

export interface uploadPostStructure
  extends Omit<
    FullPostStructure,
    "postId" | "authorID" | "authorName" | "reactions" | "userActions"
  > {}

const Upload = () => {
  const { userInformation } = useUserContext();
  const { Toast } = useToastContext();

  const [uploadPost, setUploadPost] = useState<uploadPostStructure>({
    title: "",
    coverImgUrl: "",
    cookTime: 0,
    servings: 1,
    difficulty: "easy",
    description: "",
    steps: [{ stepNum: 1, stepDesc: "", stepImgURL: "" }],
  });

  const [showPreview, setShowPreview] = useState<boolean>(false);

  // Add new step
  const addSteps = useCallback(() => {
    setUploadPost((prev) => ({
      ...prev,
      steps: [
        ...prev.steps,
        { stepNum: prev.steps.length + 1, stepDesc: "", stepImgURL: "" },
      ],
    }));
  }, []);

  // Handle step description change
  const handleStepDescriptionChange = useCallback(
    (index: number, value: string) => {
      console.log("Updating step", index, "with value", value);
      setUploadPost((prev) => {
        const updatedSteps = [...prev.steps];
        updatedSteps[index].stepDesc = value;
        return {
          ...prev,
          steps: updatedSteps,
        };
      });
    },
    []
  );

  // Handle step image upload
  const handleStepImage = useCallback(
    (index: number, e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setUploadPost((prev) => {
          const updatedSteps = [...prev.steps];
          updatedSteps[index].stepImgURL = URL.createObjectURL(file);
          return {
            ...prev,
            steps: updatedSteps,
          };
        });
      }
    },
    []
  );

  // Handle header image upload
  const handleHeaderImage = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadPost((prev) => ({
        ...prev,
        coverImgUrl: URL.createObjectURL(file),
      }));
    }
  }, []);

  // Handle upload
  const handleUpload = useCallback(() => {
    if (
      !uploadPost.title ||
      !uploadPost.description ||
      uploadPost.steps.length === 0 ||
      !uploadPost.coverImgUrl
    ) {
      Toast({
        title: "Missing Fields",
        message: "Please fill in all required fields.",
        type: "error",
      });
      return;
    }
  }, [uploadPost, Toast]);

  return (
    <>
      <div
        className={`${styles["upload-page"]} ${
          showPreview ? styles["blurred"] : ""
        }`}
      >
        <section className={styles["section"]}>
          <div className={styles["section-title"]}>Post Image</div>
          <input
            className={styles["input"]}
            type="file"
            accept="image/*"
            onChange={handleHeaderImage}
          />

          {uploadPost.coverImgUrl && (
            <img
              src={uploadPost.coverImgUrl}
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
          <div
            className={styles["section-title"]}
            style={{ justifyContent: "space-between" }}
          >
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
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleStepImage(index, e)
                  }
                />
              </div>
              {step.stepImgURL && (
                <img
                  className={styles["step-image"]}
                  src={step.stepImgURL}
                />
              )}
            </div>
          ))}
          <button className={styles["add-step-button"]} onClick={addSteps}>
            <IoAdd size={24} />
          </button>
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
