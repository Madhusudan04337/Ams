const ApiResponse = require("../../utils/ApiResponse");
const ApiError = require("../../utils/ApiError");
const {
    registerUser,
    loginUser,
    getMyProfile
} = require("./auth.service");

const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

const register = catchAsync(async (req, res) => {
    const user = await  registerUser(req.body);
    return res.status(201).json(new ApiResponse(201, "User registered successfully.", { user }));
});

const login = catchAsync(async (req, res) =>{
    const { user, accessToken } = await loginUser(req.body);
    return res.status(200).json(new ApiResponse(200,"Login successful.",{ user, accessToken }));
});

const myProfile = catchAsync(async (req, res) =>{
    const user = await getMyProfile(req.user.id);
    return res.status(200).json(new ApiResponse(200,"Profile fetched successfully.", { user }));
});

module.exports = {
    register,
    login,
    myProfile,
};