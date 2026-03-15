import express from "express"
import { changePassword, deleteAccount, forgetPassword, getAllUsers, getUser, login, logout, refreshAccessToken, register, resendOTP, resetPassword, verifyOTP } from "../controllers/authController.js"
import { isAuthenticated } from "../middlewares/userAuth.js"
import { redirectIfAuthenticated } from "../middlewares/authRedirect.js"
import { authorizeRoles } from "../middlewares/authorizeRoles.js"
import { loginLimiter, otpLimiter, signupLimiter } from "../middlewares/rateLimiter.js"

const router = express.Router()

router.post('/register', redirectIfAuthenticated, signupLimiter, register)
router.post('/login', redirectIfAuthenticated, loginLimiter, login)

router.post('/otpVerify', redirectIfAuthenticated, otpLimiter, verifyOTP)
router.post('/resendOTP', redirectIfAuthenticated, otpLimiter, resendOTP)
router.post('/password/forgot', redirectIfAuthenticated, forgetPassword)
router.put('/password/reset/:token', redirectIfAuthenticated, resetPassword)

router.post('/logout', isAuthenticated, logout)
router.get('/getuser', isAuthenticated, getUser)
router.put('/changePassword', isAuthenticated, changePassword)
router.post('/deleteAccount', isAuthenticated, deleteAccount)

// Only for testing purposes!
router.post('/refresh', refreshAccessToken)

// Admin role
router.get('/admin/users', isAuthenticated, authorizeRoles("admin"), getAllUsers)

// route
router.get('/check', redirectIfAuthenticated, (req, res) => {
    // If middleware didn't redirect, user is not authenticated
    res.status(200).json({ alreadyLoggedIn: false });
});

export default router