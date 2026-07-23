// modules/leave/leave.controller.js

const ApiResponse = require("../../utils/ApiResponse");
const {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  approveLeave,
  rejectLeave,
} = require("./leave.service");

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const apply = catchAsync(async (req, res) => {
  const leave = await applyLeave(req.user.id, req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, "Leave applied successfully.", { leave }));
});

const myLeaves = catchAsync(async (req, res) => {
  const result = await getMyLeaves(req.user.id, req.query);

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Leave requests fetched successfully.", result)
    );
});

const allLeaves = catchAsync(async (req, res) => {
  const result = await getAllLeaves(req.query);

  return res
    .status(200)
    .json(
      new ApiResponse(200, "All leave requests fetched successfully.", result)
    );
});

const approve = catchAsync(async (req, res) => {
  const leave = await approveLeave(
    req.params.id,
    req.user.id,
    req.body,
    req.ip,
    req.headers["user-agent"]
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Leave approved successfully.", { leave }));
});

const reject = catchAsync(async (req, res) => {
  const leave = await rejectLeave(
    req.params.id,
    req.user.id,
    req.body,
    req.ip,
    req.headers["user-agent"]
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Leave rejected successfully.", { leave }));
});

module.exports = {
  apply,
  myLeaves,
  allLeaves,
  approve,
  reject,
};