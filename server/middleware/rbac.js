const ApiError = require("../utils/ApiError");

const requireRole = (...roles) =>{
    return (req, res, next) => {
        if (!req.user){
            return next(new ApiError(401, "Unauthorized. Please log in."));
        }

        if (!roles.includes(req.user.role)){
            return next(new ApiError(403, "Forbidden. You do not have permission."));
        };
        
        next();
    };
};

module.exports = { requireRole };