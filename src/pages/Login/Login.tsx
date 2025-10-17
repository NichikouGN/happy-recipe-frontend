import styles from "./LogInScreen.module.css";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaRegMoon } from "react-icons/fa";
import { IoSunnySharp } from "react-icons/io5";
import { useCallback, useState, type ChangeEvent, type FormEvent } from "react";
import { motion, AnimatePresence, type Transition } from "framer-motion";
import { useAuthContext } from "../../context/AuthContext";
import { useThemeContext } from "../../context/ThemeContext";

const iconVariants = {
  initial: {
    x: 50,
    y: 50,
  },
  animate: {
    x: 0,
    y: 0,
  },
  exit: {
    x: -50,
    y: 50,
  },
};

const iconTransition: Transition = {
  duration: 0.3,
  ease: "easeInOut",
};

const LogInScreen = () => {
  //Hooks
  const { login } = useAuthContext();
  const { themeColor, updateTheme } = useThemeContext();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  //Toggle password show/hide
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword]);

  //Update username hook
  const handleUsernameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setUsername(event.target.value);
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
  const handleSubmission = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      login(username, password);

      setUsername("");
      setPassword("");
    },
    [username, password]
  );

  return (
    <>
      {/*Background Image*/}
      <img
        src="https://chicom.vn/static/media/Homebg.5e211af7.png"
        className={styles["bg-img"]}
      />

      {/*Light/Dark Mode Switch*/}
      <button
        className={styles["theme-toggle-container"]}
        onClick={updateTheme}
      >
        <AnimatePresence>
          {" "}
          {/*Animation for the 2 icons*/}
          <motion.div
            key={themeColor}
            variants={iconVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={iconTransition}
            className={styles["theme-toggle-wrapper"]}
          >
            {themeColor === "dark" ? (
              <FaRegMoon className={styles["theme-toggle-icon"]} />
            ) : (
              <IoSunnySharp className={styles["theme-toggle-icon"]} />
            )}
          </motion.div>
        </AnimatePresence>
      </button>

      {/*Login Menu*/}
      <div className={styles["log-in-menu"]}>
        <header>
          <h2>
            <img src="https://chicom.vn/favicon.ico" />
            <br /> Admin Dashboard
          </h2>
        </header>
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
              value={username}
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
          <button
            type="submit"
            className={`${styles["submit-button"]} ${
              styles[username && password && "active"]
            }`}
          >
            <p>Log In</p>
          </button>
        </form>
      </div>
    </>
  );
};

export default LogInScreen;
