const ApiError = require("../utils/ApiError");

const errorHandler = (err, req, res, next) => {
    if (err instanceof ApiError){
        return res.status(err.statusCode).json ({
            statusCode: err.statusCode,
            success: false,
            message: err.message,
            data: null,
        });
    }

    if (err.name === "ValidationError"){
        const message = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({
            statusCode: 400,
            success: false,
            message: messages.join(", "),
            data: null,
        });
    }

    if (err.code === 11000){
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({
            statusCode: 400,
            success: false,
            message: `${field} already exits.`,
            data: null,
        });
    }

    if (err.name === "JsonWebTokenError"){
        return res.status(401).json({
            statusCode: 401,
            success: false,
            message: "Invalid token. Please log in again.",
            data: null,
        });
    }

    console.error("Unexpected Error", err);
    return res.status(500).json({
        statusCode: 500,
        success: false,
        message: "Internal server error.",
        data:null,
    })
};

module.exports = errorHandler;