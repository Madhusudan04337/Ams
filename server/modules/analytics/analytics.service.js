// modules/analytics/analytics.service.js

const Attendance = require("../../models/Attendance");
const User = require("../../models/User");
const { ATTENDANCE_STATUS } = require("../../utils/constants");

const getMySummary = async (userId, query) => {
  const { month, year } = query;

  const now = new Date();
  const targetMonth = month ? Number(month) - 1 : now.getMonth();
  const targetYear = year ? Number(year) : now.getFullYear();

  const from = new Date(targetYear, targetMonth, 1);
  const to = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);

  const records = await Attendance.find({
    user: userId,
    date: { $gte: from, $lte: to },
  });

  const total = records.length;

  const present = records.filter(
    (r) => r.status === ATTENDANCE_STATUS.PRESENT
  ).length;

  const absent = records.filter(
    (r) => r.status === ATTENDANCE_STATUS.ABSENT
  ).length;

  const onLeave = records.filter(
    (r) => r.status === ATTENDANCE_STATUS.ON_LEAVE
  ).length;

  const halfDay = records.filter(
    (r) => r.status === ATTENDANCE_STATUS.HALF_DAY
  ).length;

  const attendancePercentage =
    total > 0
      ? Number(((present / total) * 100).toFixed(2))
      : 0;

  return {
    month: targetMonth + 1,
    year: targetYear,
    totalDays: total,
    present,
    absent,
    onLeave,
    halfDay,
    attendancePercentage,
  };
};

const getDepartmentSummary = async (query) => {
  const { month, year } = query;

  const now = new Date();
  const targetMonth = month ? Number(month) - 1 : now.getMonth();
  const targetYear = year ? Number(year) : now.getFullYear();

  const from = new Date(targetYear, targetMonth, 1);
  const to = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);

  const users = await User.find({ isActive: true });

  const departmentMap = {};

  for (const user of users) {
    const dept = user.department || "Unassigned";

    if (!departmentMap[dept]) {
      departmentMap[dept] = {
        department: dept,
        totalEmployees: 0,
        totalPresent: 0,
        totalRecords: 0,
      };
    }

    departmentMap[dept].totalEmployees += 1;

    const records = await Attendance.find({
      user: user._id,
      date: { $gte: from, $lte: to },
    });

    const present = records.filter(
      (r) => r.status === ATTENDANCE_STATUS.PRESENT
    ).length;

    departmentMap[dept].totalPresent += present;
    departmentMap[dept].totalRecords += records.length;
  }

  const departments = Object.values(departmentMap).map((dept) => ({
    ...dept,
    averageAttendance:
      dept.totalRecords > 0
        ? Number(
            ((dept.totalPresent / dept.totalRecords) * 100).toFixed(2)
          )
        : 0,
  }));

  return {
    month: targetMonth + 1,
    year: targetYear,
    departments,
  };
};

module.exports = {
  getMySummary,
  getDepartmentSummary,
};