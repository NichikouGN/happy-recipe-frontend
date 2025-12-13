import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

interface ProtectRouteProps {
  requireAuthorization: "2FA" | "authorized" | "unauthorized";
  customRedirectPath?: string;
}

export default function ProtectedRoute({
  requireAuthorization,
  customRedirectPath = "/signin",
}: ProtectRouteProps) {
  const signInState = useAuthStore((state) => state.signInState);

  if (requireAuthorization === "authorized" && signInState !== "authorized") {
    return <Navigate to={customRedirectPath} replace />;
  }

  if (requireAuthorization === "unauthorized" && signInState === "authorized") {
    return <Navigate to="/" replace />;
  }

  if (requireAuthorization === "2FA" && signInState !== "2FA") {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
}
