import styles from "./Toggle.module.css";

interface ToggleProps {
  size?: "small" | "medium" | "large";
  variant?: "";
  state?: "on" | "off";
  onClick?: () => void;
}

const Toggle = ({
  size = "small",
  variant = "",
  state = "on",
  onClick,
}: ToggleProps) => {
  return (
    <button
      className={`${styles.toggle} ${styles[size]} ${styles[variant]} ${styles[state]}`}
      onClick={onClick}
    >
      <div className={`${styles["toggle-ball"]} ${styles[state]}`}></div>
    </button>
  );
};

export default Toggle;
