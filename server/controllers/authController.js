import { catchAsyncError } from "../middlewares/catchAsyncError.js";

export const register = catchAsyncError(async (req, res, next) => {
    console.log("Register!")
    res.send({
        message: "Registered!"
    })
})