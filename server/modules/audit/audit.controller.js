// modules/audit/audit.controller.js

const ApiResponse = require("../../utils/ApiResponse");
const { getAllLogs, getMyLogs } = require("./audit.service");

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const allLogs = catchAsync(async (req, res) => {
  const result = await getAllLogs(req.query);

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Audit logs fetched successfully.", result)
    );
});

const myLogs = catchAsync(async (req, res) => {
  const result = await getMyLogs(req.user.id, req.query);

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Your activity logs fetched successfully.", result)
    );
});

module.exports = {
  allLogs,
  myLogs,
};