// modules/auth/auth.controller.js

const ApiResponse = require("../../utils/ApiResponse");
const ApiError = require("../../utils/ApiError");
const {
  registerUser,
  loginUser,
  getMyProfile,
  refreshAccessToken,
  logoutUser,
} = require("./auth.service");

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const register = catchAsync(async (req, res) => {
  const user = await registerUser(req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, "User registered successfully.", { user }));
});

const login = catchAsync(async (req, res) => {
  const ipAddress = req.ip;
  const userAgent = req.headers["user-agent"];

  const { user, accessToken, refreshToken } = await loginUser(
    req.body,
    ipAddress,
    userAgent
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Login successful.", {
        user,
        accessToken,
        refreshToken,
      })
    );
});

const myProfile = catchAsync(async (req, res) => {
  const user = await getMyProfile(req.user.id);

  return res
    .status(200)
    .json(new ApiResponse(200, "Profile fetched successfully.", { user }));
});

const refresh = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ApiError(400, "Refresh token is required.");
  }

  const { accessToken } = await refreshAccessToken(refreshToken);

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Access token refreshed successfully.", {
        accessToken,
      })
    );
});

const logout = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ApiError(400, "Refresh token is required.");
  }

  await logoutUser(refreshToken);

  return res
    .status(200)
    .json(new ApiResponse(200, "Logged out successfully.", null));
});

module.exports = {
  register,
  login,
  myProfile,
  refresh,
  logout,
};