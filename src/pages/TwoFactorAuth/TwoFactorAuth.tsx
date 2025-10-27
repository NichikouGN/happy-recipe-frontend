import { TbAuth2Fa } from "react-icons/tb";
import {
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useAuthContext } from "../../context/AuthContext";
import { IoClose } from "react-icons/io5";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";
import styles from "./TwoFactorAuth.module.css";

const TwoFactorAuth = () => {
  const navigate = useNavigate();
  //Hooks
  const { verify2FA, signInState } = useAuthContext();
  const [twoFactor, setTwoFactor] = useState<string>("");

  //Update username hook
  const handleTwoFactorChanges = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setTwoFactor(event.target.value);
    },
    []
  );

  //Handle submission
  const handleSubmission = async (event: FormEvent) => {
    event.preventDefault();

    if (await verify2FA(twoFactor)) {
    }
  };

  useEffect(() => {
    if (signInState === "authorized") {
      navigate("/");
    }
  }, [signInState, navigate]);

  return (
    <div className={styles["login-container"]}>
      <div className={styles["return"]}>
        <IoClose
          className={styles["return-icon"]}
          onClick={() => {
            navigate("/");
          }}
        />
      </div>

      <div className={styles["title"]}>
        <img
          src="/src/assets/happy-recipe-logo-text.png"
          className={styles["title-logo"]}
        />
        <div className={styles["title-text"]}>Happy Recipe</div>
      </div>

      <div className={styles["quote"]}>
        Enter the 2FA code sent to your email
      </div>

      <div className={styles["log-in-menu"]}>
        <form
          onSubmit={(event) => {
            handleSubmission(event);
          }}
        >
          {/*Username Input*/}

          <div className={styles["input-wrapper"]}>
            <TbAuth2Fa className={styles["input-icon"]} />
            <input
              type="text"
              placeholder="verification code"
              value={twoFactor}
              alt="verification code"
              autoComplete="off"
              className={styles["input-field"]}
              onChange={(event) => {
                handleTwoFactorChanges(event);
              }}
            ></input>
          </div>

          {/*Submit*/}
          <Button
            variant="primary"
            size="small"
            type="submit"
            style={{ width: "100%" }}
          >
            Log In
          </Button>
        </form>
      </div>
    </div>
  );
};

export default TwoFactorAuth;
