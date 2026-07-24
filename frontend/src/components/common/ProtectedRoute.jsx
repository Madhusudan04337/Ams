import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to their own dashboard if wrong role
    const dashboardMap = {
      admin: "/admin/dashboard",
      manager: "/manager/dashboard",
      employee: "/employee/dashboard",
    };
    return <Navigate to={dashboardMap[user?.role] || "/login"} replace />;
  }

  return children;
};

export default ProtectedRoute;