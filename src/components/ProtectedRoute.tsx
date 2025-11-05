import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  const { toast } = useToast();

  const storedUser = localStorage.getItem("syllabox_user");

  if (!storedUser) {
    toast({
      title: "Authentication Required",
      description: "Please log in to access this page.",
      variant: "destructive",
    });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  try {
    const user = JSON.parse(storedUser);

    const loginTime = new Date(user.loginTime);
    const now = new Date();
    const sessionDuration = now.getTime() - loginTime.getTime();
    const maxSessionDuration = 24 * 60 * 60 * 1000; // 24 hours

    if (sessionDuration > maxSessionDuration) {
      localStorage.removeItem("syllabox_user");
      toast({
        title: "Session Expired",
        description: "Your session has expired. Please log in again.",
        variant: "destructive",
      });
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
  } catch (error) {
    localStorage.removeItem("syllabox_user");
    toast({
      title: "Invalid Session",
      description: "Please log in again.",
      variant: "destructive",
    });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
};
