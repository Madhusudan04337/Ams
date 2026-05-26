// modules/attendance/attendance.controller.js

const ApiResponse = require("../../utils/ApiResponse");
const {
  markAttendance,
  getMyAttendance,
  getAllAttendance,
  rectifyAttendance,
} = require("./attendance.service");

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const mark = catchAsync(async (req, res) => {
  const attendance = await markAttendance(
    req.user.id,
    req.body,
    req.ip,
    req.headers["user-agent"]
  );

  return res
    .status(201)
    .json(new ApiResponse(201, "Attendance marked successfully.", { attendance }));
});

const myAttendance = catchAsync(async (req, res) => {
  const result = await getMyAttendance(req.user.id, req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, "Attendance history fetched successfully.", result));
});

const allAttendance = catchAsync(async (req, res) => {
  const result = await getAllAttendance(req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, "All attendance fetched successfully.", result));
});

const rectify = catchAsync(async (req, res) => {
  const attendance = await rectifyAttendance(
    req.params.id,
    req.body,
    req.user.id,
    req.ip,
    req.headers["user-agent"]
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Attendance rectified successfully.", { attendance }));
});

module.exports = {
  mark,
  myAttendance,
  allAttendance,
  rectify,
};