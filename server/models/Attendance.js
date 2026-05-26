const mongoose = require("mongoose");
const { ATTENDANCE_STATUS } = require("../utils/constants")

const attendanceSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true,"User is requried"],
        },
        date: {
            type: Date,
            requried: [true, "Date is required"],
        },
        status: {
            type: String,
            enum: Object.values(ATTENDANCE_STATUS),
            default: ATTENDANCE_STATUS.PRESENT,
        },
        checkIn: {
            type: Date,
            default: null,
        },
        checkOut: {
            type: Date,
            default: null,
        },
        note: {
            type: String,
            trim: true,
            default:null,
        },
        rectifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

attendanceSchema.index({ user: 1, date: 1}, { unique: true });

module.exports = mongoose.model("Attendance",attendanceSchema);