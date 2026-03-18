class ErrorHandler extends Error {
    constructor (message, statusCode) {
        super(message)
        this.statusCode = statusCode
        Error.captureStackTrace(this, this.constructor)
    }
}

const ErrorMap = {

    // -----------------------------
    // MONGOOSE / DATABASE ERRORS
    // -----------------------------

    // ValidationError: {
    //     statusCode: 400,
    //     message: "Validation failed."
    // },

    ValidationError: { 
        statusCode: 400, 
        message: (err) => Object.values(err.errors || {}).map(e => e.message).join(", ") 
    },

    CastError: {
        statusCode: 400,
        message: "Invalid ID format."
    },

    // MongoServerError: {
    //     statusCode: 500,
    //     message: "Database server error."
    // },

    MongoServerError: { 
        statusCode: 409, 
        message: (err) => {
            if (err.code === 11000) {
                return `${Object.keys(err.keyValue)[0]} already exists`;
            }
            return "Database error";
        },
    },

    MongoNetworkError: {
        statusCode: 503,
        message: "Database connection error."
    },

    DocumentNotFoundError: {
        statusCode: 404,
        message: "Requested document not found."
    },

    // -----------------------------
    // JWT ERRORS
    // -----------------------------

    JsonWebTokenError: {
        statusCode: 401,
        message: "Invalid authentication token."
    },

    TokenExpiredError: {
        statusCode: 401,
        message: "Authentication token expired."
    },

    // -----------------------------
    // MULTER FILE UPLOAD ERRORS
    // -----------------------------

    MulterError: {
        statusCode: 400,
        message: "File upload error."
    }

}

// ✅ Global Error Middleware
export const errorMiddleware = (err, req, res, next) => {

    // If it's already your custom error
    if (err instanceof ErrorHandler) {
        return res.status(err.statusCode).json({
            success: false,
            message: `${err.message}`
        });
    }

    // If it's a mapped Mongoose error (example: ValidationError)
    if (err.name && ErrorMap[err.name]) {
        const map = ErrorMap[err.name]

        const message =
            typeof map.message === "function"
            ? map.message(err)
            : map.message

        return res.status(map.statusCode).json({
            success: false,
            message
    })
    }

    // Fallback → unknown error
    return res.status(500).json({
            success: false,
            message: `${err.message} ---------- Internal Server Error.`,
            stack: err.stack
        })
};

export default ErrorHandler