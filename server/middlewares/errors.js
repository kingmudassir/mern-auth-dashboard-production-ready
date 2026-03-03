class ErrorHandler extends Error {
    constructor (message, statusCode) {
        super(message)
        this.statusCode = statusCode
        Error.captureStackTrace(this, this.constructor)
    }
}

const ErrorMap = {
    ValidationError: {
        statusCode: 400,
        message: "Validation Error!"
    }
}

// ✅ Global Error Middleware
export const errorMiddleware = (err, req, res, next) => {

    // If it's already your custom error
    if (err instanceof ErrorHandler) {
        return res.status(err.statusCode).json({
            success: false,
            message: "Khinzeer ho tum sab log!"
        });
    }

    // If it's a mapped Mongoose error (example: ValidationError)
    if (ErrorMap[err.name]) {
        const mappedError = ErrorMap[err.name];

        return res.status(mappedError.statusCode).json({
            success: false,
            message: mappedError.message
        });
    }

    // Fallback → unknown error
    return res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
};

export default ErrorHandler