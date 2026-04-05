const jwt = require = ("jsonwebtoken");
const ApiError = require("../utils/ApiError");

const verifyToken = (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")){
            return next(new ApiError(401, "No token provided. Please log in."))
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();
    } catch (err){
        if (err.name === "TokenExpiredError"){
            return next(new ApiError(401, "Token expired. Please refresh your session."));
        }
        return next(new ApiError(401, "Invalid token. Please log in again."));
    }
};

module.exports = { verifyToken };