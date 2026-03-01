class ErrorHandler extends Error {
    constructor (message, statusCode) {
        super(message)
        this.statusCode = statusCode
        this.isOperational = true
        Error.captureStackTrace(this, this.constructor)
    }
}

const errorMap = {
    // Native JS Error
    Error: { 
        statusCode: 500, 
        message: "Internal Server Error" 
    },

    // Mongoose Errors
    CastError: { 
        statusCode: 400, 
        message: "Invalid value or ID format" 
    },

    DocumentNotFoundError: { 
        statusCode: 404, 
        message: "Document not found" 
    },

    MongooseServerSelectionError: { 
        statusCode: 503, 
        message: "Cannot connect to MongoDB server" 
    },

    MongoServerError: { 
        statusCode: 409,
        handler: (err) => {
            // Duplicate key error
            if (err.code === 11000) {
                const field = Object.keys(err.keyValue)[0];
                return {
                    errors: {
                        [field]: `${field} already exists`
                    }
                };
            }

            return {
                message: "Database error"
            };
        }
    },

    ValidationError: { 
        statusCode: 400,
        handler: (err) => {
            const errors = {};

            Object.keys(err.errors || {}).forEach(field => {
                errors[field] = err.errors[field].message;
            });

            return { errors };
        }
    },

    ValidatorError: { 
        statusCode: 400,
        message: "Validation failed"
    },

    VersionError: { 
        statusCode: 409, 
        message: "Document version conflict" 
    },

    // JWT Errors
    JsonWebTokenError: { 
        statusCode: 401, 
        message: "Invalid token. Please login again." 
    },

    TokenExpiredError: { 
        statusCode: 401, 
        message: "Token expired. Please login again." 
    }
};

export const errorMiddleware = (err, req, res, next) => {
    const isDev = process.env.NODE_ENV === "development";

    let statusCode = err.statusCode || 500;
    let responseBody = { message: "Internal Server Error" };

    // =========================
    // Map known errors
    // =========================
    if (err.name && errorMap[err.name]) {
        const mapped = errorMap[err.name];
        statusCode = mapped.statusCode || statusCode;

        // If structured handler exists
        if (mapped.handler) {
            responseBody = mapped.handler(err);
        } else {
            responseBody = {
                message:
                    typeof mapped.message === "function"
                        ? mapped.message(err)
                        : mapped.message
            };
        }

        err.isOperational = true;
    }

    // =========================
    // Custom operational errors
    // =========================
    if (err.isOperational && !errorMap[err.name]) {
        statusCode = err.statusCode || statusCode;
        responseBody = { message: err.message };
    }

    // =========================
    // Logging
    // =========================
    if (!err.isOperational) {
        console.error("NON-OPERATIONAL ERROR:", err);
    } else {
        console.warn("OPERATIONAL ERROR:", err.message);
    }

    // =========================
    // DEVELOPMENT
    // =========================
    if (isDev) {
        return res.status(statusCode).json({
            success: false,
            ...responseBody,
            stack: err.stack,
            error: err
        });
    }

    // =========================
    // PRODUCTION
    // =========================
    if (err.isOperational) {
        return res.status(statusCode).json({
            success: false,
            ...responseBody
        });
    }

    // Non-operational in production
    return res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
};


export default ErrorHandler