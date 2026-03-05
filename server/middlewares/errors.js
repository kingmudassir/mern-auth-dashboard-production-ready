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
            message: `${err.message} ---------- I passed this error myself because this isn't a mongodb error!` || "I passed this error myself because this isn't a mongodb error!"
        });
    }

    // If it's a mapped Mongoose error (example: ValidationError)
    if (err.name && ErrorMap[err.name]) {
        res.status(ErrorMap[err.name].statusCode).json({
            success: false,
            message: ErrorMap[err.name].message
        })
    }

    // Fallback → unknown error
    res.status(500).json({
            success: false,
            message: `${err.message} ---------- Internal Server Error: I resorted to the fallback in errors.js`,
            stack: err.stack
        })
};

export default ErrorHandler