import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import {
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useAuthContext } from "../../context/AuthContext";
import { IoClose } from "react-icons/io5";
import styles from "./Login.module.css";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  //Hooks
  const { login, loginState } = useAuthContext();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  //Toggle password show/hide
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword]);

  //Update username hook
  const handleUsernameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setEmail(event.target.value);
    },
    []
  );

  //Update password hook
  const handlePasswordChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setPassword(event.target.value);
    },
    []
  );

  //Handle submission
  const handleSubmission = async (event: FormEvent) => {
    event.preventDefault();

    if (!email || !password) {
      alert("Email and password are required");
    }

    if (email === "admin" && password === "123") login(email, password);
  };

  useEffect(() => {
    if (loginState === "2FA") {
      navigate("/authentication");
    } else if (loginState === "authorized") {
      navigate(-1);
    }
  }, [loginState, navigate]);

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
        Login or Sign up to join our community of passionate chefs all around
        the world
      </div>

      <div className={styles["log-in-menu"]}>
        <form
          onSubmit={(event) => {
            handleSubmission(event);
          }}
        >
          {/*Username Input*/}

          <div className={styles["input-wrapper"]}>
            <FaUser className={styles["input-icon"]} />
            <input
              type="text"
              placeholder="Enter your username"
              value={email}
              alt="Enter your username"
              autoComplete="off"
              className={styles["input-field"]}
              onChange={(event) => {
                handleUsernameChange(event);
              }}
            ></input>
          </div>

          {/*Password Input*/}
          <div className={styles["input-wrapper"]}>
            <FaLock className={styles["input-icon"]} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              alt="Enter your password"
              autoComplete="off"
              className={styles["input-field"]}
              onChange={(event) => {
                handlePasswordChange(event);
              }}
            ></input>

            {/* Show/Hide password*/}
            <button
              type="button"
              className={styles["toggle-password"]}
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
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

        <div className={styles["signup-quote"]}>
          New to Happy Recipe? <a className={styles["signup-btn"]}>Sign up</a>{" "}
          today
        </div>
      </div>
    </div>
  );
};

export default Login;
