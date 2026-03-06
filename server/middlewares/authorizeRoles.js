import ErrorHandler from "./errors.js";

export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {

        // safety check
        if (!req.user) {
            return next(new ErrorHandler("Authentication required", 401));
        }

        // check if user's role is allowed
        if (!allowedRoles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    `Access denied. Role '${req.user.role}' is not allowed to access this resource.`,
                    403
                )
            );
        }

        next();
    };
};