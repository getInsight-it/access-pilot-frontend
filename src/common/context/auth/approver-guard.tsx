import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { ERROR_ROUTES } from "../../constants/routes.ts";
import { useAuth } from "./AuthContext.tsx";

interface RoleGuardProps {
  children: ReactNode;
}

export const ApproverGuard: React.FC<RoleGuardProps> = ({ children }) => {
  const { isApprover } = useAuth();
  return isApprover
    ? <>{children}</>
    : <Navigate to={ERROR_ROUTES.NOT_FOUND} replace />;
};

export const ApproverComponentGuard: React.FC<RoleGuardProps> = ({ children }) => {
  const { isApprover } = useAuth();
  return isApprover
    ? <>{children}</>
    : <></>;
};
