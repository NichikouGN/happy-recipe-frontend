import { FaUser, FaLock, FaEye, FaEyeSlash, FaUnlock } from "react-icons/fa";
import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { IoClose } from "react-icons/io5";
import styles from "./Signin.module.css";
import Button from "../../components/Button/Button";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const signInSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

const Signin = () => {
  const navigate = useNavigate();
  //Hooks
  const signIn = useAuthStore((state) => state.signIn);
  const signInState = useAuthStore((state) => state.signInState);

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = useCallback(
    async (data: z.infer<typeof signInSchema>) => {
      await signIn(data.email, data.password);
    },
    [signIn]
  );

  //Forward to page passed on signin state
  useEffect(() => {
    if (signInState === "2FA") {
      navigate("/signin/2fa");
    } else if (signInState === "authorized") {
      navigate("/");
    }
  }, [signInState, navigate]);

  return (
    signInState === "unauthorized" && (
      <div className={styles["signin-bg"]}>
        <Link to="/" className={styles["return"]}>
          <IoClose className={styles["return-icon"]} />
        </Link>
        <div className={styles["signin-container"]}>
          <div className={styles["title"]}>
            <img src="/src/assets/happy-recipe-logo-text.png" className={styles["title-logo"]} />
            <h1 className={styles["title-text"]}>Happy Recipe</h1>
          </div>

          <h2 className={styles["quote"]}>
            Sign in to join our community of passionate chefs all around the world
          </h2>

          <div className={styles["signin-menu"]}>
            <form className={styles["signin-form"]} onSubmit={handleSubmit(onSubmit)}>
              {/*Email Input*/}
              <div className={styles["input-wrapper"]}>
                <FaUser className={styles["input-icon"]} />
                <input
                  type="text"
                  placeholder="Enter your username"
                  alt="Enter your username"
                  autoComplete="off"
                  className={styles["input-field"]}
                  {...register("email")}
                />
              </div>
              {errors.email && <div className={styles["error-text"]}>{errors.email.message}</div>}

              {/*Password Input*/}
              <div className={styles["input-wrapper"]}>
                <FaUnlock className={styles["input-icon"]} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  alt="Enter your password"
                  autoComplete="off"
                  className={styles["input-field"]}
                  {...register("password")}
                />

                {/* Show/Hide password*/}
                <button
                  type="button"
                  className={styles["toggle-password"]}
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
              {errors.password && (
                <div className={styles["error-text"]}>{errors.password.message}</div>
              )}

              {/*Submit*/}
              <Button variant="primary" size="small" type="submit" fullWidth={true}>
                Sign In
              </Button>
            </form>
          </div>
          <section className={styles["reroute"]}>
            <div className={styles["signup-quote"]}>
              New user?&nbsp;
              <NavLink to="/signup" className={styles["signup-btn"]}>
                Sign Up
              </NavLink>
              &nbsp;today
            </div>
          </section>
        </div>
      </div>
    )
  );
};

export default Signin;
