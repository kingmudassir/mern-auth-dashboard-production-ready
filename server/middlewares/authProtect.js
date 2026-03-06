import jwt from "jsonwebtoken";
import { User } from "../models/userSchema";
import { catchAsyncError } from "./catchAsyncError";

const protect = catchAsyncError(async (req, res, next) => {
    
})