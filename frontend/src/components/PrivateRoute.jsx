import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children, admin = false }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (admin && !user.isAdmin) {
    return <Navigate to="/admin" />;
  }

  return children;
};

export default PrivateRoute;
