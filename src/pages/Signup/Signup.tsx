import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { IoClose } from "react-icons/io5";
import styles from "../Signin/Signin.module.css";
import Button from "../../components/Button/Button";
import { useNavigate, NavLink, Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const signUpSchema = z
  .object({
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters long"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const Signup = () => {
  const navigate = useNavigate();
  //Hooks
  const signInState = useAuthStore((state) => state.signInState);
  const signUp = useAuthStore((state) => state.signUp);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
  });

  //Toggle password show/hide
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword]);

  //Toggle confirm password show/hide
  const toggleConfirmPasswordVisibility = useCallback(() => {
    setShowConfirmPassword(!showConfirmPassword);
  }, [showConfirmPassword]);

  //Handle submission
  const obSubmit = useCallback(
    async (data: z.infer<typeof signUpSchema>) => {
      await signUp(data.firstName, data.lastName, data.email, data.password);
    },
    [signUp]
  );

  //Reroute base on singin state
  useEffect(() => {
    if (signInState === "2FA") {
      navigate("/authentication");
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
            <div className={styles["title-text"]}>Happy Recipe</div>
          </div>

          <div className={styles["quote"]}>
            Welcome to our community of passionate chefs all around the world
          </div>

          <div className={styles["signin-menu"]}>
            <form className={styles["signin-form"]} onSubmit={handleSubmit(obSubmit)}>
              {/*Username Input*/}

              <div className={styles["input-wrapper"]}>
                <input
                  type="text"
                  placeholder="First Name"
                  alt="Enter your username"
                  autoComplete="off"
                  className={`${styles["input-field"]} ${styles["name-field"]}`}
                  {...register("firstName")}
                />

                <input
                  type="text"
                  placeholder="Last Name"
                  alt="Enter your username"
                  autoComplete="off"
                  className={`${styles["input-field"]} ${styles["name-field"]}`}
                  {...register("lastName")}
                />
              </div>
              {errors.firstName && (
                <div className={styles["error-text"]}>{errors.firstName.message}</div>
              )}
              {errors.lastName && (
                <div className={styles["error-text"]}>{errors.lastName.message}</div>
              )}

              <div className={styles["input-wrapper"]}>
                <FaUser className={styles["input-icon"]} />
                <input
                  type="text"
                  placeholder="Enter your email"
                  alt="Enter your username"
                  autoComplete="off"
                  className={styles["input-field"]}
                  {...register("email")}
                />
              </div>
              {errors.email && <div className={styles["error-text"]}>{errors.email.message}</div>}

              {/*Password Input*/}
              <div className={styles["input-wrapper"]}>
                <FaLock className={styles["input-icon"]} />
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

              <div className={styles["input-wrapper"]}>
                <FaLock className={styles["input-icon"]} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Retype your password"
                  alt="Enter your username"
                  autoComplete="off"
                  className={styles["input-field"]}
                  {...register("confirmPassword")}
                />

                <button
                  type="button"
                  className={styles["toggle-password"]}
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>

              {errors.confirmPassword && (
                <div className={styles["error-text"]}>{errors.confirmPassword.message}</div>
              )}

              {/*Submit*/}
              <Button variant="primary" size="small" type="submit" fullWidth={true}>
                Sign Up
              </Button>
            </form>
          </div>
          <section className={styles["reroute"]}>
            <div className={styles["signup-quote"]}>
              Already have an account?&nbsp;
              <NavLink to="/signin" className={styles["signup-btn"]}>
                Sign In
              </NavLink>
              &nbsp;now!
            </div>
          </section>
        </div>
      </div>
    )
  );
};

export default Signup;
