import { createContext, useContext, useReducer, useEffect } from "react";
import { loginAPI, logoutAPI, getMeAPI } from "../api/auth.api";
import toast from "react-hot-toast";

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext(null);

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is already logged in on app load
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        dispatch({ type: "SET_LOADING", payload: false });
        return;
      }

      try {
        const response = await getMeAPI();
        dispatch({ type: "SET_USER", payload: response.data.data.user });
      } catch (error) {
        // Token invalid or expired — clear storage
        localStorage.clear();
        dispatch({ type: "LOGOUT" });
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const response = await loginAPI(credentials);
      const { user, accessToken, refreshToken } = response.data.data;

      // Store tokens
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // Set user in state
      dispatch({ type: "SET_USER", payload: user });

      toast.success(`Welcome back, ${user.username}!`);
      return { success: true, role: user.role };

    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed. Try again.";
      toast.error(message);
      return { success: false };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await logoutAPI(refreshToken);
      }
    } catch (error) {
      // Even if API call fails — clear local state
      console.error("Logout API error:", error);
    } finally {
      localStorage.clear();
      dispatch({ type: "LOGOUT" });
      toast.success("Logged out successfully.");
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used inside AuthProvider");
  }
  return context;
};