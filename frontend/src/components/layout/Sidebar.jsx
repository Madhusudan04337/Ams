import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Sidebar = () => {
  const { user, logout, isAdmin, isManager, isEmployee } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Navigation links per role
  const adminLinks = [
    { to: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { to: "/admin/users", label: "Users", icon: "👥" },
    { to: "/admin/audit", label: "Audit Logs", icon: "📋" },
  ];

  const managerLinks = [
    { to: "/manager/dashboard", label: "Dashboard", icon: "📊" },
    { to: "/manager/leaves", label: "Leave Approvals", icon: "✅" },
  ];

  const employeeLinks = [
    { to: "/employee/dashboard", label: "Dashboard", icon: "🏠" },
    { to: "/employee/attendance", label: "Attendance", icon: "📅" },
    { to: "/employee/leave", label: "Leave", icon: "🏖️" },
  ];

  const links = isAdmin
    ? adminLinks
    : isManager
    ? managerLinks
    : employeeLinks;

  const roleColors = {
    admin: "bg-purple-100 text-purple-700",
    manager: "bg-blue-100 text-blue-700",
    employee: "bg-green-100 text-green-700",
  };

  return (
    <aside className="w-64 min-h-screen bg-slate-900 flex flex-col">

      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-xl">
            📋
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">AMS</h1>
            <p className="text-slate-400 text-xs">Attendance System</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-white font-semibold text-sm">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {user?.username}
            </p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColors[user?.role]}`}>
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <span className="text-lg">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500 hover:text-white transition-colors"
        >
          <span className="text-lg">🚪</span>
          Logout
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;