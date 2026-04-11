const mongoose = require("mongoose");
const { ROLES } = require ("../utils/constants");

const leaveBalanceSchema = new mongoose.Schema(
    {
        casual: { type: Number, default: 12},
        sick: { type: Number, default: 10},
        earned: { type: Number, default: 15},
    },
    { _id: false }
);

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            requried: [true, "Username is required"],
            unique: true,
            trim: true,
            minlength: [3, "Username must be at least 3 characters"],
        },
        email: {
            type: String,
            requried: [true, "Email is requried"],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/,"Please enter a valid email"],
        },
        password: {
            type: String,
            requried: [true,"Password is requried"],
            minlength: [6, "Password must be at least 6 characters"],
        },
        role: {
            type: String,
            enum: Object.values(ROLES),
            default: ROLES.EMPLOYEE,
        },
        managerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        department: {
            type: String,
            trim: true,
            default: null,
        },
        phone: {
            type: String,
            trim: true,
            default: null,
        },
        employeeId: {
            type: String,
            unique: true,
            sparse: true,
            default: null,
        },
        avatar: {
            type: String,
            default: null,
        },
        leaveBalance: {
            type: leaveBalanceSchema,
            default: () => ({}),
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        lastLogin: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.methods.toJSON = function (){
    const user = this.toObject();
    delete user.password;
    return user;
};

module.exports = mongoose.model("User",userSchema);