const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const ApiError = require("../../utils/ApiError");
const {ROLES} = require("../../utils/constants");

const generateAccessToken = (user) =>{
    return jwt.sign(
        {
            id: user._id,
            username: user.username,
            role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_ACCESS_EXPIRT || '15m' }
    );
};

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
    return user;
};

const loginUser = async(credentials) => {
    const { email, password } = credentials;

    // find user by email
    const user = await User.findOne({email}).select('+password');
    if (!user){
        throw new ApiError (401, 'Invalid email or password');
    }

    // check if account is activate
    if(!user.isActive){
        throw new ApiError(403, ' Your account as been deactivated. Contact admin.');
    }

    // compare password
    const isPasswordCorrect  = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect){
        throw new ApiError(401, 'Invalid email or password.');
    }

    // generate token 
    const accessToken = generateAccessToken(user);

    // update lost login 
    await User.findByIdAndUpdate(user._id, { lastLogin: new Date()});

    return { user, accessToken };
};

const getMyProfile = async (userId) =>  {
    const user = await User.findById(userId).populate(
        "managerId",
        "username email department"
    );

    if (!user){
        throw new ApiError(404,"User not found.");
    }

    return user;
};

module.exports = {
    registerUser,
    loginUser,
    getMyProfile,
};