import express from "express"
import { changePassword, forgetPassword, getAllUsers, getUser, login, logout, refreshAccessToken, register, resendOTP, resetPassword, verifyOTP } from "../controllers/authController.js"
import { isAuthenticated } from "../middlewares/userAuth.js"
import { redirectIfAuthenticated } from "../middlewares/authRedirect.js"
import { authorizeRoles } from "../middlewares/authorizeRoles.js"

const router = express.Router()

router.post('/register', redirectIfAuthenticated, register)
router.post('/login', redirectIfAuthenticated, login)
router.post('/otpVerify', redirectIfAuthenticated, verifyOTP)
router.post('/resendOTP', redirectIfAuthenticated, resendOTP)
router.post('/password/forgot', redirectIfAuthenticated, forgetPassword)
router.put('/password/reset/:token', redirectIfAuthenticated, resetPassword)

router.post('/logout', isAuthenticated, logout)
router.get('/getuser', isAuthenticated, getUser)
router.put('/changePassword', isAuthenticated, changePassword)

// Only for testing purposes!
router.post('/refresh', refreshAccessToken)

// Admin role
router.get('/admin/users', isAuthenticated, authorizeRoles("admin"), getAllUsers)

export default router