import {
  createContext,
  useContext,
  type FC,
  type ReactNode,
  useState,
  useEffect,
} from "react";
import { useAuthContext } from "./AuthContext";

const UserContext = createContext<
  | {
      userID: string;
      username: string;
      displayName: string;
      email: string;
      bio: string;
      profileImageURL: string;
      isVerified: boolean;
    }
  | undefined
>(undefined);

export const UserProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { signInState, accessToken, requestNewAccessToken } = useAuthContext();

  //User information
  const [userID, setUserID] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [profileImageURL, setProfileImageURL] = useState<string>("");
  const [isVerified, setIsVerified] = useState<boolean>(false);

  useEffect(() => {
    /**
     * Fetch user info after sign in or sign up is successful
     */
    const fetchUserInfo = async () => {
      try {
        if (signInState === "authorized" && accessToken) {
          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/api/auth/user-info`,
            {
              method: "GET",
              headers: {
                authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
              },
            }
          );

          //If access token is invalid or expired request a new one
          if (res.status === 401) {
            await requestNewAccessToken();
            return;
          }

          const data = await res.json();

          //Set user information state
          setUserID(data.userID);
          setUsername(data.username);
          setDisplayName(data.displayName);
          setEmail(data.email);
          setBio(data.bio);
          setProfileImageURL(data.profileImageURL);
          setIsVerified(data.isVerified);
        }
      } catch (e) {
        console.log(e);
      }
    };

    fetchUserInfo();
  }, [accessToken]);

  return (
    <UserContext.Provider
      value={{
        userID,
        username,
        displayName,
        email,
        bio,
        profileImageURL,
        isVerified,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within UserProvider");
  }

  return context;
};
