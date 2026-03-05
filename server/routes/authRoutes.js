import express from "express"
import { register, resendOTP, verifyOTP } from "../controllers/authController.js"

const router = express.Router()

router.post('/register', register)
router.post('/otpVerify', verifyOTP)
router.post('/resendOTP', resendOTP)

export default router