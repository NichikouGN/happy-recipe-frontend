import {
  createContext,
  useCallback,
  useContext,
  useState,
  type FC,
  type ReactNode,
} from "react";

const AuthContext = createContext<
  | {
      username: string;
      accessToken: string;
      setAccessToken: (accessToken: string) => void;
      refreshToken: string;
      setRefreshToken: (refreshToken: string) => void;
      isAuthorized: Boolean;
      login: (name: string, password: string) => void;
      validate: () => void;
      logout: () => void;
    }
  | undefined
>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState<string>("");
  const [isAuthorized, setIsAuthorized] = useState<Boolean>(false);
  const [accessToken, setAccessToken] = useState<string>("");
  const [refreshToken, setRefreshToken] = useState<string>("");

  //Login method
  const login = useCallback((name: string, password: string) => {
    // const loginFetch = async () => {
    //   try {
    //     const res = await fetch("http://localhost:4000/login", {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({ username: name, password: password }),
    //     });

    //     if (!res.ok) {
    //       const errText = await res.text();
    //       throw new Error(`Error ${res.status}: ${errText}`);
    //     }

    //     const data = await res.json();
    //     setAccessToken(data.accessToken);
    //     setRefreshToken(data.refreshToken);
    //     setUsername(data.username);
    //     setIsAuthorized(true);
    //   } catch (error: any) {
    //     if (error.message.includes(401)) {
    //       alert("Your username or password is incorrect");
    //     } else if (error.message === "Failed to fetch") {
    //       alert("Unable to connect to server");
    //     }
    //   }
    // };

    // loginFetch();

    setIsAuthorized(true);
  }, []);

  const validate = useCallback(() => {}, []);

  //Logout method
  const logout = useCallback(() => {
    setIsAuthorized(false);
    setAccessToken("");
    setRefreshToken("");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        username,
        accessToken,
        setAccessToken,
        refreshToken,
        setRefreshToken,
        isAuthorized,
        login,
        validate,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

//Custom Hook
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
