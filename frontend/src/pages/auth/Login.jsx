import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate form
  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email.";
    }
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    return newErrors;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    const result = await login(formData);

    if (result.success) {
      // Redirect based on role
      const dashboardMap = {
        admin: "/admin/dashboard",
        manager: "/manager/dashboard",
        employee: "/employee/dashboard",
      };
      navigate(dashboardMap[result.role] || "/login");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <span className="text-3xl">📋</span>
          </div>
          <h1 className="text-3xl font-bold text-white">AMS</h1>
          <p className="text-slate-400 mt-1">Attendance Management System</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">
            Sign in to your account
          </h2>

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="mb-4">
              <label className="label">Email address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@company.com"
                className={`input ${errors.email ? "border-red-400" : ""}`}
                disabled={isLoading}
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="label">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`input ${errors.password ? "border-red-400" : ""}`}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="error-text">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-slate-50 rounded-xl">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Demo Credentials
            </p>
            <div className="space-y-2">
              {[
                {
                  role: "Admin",
                  email: "admin@ams.com",
                  color: "text-purple-600",
                },
                {
                  role: "Manager",
                  email: "manager@ams.com",
                  color: "text-blue-600",
                },
                {
                  role: "Employee",
                  email: "employee@ams.com",
                  color: "text-green-600",
                },
              ].map((cred) => (
                <div
                  key={cred.role}
                  className="flex items-center justify-between cursor-pointer hover:bg-slate-100 p-2 rounded-lg transition-colors"
                  onClick={() => {
                    setFormData({ email: cred.email, password: "Admin@123" });
                    setErrors({});
                  }}
                >
                  <span className={`text-xs font-semibold ${cred.color}`}>
                    {cred.role}
                  </span>
                  <span className="text-xs text-slate-500">{cred.email}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-2 text-center">
              Click any role to auto-fill
            </p>
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-medium hover:underline"
            >
              Create account
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-xs mt-6">
          Built with MERN Stack — Production Grade
        </p>
      </div>
    </div>
  );
};

export default Login;
