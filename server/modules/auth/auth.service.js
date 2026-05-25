const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const ApiError = require("../../utils/ApiError");
const {ROLES} = require("../../utils/constants");
const {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    revokeRefreshToken,
} = require("../../utils/generateTokens");

const registerUser = async (userData) => {
    const { username, email, password, role, managerId, department, phone } = userData;

    //check if user already exists
    const existingUser = await User.findOne({
        $or: [{email},{username}],
    });
    if (existingUser){
        throw new ApiError(400, 'User with this email or username already exists.');
    }

    // validate role
    if (role && !Object.values(ROLES).includes(role)){
        throw new ApiError (400, 'Invalid role provided.');
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // create user
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
        role: role || ROLES.EMPLOYEE,
        managerId: role === ROLES.EMPLOYEE ? managerId: null,
        department,
        phone,
    });
    
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    return userWithoutPassword;
};

const loginUser = async(credentials, ipAddress, userAgent) => {
    const { email, password } = credentials;

    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
        throw new ApiError(401, "Invalid email or password.");
    }

    // Check if account is active
    if (!user.isActive) {
        throw new ApiError(403, "Your account has been deactivated. Contact admin.");
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) throw new ApiError(401,"Invalid email or password.");

    // Generate BOTH tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user, ipAddress, userAgent);

    // Update last login
    await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    return { user: userWithoutPassword, accessToken, refreshToken };
};

const getMyProfile = async (userId) =>  {
    const user = await User.findById(userId).populate(
        "managerId",
        "username email department"
    );

    if (!user){
        throw new ApiError(404,"User not found.");
    }

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    return userWithoutPassword;
};

const refreshAccessToken = async(token) => {
    // verify the refresh token
    const refreshToken = await verifyRefreshToken(token);

    // Generate new access token using the populated user
    const accessToken = generateAccessToken(refreshToken.user);

    return { accessToken };
};

const logoutUser = async (token) => {
    await revokeRefreshToken(token);
    return {
        message: "Logged out successfully."
    };
}

module.exports = {
    registerUser,
    loginUser,
    getMyProfile,
    refreshAccessToken,
    logoutUser,
};