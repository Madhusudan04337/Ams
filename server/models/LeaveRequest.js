// models/LeaveRequest.js

const mongoose = require("mongoose");
const { LEAVE_TYPES, LEAVE_STATUS } = require("../utils/constants");

const leaveRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    type: {
      type: String,
      enum: Object.values(LEAVE_TYPES),
      required: [true, "Leave type is required"],
    },
    from: {
      type: Date,
      required: [true, "From date is required"],
    },
    to: {
      type: Date,
      required: [true, "To date is required"],
    },
    totalDays: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: [true, "Reason is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(LEAVE_STATUS),
      default: LEAVE_STATUS.PENDING,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    note: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { timestamps: true }
);

leaveRequestSchema.index({ user: 1 });
leaveRequestSchema.index({ status: 1 });
leaveRequestSchema.index({ createdAt: -1 });

module.exports = mongoose.model("LeaveRequest", leaveRequestSchema);