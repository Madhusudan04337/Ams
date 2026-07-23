// modules/leave/leave.service.js

const LeaveRequest = require("../../models/LeaveRequest");
const User = require("../../models/User");
const AuditLog = require("../../models/AuditLog");
const ApiError = require("../../utils/ApiError");
const { LEAVE_STATUS, LEAVE_TYPES } = require("../../utils/constants");

const calculateTotalDays = (from, to) => {
  const start = new Date(from);
  const end = new Date(to);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
};

const applyLeave = async (userId, body) => {
  const { type, from, to, reason } = body;

  if (!Object.values(LEAVE_TYPES).includes(type)) {
    throw new ApiError(400, "Invalid leave type.");
  }

  const fromDate = new Date(from);
  const toDate = new Date(to);

  if (fromDate > toDate) {
    throw new ApiError(400, "From date cannot be after to date.");
  }

  const totalDays = calculateTotalDays(from, to);

  const user = await User.findById(userId);

  if (user.leaveBalance[type] < totalDays) {
    throw new ApiError(
      400,
      `Insufficient ${type} leave balance. Available: ${user.leaveBalance[type]} days.`
    );
  }

  const leave = await LeaveRequest.create({
    user: userId,
    type,
    from: fromDate,
    to: toDate,
    totalDays,
    reason,
    status: LEAVE_STATUS.PENDING,
  });

  return leave;
};

const getMyLeaves = async (userId, query) => {
  const { status, page = 1, limit = 10 } = query;

  const filter = { user: userId };
  if (status) filter.status = status;

  const skip = (page - 1) * limit;
  const total = await LeaveRequest.countDocuments(filter);

  const leaves = await LeaveRequest.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  return {
    leaves,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    },
  };
};

const getAllLeaves = async (query) => {
  const { status, page = 1, limit = 10 } = query;

  const filter = {};
  if (status) filter.status = status;

  const skip = (page - 1) * limit;
  const total = await LeaveRequest.countDocuments(filter);

  const leaves = await LeaveRequest.find(filter)
    .populate("user", "username email department")
    .populate("approvedBy", "username role")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  return {
    leaves,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    },
  };
};

const approveLeave = async (leaveId, managerId, body, ipAddress, userAgent) => {
  const leave = await LeaveRequest.findById(leaveId);

  if (!leave) throw new ApiError(404, "Leave request not found.");

  if (leave.status !== LEAVE_STATUS.PENDING) {
    throw new ApiError(400, "This leave request has already been processed.");
  }

  const user = await User.findById(leave.user);

  if (user.leaveBalance[leave.type] < leave.totalDays) {
    throw new ApiError(400, "Insufficient leave balance.");
  }

  user.leaveBalance[leave.type] -= leave.totalDays;
  await user.save();

  leave.status = LEAVE_STATUS.APPROVED;
  leave.approvedBy = managerId;
  leave.note = body.note || null;
  await leave.save();

  await AuditLog.create({
    action: "approved_leave",
    performedBy: managerId,
    targetUser: leave.user,
    note: body.note || null,
    ipAddress,
    userAgent,
  });

  return leave;
};

const rejectLeave = async (leaveId, managerId, body, ipAddress, userAgent) => {
  const leave = await LeaveRequest.findById(leaveId);

  if (!leave) throw new ApiError(404, "Leave request not found.");

  if (leave.status !== LEAVE_STATUS.PENDING) {
    throw new ApiError(400, "This leave request has already been processed.");
  }

  leave.status = LEAVE_STATUS.REJECTED;
  leave.approvedBy = managerId;
  leave.note = body.note || null;
  await leave.save();

  await AuditLog.create({
    action: "rejected_leave",
    performedBy: managerId,
    targetUser: leave.user,
    note: body.note || null,
    ipAddress,
    userAgent,
  });

  return leave;
};

module.exports = {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  approveLeave,
  rejectLeave,
};