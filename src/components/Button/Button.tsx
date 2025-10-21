import React from "react";
import styles from "./Button.module.css";

interface ButtonProps {
  children: React.ReactNode;
  size?: "small" | "medium" | "large";
  variant?: "primary" | "secondary" | "circular";
  fullWidth?: boolean;
  type?: "submit" | "reset" | "button";
  style?: React.CSSProperties;
  onClick?: () => void;
}

const Button = ({
  children,
  size = "small",
  variant = "primary",
  fullWidth = false,
  type = "button",
  style,
  onClick,
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`${styles.btn} ${styles[size]} ${styles[variant]} ${
        fullWidth ? styles.fullWidth : ""
      }`}
      onClick={onClick}
      style={style}
    >
      {children}
    </button>
  );
};

export default Button;
