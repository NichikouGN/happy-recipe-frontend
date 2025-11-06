import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

interface ProtectRouteProps {
  children: React.ReactNode;
  requireAuthoriazation: "2FA" | "authorized";
}

const ProtectedRoute = ({
  children,
  requireAuthoriazation,
}: ProtectRouteProps) => {
  const { validateTempToken, validateAccessToken } = useAuthContext();
  const [state, setState] = useState<"loading" | "finished">("loading");
  const [isValid, setIsValid] = useState<boolean>(false);
  const navigate = useNavigate();

  //All route within this component require some form of validation to access
  //either through access token or temp token (2FA)
  useEffect(() => {
    const validate = async () => {
      let isValid = false;

      if (requireAuthoriazation === "2FA") isValid = await validateTempToken();
      else if (requireAuthoriazation === "authorized")
        isValid = await validateAccessToken();

      if (!isValid) {
        setIsValid(false);
        navigate("/login");
      }

      setIsValid(true);
      setState("finished");
    };

    validate();
  }, [requireAuthoriazation, validateAccessToken, validateTempToken]);

  if (state === "loading") {
    return <>Loading</>;
  }

  return <>{isValid && children}</>;
};

export default ProtectedRoute;
