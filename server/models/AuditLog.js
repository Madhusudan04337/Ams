const mongoose = require("mongoose");
const auditLogSchema = new mongoose.Schema(
    {
        action: {
            type: String,
            enum: [
                "marked",
                "rectified",
                "approved_leave",
                "rejected_leave",
                "login",
                "logout",
            ],
            requried: [true,"Action is required"],
        },
        performedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Perfomance is required"],
        },
        targetUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        attendanceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Attendance",
            default: null,
        },
        oldStatus:{
            type: String,
            default: null,
        },
        newStatus:{
            type: String,
            default: null,
        },
        note:{
            type: String,
            default: null,
        },
        ipAddress: {
            type: String,
            default: null,
        },
        userAgent: {
            type: String,
            default: null,
        },
    },
    {
        timestamp: true,
    }
);

auditLogSchema.index({ performedBy: 1 });
auditLogSchema.index({ targetUser: 1 });
auditLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);