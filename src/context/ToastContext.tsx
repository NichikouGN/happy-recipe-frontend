import {
  createContext,
  useCallback,
  useContext,
  useState,
  type FC,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import styles from "../components/Toast/Toast.module.css";

interface ToastStructure {
  id: string;
  type: "error" | "warning" | "info";
  title?: string;
  message?: string;
}

const ToastContext = createContext<
  | {
      Toast: (toast: Omit<ToastStructure, "id">) => void;
    }
  | undefined
>(undefined);

export const ToastContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toastList, setToastList] = useState<ToastStructure[]>([]);

  const Toast = useCallback(
    ({ type, title, message }: Omit<ToastStructure, "id">) => {
      const id = Math.random().toString(36).slice(2);

      setToastList((prev) => [...prev, { id, type, title, message }]);

      setTimeout(() => {
        setToastList((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ Toast }}>
      {children}
      {createPortal(
        toastList.map((toast) => {
          return (
            <div
              key={toast.id}
              className={`${styles["container"]} ${styles[toast.type]}`}
            >
              <div className={styles["title"]}>{toast.title}</div>
              <div className={styles["message"]}>{toast.message}</div>
            </div>
          );
        }),
        document.body
      )}
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("Error");
  }

  return context;
};
