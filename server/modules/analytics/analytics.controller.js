// modules/analytics/analytics.controller.js

const ApiResponse = require("../../utils/ApiResponse");
const {
  getMySummary,
  getDepartmentSummary,
} = require("./analytics.service");

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const mySummary = catchAsync(async (req, res) => {
  const summary = await getMySummary(req.user.id, req.query);

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Attendance summary fetched successfully.", {
        summary,
      })
    );
});

const departmentSummary = catchAsync(async (req, res) => {
  const data = await getDepartmentSummary(req.query);

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Department summary fetched successfully.", data)
    );
});

module.exports = {
  mySummary,
  departmentSummary,
};