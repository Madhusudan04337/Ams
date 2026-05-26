// modules/attendance/attendance.service.js

const Attendance = require("../../models/Attendance");
const AuditLog = require("../../models/AuditLog");
const ApiError = require("../../utils/ApiError");
const { ATTENDANCE_STATUS, ROLES } = require("../../utils/constants");

const markAttendance = async (userId, body, ipAddress, userAgent) => {
  const { status, note } = body;

  // Normalize today's date to midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check duplicate
  const existing = await Attendance.findOne({
    user: userId,
    date: today,
  });

  if (existing) {
    throw new ApiError(400, "Attendance already marked for today.");
  }

  // Create attendance
  const attendance = await Attendance.create({
    user: userId,
    date: today,
    status: status || ATTENDANCE_STATUS.PRESENT,
    checkIn: new Date(),
    note: note || null,
  });

  // Create audit log
  await AuditLog.create({
    action: "marked",
    performedBy: userId,
    targetUser: userId,
    attendanceId: attendance._id,
    newStatus: attendance.status,
    ipAddress,
    userAgent,
  });

  return attendance;
};

const getMyAttendance = async (userId, query) => {
  const { status, from, to, page = 1, limit = 10 } = query;

  const filter = { user: userId };

  if (status) filter.status = status;

  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      filter.date.$lte = toDate;
    }
  }

  const skip = (page - 1) * limit;
  const total = await Attendance.countDocuments(filter);

  const attendance = await Attendance.find(filter)
    .sort({ date: -1 })
    .skip(skip)
    .limit(Number(limit));

  return {
    attendance,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      limit: Number(limit),
    },
  };
};

const getAllAttendance = async (query) => {
  const { status, from, to, page = 1, limit = 10, userId } = query;

  const filter = {};

  if (userId) filter.user = userId;
  if (status) filter.status = status;

  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      filter.date.$lte = toDate;
    }
  }

  const skip = (page - 1) * limit;
  const total = await Attendance.countDocuments(filter);

  const attendance = await Attendance.find(filter)
    .populate("user", "username email department role")
    .populate("rectifiedBy", "username role")
    .sort({ date: -1 })
    .skip(skip)
    .limit(Number(limit));

  return {
    attendance,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      limit: Number(limit),
    },
  };
};

const rectifyAttendance = async (
  attendanceId,
  body,
  performedBy,
  ipAddress,
  userAgent
) => {
  const { status, note } = body;

  if (!Object.values(ATTENDANCE_STATUS).includes(status)) {
    throw new ApiError(400, "Invalid attendance status.");
  }

  const attendance = await Attendance.findById(attendanceId);

  if (!attendance) {
    throw new ApiError(404, "Attendance record not found.");
  }

  const oldStatus = attendance.status;

  attendance.status = status;
  attendance.note = note || attendance.note;
  attendance.rectifiedBy = performedBy;
  await attendance.save();

  // Create audit log
  await AuditLog.create({
    action: "rectified",
    performedBy,
    targetUser: attendance.user,
    attendanceId: attendance._id,
    oldStatus,
    newStatus: status,
    note: note || null,
    ipAddress,
    userAgent,
  });

  return attendance;
};

module.exports = {
  markAttendance,
  getMyAttendance,
  getAllAttendance,
  rectifyAttendance,
};