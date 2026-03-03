class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

const errorMap = {
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
            if (err.code === 11000) {
                const field = Object.keys(err.keyValue)[0];
                return {
                    statusCode: 409,
                    body: {
                        errors: {
                            [field]: `${field} already exists`
                        }
                    }
                };
            }
            // Generic DB error — not safe to expose, treat as non-operational
            return {
                statusCode: 500,
                body: { message: "Internal Server Error" },
                isOperational: false
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
            return {
                statusCode: 400,
                body: { errors }
            };
        }
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
    },

    // Express JSON body parse error
    SyntaxError: {
        statusCode: 400,
        handler: (err) => {
            // Only handle Express body-parser syntax errors
            if (err.status === 400 && err.body !== undefined) {
                return {
                    statusCode: 400,
                    body: { message: "Malformed JSON in request body" }
                };
            }
            // All other SyntaxErrors are non-operational
            return {
                statusCode: 500,
                body: { message: "Internal Server Error" },
                isOperational: false
            };
        }
    }
};

export const errorMiddleware = (err, req, res, next) => {
    const isDev = process.env.NODE_ENV === "development";

    let statusCode = err.statusCode || 500;
    let responseBody = { message: "Internal Server Error" };
    let isOperational = err.isOperational || false;

    // =========================
    // Map known errors
    // =========================
    if (err.name && errorMap[err.name]) {
        const mapped = errorMap[err.name];

        if (mapped.handler) {
            const result = mapped.handler(err);
            statusCode = result.statusCode;
            responseBody = result.body;
            // Handler can explicitly mark something non-operational
            isOperational = result.isOperational !== false;
        } else {
            statusCode = mapped.statusCode;
            responseBody = { message: mapped.message };
            isOperational = true;
        }
    }

    // =========================
    // Custom operational errors (ErrorHandler instances)
    // Not in the map, but explicitly marked operational
    // =========================
    else if (err.isOperational) {
        statusCode = err.statusCode || 500;
        responseBody = { message: err.message };
        isOperational = true;
    }

    // =========================
    // Logging
    // =========================
    if (!isOperational) {
        console.error("NON-OPERATIONAL ERROR:", err);
    } else {
        console.warn(`OPERATIONAL ERROR [${statusCode}]:`, err.message);
    }

    // =========================
    // Development — always full detail
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
    // Production — operational errors get real response
    // =========================
    if (isOperational) {
        return res.status(statusCode).json({
            success: false,
            ...responseBody
        });
    }

    // Non-operational in production — never leak details
    return res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
};

export default ErrorHandler;