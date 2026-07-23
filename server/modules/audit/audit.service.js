// modules/audit/audit.service.js

const AuditLog = require("../../models/AuditLog");
const ApiError = require("../../utils/ApiError");

const getAllLogs = async (query) => {
  const { page = 1, limit = 10, action, userId } = query;

  const filter = {};

  if (action) filter.action = action;
  if (userId) filter.performedBy = userId;

  const skip = (page - 1) * limit;
  const total = await AuditLog.countDocuments(filter);

  const logs = await AuditLog.find(filter)
    .populate("performedBy", "username email role")
    .populate("targetUser", "username email role")
    .populate("attendanceId", "date status")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  return {
    logs,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      limit: Number(limit),
    },
  };
};

const getMyLogs = async (userId, query) => {
  const { page = 1, limit = 10 } = query;

  const filter = { performedBy: userId };

  const skip = (page - 1) * limit;
  const total = await AuditLog.countDocuments(filter);

  const logs = await AuditLog.find(filter)
    .populate("targetUser", "username email")
    .populate("attendanceId", "date status")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  return {
    logs,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    },
  };
};

module.exports = {
  getAllLogs,
  getMyLogs,
};