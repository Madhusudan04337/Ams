const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const RefreshToken = require("../models/RefreshToken");

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            username: user.username,
            role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m' }
    );
};

const generateRefreshToken = async( user, ipAddres, userAgent) => {
    // Generate a random token string
    const token = crypto.rondomBytes(64).toString('hex');

    // set expiry to 7 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate()+7);

    //save to db
    const refreshToken = await RefreshToken.create({
        token,
        user: user._id,
        expiresAt,
        ipAddress,
        userAgent,
    });

    return refreshToken.token;
};

const verifyRefreshToken = async(token) => {
    const refreshToken = await RefreshToken.fineOne({ token }).populate("user");

    if (!refreshToken){
        throw new Error("Invalid refresh token.");
    }

    if (refreshToken.isRevoked){
        throw new Error("Refresh token has been revoked. Please log in again. ");
    }

    if(new Date() > refreshToken.expiresAt){
        throw new Error("Refresh token has expired. Please log in again.");
    }
    return refreshToken;
};

const revokeRefreshToken = async(token) => {
    await RefreshToken.findOneAndUpdate(
        { token },
        { isRevoked: true }
    );
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    revokeRefreshToken,
};
