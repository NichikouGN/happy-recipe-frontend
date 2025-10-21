import { useAuthContext } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import React from "react";

type ProtectRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: ProtectRouteProps) => {
  const { isAuthorized } = useAuthContext();

  if (!isAuthorized) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
