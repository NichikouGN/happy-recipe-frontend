import {
  createContext,
  useContext,
  type FC,
  type ReactNode,
  useState,
  useEffect,
} from "react";
import { useAuthContext } from "./AuthContext";

interface UserContextType {
  userId: string;
  username: string;
  displayName: string;
  email: string;
  bio: string;
  profileImageUrl: string;
  isVerified: boolean;
}

const UserContext = createContext<
  | {
      userInformation: UserContextType;
    }
  | undefined
>(undefined);

export const UserProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { signInState, accessToken, requestNewAccessToken } = useAuthContext();

  const [userInformation, setUserInformation] = useState<UserContextType>({
    userId: "",
    username: "",
    displayName: "",
    email: "",
    bio: "",
    profileImageUrl: "",
    isVerified: false,
  });

  // //User information
  // const [userId, setUserID] = useState<string>("");
  // const [username, setUsername] = useState<string>("");
  // const [displayName, setDisplayName] = useState<string>("");
  // const [email, setEmail] = useState<string>("");
  // const [bio, setBio] = useState<string>("");
  // const [profileImageUrl, setProfileImageURL] = useState<string>("");
  // const [isVerified, setIsVerified] = useState<boolean>(false);

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
          console.log("Fetched user info:", data);

          //Set user information state
          setUserInformation((prev) => ({ ...prev, userId: data.userId }));
          setUserInformation((prev) => ({ ...prev, username: data.username }));
          setUserInformation((prev) => ({ ...prev, displayName: data.displayName }));
          setUserInformation((prev) => ({ ...prev, email: data.email }));
          setUserInformation((prev) => ({ ...prev, bio: data.bio }));
          setUserInformation((prev) => ({ ...prev, profileImageUrl: data.profileImageUrl }));
          setUserInformation((prev) => ({ ...prev, isVerified: data.isVerified }));
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
        userInformation,
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
