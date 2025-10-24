import {
  createContext,
  useCallback,
  useContext,
  useState,
  type FC,
  type ReactNode,
} from "react";

const data = {
  status: "require2FA",
  tempToken: "abc",
  accessToken: "abc",
  refreshToken: "abc",
  username: "abc",
};

const AuthContext = createContext<
  | {
      userID: string;
      tempToken: string;
      validateTempToken: () => Promise<boolean>;
      accessToken: string;
      validateAccessToken: () => Promise<boolean>;
      requestNewAccessToken: () => Promise<boolean>;
      setAccessToken: (accessToken: string) => void;
      refreshToken: string;
      setRefreshToken: (refreshToken: string) => void;
      loginState: "unauthorized" | "2FA" | "authorized";
      login: (email: string, password: string) => Promise<void>;
      verify2FA: (code: string) => Promise<boolean>;
      logout: () => void;
    }
  | undefined
>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [userID, setUsername] = useState<string>("");
  const [loginState, setLoginState] = useState<
    "unauthorized" | "2FA" | "authorized"
  >("unauthorized");
  const [accessToken, setAccessToken] = useState<string>("");
  const [refreshToken, setRefreshToken] = useState<string>(() => {
    const refreshTok = localStorage.getItem("refresh-token");
    if (!refreshTok) return "";
    return refreshTok;
  });
  const [tempToken, setTempToken] = useState<string>("");

  const resetToken = useCallback(() => {
    setLoginState("unauthorized");
    setAccessToken("");

    setRefreshToken("");
    localStorage.removeItem("refresh-token");
    return false;
  }, []);

  const requestNewAccessToken = useCallback(async () => {
    try {
      //if (!refreshToken) throw new Error("No refresh token found");

      const res = await fetch("http://localhost:4000/validate/refresh-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${refreshToken}`,
        },
        body: JSON.stringify({ userID: userID ? userID : "" }),
      });
      if (!res.ok) throw new Error("Access token expired/invalid");

      const data = await res.json();

      const accTok = data.accessToken;
      setAccessToken(accTok);

      const refTok = data.refreshToken;
      setRefreshToken(refTok);

      setLoginState("authorized");

      return true;
    } catch (e) {
      return resetToken();
    }
  }, [userID, refreshToken]);

  const validateAccessToken = useCallback(async () => {
    try {
      //if (!accessToken) throw new Error("No access token found");
      //await new Promise((resolve) => setTimeout(resolve, 100));
      const res = await fetch("http://localhost:4000/validate/access-token", {
        method: "GET",
        headers: { authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) throw new Error("Access token expired");

      setLoginState("authorized");

      return true;
    } catch (e: any) {
      if (e.message.includes(401)) {
        return requestNewAccessToken();
      } else {
        return resetToken();
      }
    }
  }, [accessToken, requestNewAccessToken]);

  const validateTempToken = useCallback(async () => {
    try {
      if (!tempToken) return false;

      const res = await fetch("http://localhost:4000/validate/temp-token", {
        method: "GET",
        headers: { authorization: `Bearer ${tempToken}` },
      });

      if (!res.ok) return false;

      return true;
    } catch (e) {
      setLoginState("unauthorized");
      setTempToken("");
      return false;
    }
  }, [tempToken]);

  const verify2FA = useCallback(
    async (code: string) => {
      try {
        const isValid = await validateTempToken();
        if (!isValid) return false;

        const res = await fetch("http://localhost:4000/validate/2fa", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${tempToken}`,
          },
          body: JSON.stringify({ code: code }),
        });
        if (!res.ok) return false;

        const data = await res.json();
        setAccessToken(data.accessToken);

        setRefreshToken(data.accessToken);
        localStorage.setItem("refresh-token", data.accessToken);

        setLoginState("authorized");
        setTempToken("");

        return true;
      } catch (e) {
        return false;
      }
    },
    [tempToken]
  );

  //Login method
  const login = useCallback(async (email: string, password: string) => {
    try {
      // const res = await fetch("http://localhost:4000/login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email: email, password: password }),
      // });

      // if (!res.ok) {
      //   const errText = await res.text();
      //   throw new Error(`Error ${res.status}: ${errText}`);
      // }

      //const data = await res.json();
      console.log(email);
      console.log(password);
      if (data.status === "require2FA") {
        setTempToken(data.tempToken);
        setLoginState("2FA");
      } else {
        setAccessToken(data.accessToken);

        setRefreshToken(data.refreshToken);
        localStorage.setItem("refresh-token", data.refreshToken);

        setUsername(data.username);
        setLoginState("authorized");
      }
    } catch (error: any) {
      if (error.message.includes(401)) {
        alert("Your username or password is incorrect");
      } else if (error.message === "Failed to fetch") {
        alert("Unable to connect to server");
      } else {
        alert("500 Internal Server Error");
      }
    }
  }, []);

  //Logout method
  const logout = useCallback(() => {
    resetToken();
    setTempToken("");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userID,
        tempToken,
        validateTempToken,
        accessToken,
        validateAccessToken,
        requestNewAccessToken,
        setAccessToken,
        refreshToken,
        setRefreshToken,
        loginState,
        login,
        verify2FA,
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
    throw new Error("useAuthContext must be used within AuthProvider");
  }

  return context;
};
