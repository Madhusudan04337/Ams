// modules/attendance/attendance.service.js

const Attendance = require("../../models/Attendance");
const AuditLog = require("../../models/AuditLog");
const ApiError = require("../../utils/ApiError");
const { ATTENDANCE_STATUS, ROLES } = require("../../utils/constants");

const markAttendance = async (userId, body, ipAddress, userAgent) => {
  const { status, note } = body;

  // Normalize today's date to midnight
  const now = new Date();
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0,
  );
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
    ipAddress,
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
    if (from) {
      const fromDate = new Date(from);
      fromDate.setHours(0, 0, 0, 0);
      filter.date.$gte = fromDate;
    }
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
  userAgent,
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

const exportAttendance = async (query) => {
  const ExcelJS = require("exceljs");

  const { from, to, userId } = query;

  const filter = {};
  if (userId) filter.user = userId;

  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      filter.date.$lte = toDate;
    }
  }

  const records = await Attendance.find(filter)
    .populate("user", "username email department role")
    .populate("rectifiedBy", "username")
    .sort({ date: -1 });

  // Create workbook
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Attendance Report");

  // Header row styling
  sheet.columns = [
    { header: "Employee", key: "username", width: 20 },
    { header: "Email", key: "email", width: 28 },
    { header: "Department", key: "department", width: 18 },
    { header: "Date", key: "date", width: 15 },
    { header: "Status", key: "status", width: 14 },
    { header: "Check In", key: "checkIn", width: 20 },
    { header: "Check Out", key: "checkOut", width: 20 },
    { header: "Note", key: "note", width: 30 },
    { header: "Rectified By", key: "rectifiedBy", width: 20 },
  ];

  // Style header row
  sheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF2563EB" },
    };
    cell.alignment = { horizontal: "center" };
  });

  // Add data rows
  records.forEach((record) => {
    sheet.addRow({
      username: record.user?.username || "N/A",
      email: record.user?.email || "N/A",
      department: record.user?.department || "N/A",
      date: record.date
        ? new Date(record.date).toLocaleDateString("en-IN")
        : "N/A",
      status: record.status,
      checkIn: record.checkIn
        ? new Date(record.checkIn).toLocaleString("en-IN")
        : "N/A",
      checkOut: record.checkOut
        ? new Date(record.checkOut).toLocaleString("en-IN")
        : "N/A",
      note: record.note || "",
      rectifiedBy: record.rectifiedBy?.username || "",
    });
  });

  // Zebra striping
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      row.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: {
            argb: rowNumber % 2 === 0 ? "FFF1F5F9" : "FFFFFFFF",
          },
        };
      });
    }
  });

  return workbook;
};

const checkOutAttendance = async (userId) => {
  const now = new Date();
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0,
  );
  const attendance = await Attendance.findOne({
    user: userId,
    date: today,
  });

  if (!attendance) {
    throw new ApiError(400, "No attendance record found for today.");
  }

  if (attendance.checkOut) {
    throw new ApiError(400, "You have already checked out today.");
  }

  if (attendance.status !== "present") {
    throw new ApiError(400, "Check-out only available for present status.");
  }

  attendance.checkOut = new Date();
  await attendance.save();

  return attendance;
};

module.exports = {
  markAttendance,
  getMyAttendance,
  getAllAttendance,
  rectifyAttendance,
  exportAttendance,
  checkOutAttendance,
};
