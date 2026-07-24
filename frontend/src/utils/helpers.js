// Format date to DD/MM/YYYY
export const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Format date and time
export const formatDateTime = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Get status color for badges
export const getStatusColor = (status) => {
  const colors = {
    present:  "bg-green-100 text-green-800",
    absent:   "bg-red-100 text-red-800",
    on_leave: "bg-yellow-100 text-yellow-800",
    half_day: "bg-blue-100 text-blue-800",
    holiday:  "bg-purple-100 text-purple-800",
    pending:  "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Get role color
export const getRoleColor = (role) => {
  const colors = {
    admin:    "bg-purple-100 text-purple-800",
    manager:  "bg-blue-100 text-blue-800",
    employee: "bg-gray-100 text-gray-800",
  };
  return colors[role] || "bg-gray-100 text-gray-800";
};