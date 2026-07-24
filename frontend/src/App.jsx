import { Routes, Route, Navigate } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import ProtectedRoute from "./components/common/ProtectedRoute";
import LoadingSpinner from "./components/common/LoadingSpinner";

// Auth pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Employee pages
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import AttendanceHistory from "./pages/employee/AttendanceHistory";
import LeaveManagement from "./pages/employee/LeaveManagement";

// Manager pages
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import LeaveApprovals from "./pages/manager/LeaveApprovals";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import AuditLogs from "./pages/admin/AuditLogs";

const App = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return <LoadingSpinner />;

  // Redirect root to appropriate dashboard
  const getDashboard = () => {
    if (!isAuthenticated) return "/login";
    const map = {
      admin: "/admin/dashboard",
      manager: "/manager/dashboard",
      employee: "/employee/dashboard",
    };
    return map[user?.role] || "/login";
  };

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          isAuthenticated
            ? <Navigate to={getDashboard()} replace />
            : <Login />
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated
            ? <Navigate to={getDashboard()} replace />
            : <Register />
        }
      />

      {/* Employee routes */}
      <Route
        path="/employee/dashboard"
        element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/attendance"
        element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <AttendanceHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/leave"
        element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <LeaveManagement />
          </ProtectedRoute>
        }
      />

      {/* Manager routes */}
      <Route
        path="/manager/dashboard"
        element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <ManagerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/leaves"
        element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <LeaveApprovals />
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <UserManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/audit"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AuditLogs />
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to={getDashboard()} replace />} />
      <Route path="*" element={<Navigate to={getDashboard()} replace />} />
    </Routes>
  );
};

export default App;