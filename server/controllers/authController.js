import { catchAsyncError } from "../middlewares/catchAsyncError.js";

export const register = catchAsyncError(async (req, res, send) => {
    console.log("(1) - Register Hit!")
})