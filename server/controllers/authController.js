import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errors.js";
import validator from "validator"

const validate = (name, email, password) => {
    if (!name || !email || !password) {
        return "All fields are required."
    }

    if (name.length < 3 || name.length > 50 || !/^[a-zA-Z]{2,}(?:[\s'-][a-zA-Z]{2,})*$/.test(name) ) {
        return "Invalid name."
    }

    if (!validator.isEmail(email)) {
        return "Invalid email."
    }

    if (!validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })) {
        return "Password must be 8+ chars with uppercase, lowercase, number, and symbol."
    }

    return null
}

export const register = catchAsyncError(async (req, res, next) => {
    const {name, email, password} = req.body

    credentialsValidation = validate(name, email, password)


})