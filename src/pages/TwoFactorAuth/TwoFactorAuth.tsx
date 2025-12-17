import { TbAuth2Fa } from "react-icons/tb";
import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useAuthStore } from "../../stores/authStore";
import { IoClose } from "react-icons/io5";
import Button from "../../components/Button/Button";
import { Link, useNavigate } from "react-router-dom";
import styles from "../Signin/Signin.module.css";

const TwoFactorAuth = () => {
  const navigate = useNavigate();
  //Hooks
  const verify2FA = useAuthStore((state) => state.verify2FA);
  const signInState = useAuthStore((state) => state.signInState);
  const setSignInState = useAuthStore((state) => state.setSignInState);

  const [twoFactor, setTwoFactor] = useState<string>("");

  //Update 2FA in real time
  const handleTwoFactorChanges = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setTwoFactor(event.target.value);
  }, []);

  //Handle submission
  const handleSubmission = async (event: FormEvent) => {
    event.preventDefault();

    await verify2FA(twoFactor);
  };

  //Reroute base on signin state
  useEffect(() => {
    if (signInState === "authorized") {
      navigate("/");
    } else if (signInState === "unauthorized") {
      navigate("/signin");
    }
  }, [signInState, navigate]);

  return (
    signInState === "2FA" && (
      <div className={styles["signin-container"]}>
        <Link
          to="/"
          className={styles["return"]}
          onClick={() => {
            setSignInState("unauthorized");
          }}
        >
          <IoClose className={styles["return-icon"]} />
        </Link>

        <div className={styles["title"]}>
          <img src="/src/assets/happy-recipe-logo-text.png" className={styles["title-logo"]} />
          <div className={styles["title-text"]}>Happy Recipe</div>
        </div>

        <div className={styles["quote"]}>Enter the 2FA code sent to your email</div>

        <div className={styles["signin-menu"]}>
          <form
            className={styles["signin-form"]}
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
            <Button variant="primary" size="small" type="submit" fullWidth={true}>
              Log In
            </Button>
          </form>
        </div>
      </div>
    )
  );
};

export default TwoFactorAuth;
