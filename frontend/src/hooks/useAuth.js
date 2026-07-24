import { useAuthContext } from "../context/AuthContext";
import { ROLES } from "../utils/constants";

const useAuth = () => {
  const auth = useAuthContext();

  const isAdmin = auth.user?.role === ROLES.ADMIN;
  const isManager = auth.user?.role === ROLES.MANAGER;
  const isEmployee = auth.user?.role === ROLES.EMPLOYEE;
  const isAdminOrManager = isAdmin || isManager;

  return {
    ...auth,
    isAdmin,
    isManager,
    isEmployee,
    isAdminOrManager,
  };
};

export default useAuth;