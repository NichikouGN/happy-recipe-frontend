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
import styles from "./Signup.module.css";
import Button from "../../components/Button/Button";
import { useNavigate, NavLink } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  //Hooks
  const { signInState, signUp } = useAuthContext();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  //Toggle password show/hide
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword]);

  //Toggle confirm password show/hide
  const toggleConfirmPasswordVisibility = useCallback(() => {
    setShowConfirmPassword(!showConfirmPassword);
  }, [showConfirmPassword]);

  //Update first name in real time
  const handleFirstNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setFirstName(event.target.value);
    },
    []
  );

  //Update last name in real time
  const handleLastNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setLastName(event.target.value);
    },
    []
  );

  //Update email in real time
  const handleUsernameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setEmail(event.target.value);
    },
    []
  );

  //Update password in real time
  const handlePasswordChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setPassword(event.target.value);
    },
    []
  );

  //Update confirm password in real time
  const handleConfirmPasswordChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setConfirmPassword(event.target.value);
    },
    []
  );

  //Handle submission
  const handleSubmission = async (event: FormEvent) => {
    event.preventDefault();

    if (password !== confirmPassword) return alert("Password does not match");

    if (!email || !password) {
      return alert("Email and password are required");
    }

    if (!firstName || !lastName) {
      return alert("First name and last name is required");
    }

    // if (email === "admin" && password === "123")
    signUp("abc", firstName, lastName, email, password);
  };

  //Reroute base on singin state
  useEffect(() => {
    if (signInState === "2FA") {
      navigate("/authentication");
    } else if (signInState === "authorized") {
      navigate(-1);
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
        Welcome to our community of passionate chefs all around the world
      </div>

      <div className={styles["log-in-menu"]}>
        <form
          onSubmit={(event) => {
            handleSubmission(event);
          }}
        >
          {/*Username Input*/}

          <div className={styles["input-wrapper"]}>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              alt="Enter your username"
              autoComplete="off"
              className={`${styles["input-field"]} ${styles["name-field"]}`}
              onChange={(event) => {
                handleFirstNameChange(event);
              }}
            />

            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              alt="Enter your username"
              autoComplete="off"
              className={`${styles["input-field"]} ${styles["name-field"]}`}
              onChange={(event) => {
                handleLastNameChange(event);
              }}
            />
          </div>

          <div className={styles["input-wrapper"]}>
            <FaUser className={styles["input-icon"]} />
            <input
              type="text"
              placeholder="Enter your email"
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

          <div className={styles["input-wrapper"]}>
            <FaLock className={styles["input-icon"]} />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Retype your password"
              value={confirmPassword}
              alt="Enter your username"
              autoComplete="off"
              className={styles["input-field"]}
              onChange={(event) => {
                handleConfirmPasswordChange(event);
              }}
            ></input>

            <button
              type="button"
              className={styles["toggle-password"]}
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>

          {/*Submit*/}
          <Button variant="primary" size="small" type="submit" fullWidth={true}>
            Sign Up
          </Button>
        </form>

        <div className={styles["signup-quote"]}>
          Already have an accrount?&nbsp;
          <NavLink to="/login" className={styles["signup-btn"]}>
            Log in
          </NavLink>
          &nbsp;now.
        </div>
      </div>
    </div>
  );
};

export default Signup;
