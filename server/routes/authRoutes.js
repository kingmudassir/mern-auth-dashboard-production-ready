import express from "express"
import { changePassword, forgetPassword, getUser, login, logout, register, resendOTP, resetPassword, verifyOTP } from "../controllers/authController.js"
import { isAuthenticated } from "../middlewares/userAuth.js"

const router = express.Router()

router.post('/register', register)
router.post('/otpVerify', verifyOTP)
router.post('/resendOTP', resendOTP)
router.post('/password/forgot', forgetPassword)
router.put('/password/reset/:token', resetPassword)
router.post('/login', login)
router.post('/logout', isAuthenticated, logout)
router.get('/getuser', isAuthenticated, getUser)
router.put('/changePassword', isAuthenticated, changePassword)

export default router