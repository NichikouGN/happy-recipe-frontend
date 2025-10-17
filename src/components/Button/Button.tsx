import React from "react";
import styles from "./Button.module.css";

interface ButtonProps {
  children: React.ReactNode;
  size?: "small" | "medium" | "large";
  variant?: "primary" | "secondary" | "circular";
  fullWidth?: boolean;
  onClick?: () => void;
}

const Button = ({
  children,
  size = "small",
  variant = "primary",
  fullWidth = false,
  onClick,
}: ButtonProps) => {
  return (
    <button
      className={`${styles.btn} ${styles[size]} ${styles[variant]} ${
        fullWidth ? styles.fullWidth : ""
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
