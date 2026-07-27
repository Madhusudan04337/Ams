// src/pages/employee/EmployeeDashboard.jsx

import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import useAuth from "../../hooks/useAuth";
import {
  markAttendanceAPI,
  getMyAttendanceAPI,
  checkOutAPI,
} from "../../api/attendance.api";
import { getMySummaryAPI } from "../../api/analytics.api";
import { getMyLeavesAPI } from "../../api/leave.api";
import {
  formatDate,
  formatDateTime,
  getStatusColor,
  capitalize,
} from "../../utils/helpers";
import toast from "react-hot-toast";

const EmployeeDashboard = () => {
  const { user } = useAuth();

  const [todayAttendance, setTodayAttendance] = useState(null);
  const [summary, setSummary] = useState(null);
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [isMarking, setIsMarking] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0];

      const [summaryRes, attendanceRes, leavesRes] = await Promise.all([
        getMySummaryAPI(),
        getMyAttendanceAPI({ from: today, to: today, limit: 1 }),
        getMyLeavesAPI({ limit: 3 }),
      ]);

      setSummary(summaryRes.data.data.summary);

      const todayRecord = attendanceRes.data.data.attendance[0];
      setTodayAttendance(todayRecord || null);

      const recentRes = await getMyAttendanceAPI({ limit: 5 });
      setRecentAttendance(recentRes.data.data.attendance);
      setRecentLeaves(leavesRes.data.data.leaves);
    } catch (error) {
      toast.error("Failed to load dashboard data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAttendance = async () => {
    setIsMarking(true);
    try {
      await markAttendanceAPI({ status: "present" });
      toast.success("Attendance marked successfully!");
      loadDashboardData();
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to mark attendance.";
      toast.error(message);
    } finally {
      setIsMarking(false);
    }
  };

  const handleCheckOut = async () => {
    setIsCheckingOut(true);
    try {
      await checkOutAPI();
      toast.success("Checked out successfully!");
      loadDashboardData();
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to check out.";
      toast.error(message);
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          Good {getGreeting()}, {user?.username}! 👋
        </h1>
        <p className="text-slate-500 mt-1">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Today's Attendance Card */}
      <div
        className={`rounded-2xl p-6 mb-6 ${
          todayAttendance
            ? "bg-green-50 border border-green-200"
            : "bg-blue-50 border border-blue-200"
        }`}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Today's Attendance
            </h2>

            {todayAttendance ? (
              <div className="mt-2 space-y-1">
                <div>
                  <span
                    className={`badge ${getStatusColor(todayAttendance.status)}`}
                  >
                    {capitalize(todayAttendance.status.replace("_", " "))}
                  </span>
                </div>
                <p className="text-sm text-slate-600">
                  🕐 Check-in:{" "}
                  <span className="font-medium">
                    {formatDateTime(todayAttendance.checkIn)}
                  </span>
                </p>
                {todayAttendance.checkOut ? (
                  <p className="text-sm text-slate-600">
                    🚪 Check-out:{" "}
                    <span className="font-medium">
                      {formatDateTime(todayAttendance.checkOut)}
                    </span>
                  </p>
                ) : (
                  <p className="text-sm text-slate-400">
                    🚪 Not checked out yet
                  </p>
                )}
                {todayAttendance.ipAddress && (
                  <p className="text-xs text-slate-400">
                    📍 IP: {todayAttendance.ipAddress}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-slate-500 text-sm mt-1">
                You haven't marked attendance yet today.
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {/* Mark Present Button */}
            {!todayAttendance && (
              <button
                onClick={handleMarkAttendance}
                disabled={isMarking}
                className="btn-primary flex items-center gap-2"
              >
                {isMarking ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Marking...
                  </>
                ) : (
                  <>✅ Mark Present</>
                )}
              </button>
            )}

            {/* Check Out Button */}
            {todayAttendance &&
              todayAttendance.status === "present" &&
              !todayAttendance.checkOut && (
                <button
                  onClick={handleCheckOut}
                  disabled={isCheckingOut}
                  className="btn-secondary flex items-center gap-2 border border-slate-300"
                >
                  {isCheckingOut ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                      Checking out...
                    </>
                  ) : (
                    <>🚪 Check Out</>
                  )}
                </button>
              )}

            {/* Already checked out message */}
            {todayAttendance && todayAttendance.checkOut && (
              <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-xl text-sm font-medium">
                ✅ Day complete
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Present Days"
            value={summary.present}
            icon="✅"
            color="text-green-600"
            bg="bg-green-50"
          />
          <StatCard
            label="Absent Days"
            value={summary.absent}
            icon="❌"
            color="text-red-600"
            bg="bg-red-50"
          />
          <StatCard
            label="On Leave"
            value={summary.onLeave}
            icon="🏖️"
            color="text-yellow-600"
            bg="bg-yellow-50"
          />
          <StatCard
            label="Attendance %"
            value={`${summary.attendancePercentage}%`}
            icon="📊"
            color="text-blue-600"
            bg="bg-blue-50"
          />
        </div>
      )}

      {/* Leave Balance */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Leave Balance
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              type: "Casual",
              value: user?.leaveBalance?.casual,
              color: "bg-blue-500",
            },
            {
              type: "Sick",
              value: user?.leaveBalance?.sick,
              color: "bg-red-500",
            },
            {
              type: "Earned",
              value: user?.leaveBalance?.earned,
              color: "bg-green-500",
            },
          ].map((leave) => (
            <div
              key={leave.type}
              className="text-center p-4 bg-slate-50 rounded-xl"
            >
              <div
                className={`text-3xl font-bold text-white ${leave.color} w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2`}
              >
                {leave.value}
              </div>
              <p className="text-sm text-slate-600 font-medium">
                {leave.type}
              </p>
              <p className="text-xs text-slate-400">days left</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Recent Attendance */}
        <div className="card">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Recent Attendance
          </h2>
          {recentAttendance.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-3xl mb-2">📅</p>
              <p className="text-slate-400 text-sm">
                No attendance records yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentAttendance.map((record) => (
                <div
                  key={record._id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      {formatDate(record.date)}
                    </p>
                    <p className="text-xs text-slate-400">
                      In: {formatDateTime(record.checkIn)}
                    </p>
                    {record.checkOut && (
                      <p className="text-xs text-slate-400">
                        Out: {formatDateTime(record.checkOut)}
                      </p>
                    )}
                  </div>
                  <span
                    className={`badge ${getStatusColor(record.status)}`}
                  >
                    {capitalize(record.status.replace("_", " "))}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Leave Requests */}
        <div className="card">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Recent Leave Requests
          </h2>
          {recentLeaves.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-3xl mb-2">🏖️</p>
              <p className="text-slate-400 text-sm">
                No leave requests yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentLeaves.map((leave) => (
                <div
                  key={leave._id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-700 capitalize">
                      {leave.type} Leave
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatDate(leave.from)} → {formatDate(leave.to)}{" "}
                      ({leave.totalDays} days)
                    </p>
                    {leave.note && (
                      <p className="text-xs text-slate-400 mt-0.5">
                        Note: {leave.note}
                      </p>
                    )}
                  </div>
                  <span
                    className={`badge ${getStatusColor(leave.status)}`}
                  >
                    {capitalize(leave.status)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </DashboardLayout>
  );
};

// Reusable stat card
const StatCard = ({ label, value, icon, color, bg }) => (
  <div className={`${bg} rounded-xl p-4`}>
    <div className="flex items-center justify-between mb-2">
      <span className="text-2xl">{icon}</span>
      <span className={`text-2xl font-bold ${color}`}>{value}</span>
    </div>
    <p className="text-sm text-slate-600 font-medium">{label}</p>
  </div>
);

// Greeting based on time
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
};

export default EmployeeDashboard;