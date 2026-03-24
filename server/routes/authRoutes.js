import express from "express"
import { changePassword, confirmEmailChange, deleteAccount, forgetPassword, getAdminStats, getAllUsers, getUser, login, logout, refreshAccessToken, register, requestEmailChange, resendOTP, resetPassword, updateProfile, verifyOTP } from "../controllers/authController.js"
import { isAuthenticated } from "../middlewares/userAuth.js"
import { redirectIfAuthenticated } from "../middlewares/authRedirect.js"
import { authorizeRoles } from "../middlewares/authorizeRoles.js"
import { loginLimiter, otpLimiter, signupLimiter } from "../middlewares/rateLimiter.js"
import { getUserById } from "../controllers/Admin-Controller/All-Users/AllUsers.js"
import { UpdateUserStatus } from "../controllers/Admin-Controller/All-Users/UpdateUserStatus.js"
import { updateAdminNotes } from "../controllers/Admin-Controller/All-Users/UpdateAdminNotes.js"
import { updateUserRole } from "../controllers/Admin-Controller/All-Users/UpdateUserRole.js"
import { updateUserInfo } from "../controllers/Admin-Controller/All-Users/UpdateUserInfo.js"
import { verifyEmail } from "../controllers/Admin-Controller/All-Users/VerifyEmail.js"
import { resetUserPassword } from "../controllers/Admin-Controller/All-Users/ResetUserPassword.js"
import { sendUserPasswordResetLink } from "../controllers/Admin-Controller/All-Users/SendUserPasswordResetLink.js"
import { restoreSoftDeletedUser, softDeleteUser } from "../controllers/Admin-Controller/All-Users/SoftDeleteUser.js"

const router = express.Router()

router.post('/register', redirectIfAuthenticated, signupLimiter, register)
router.post('/login', redirectIfAuthenticated, loginLimiter, login)

router.post('/otpVerify', redirectIfAuthenticated, otpLimiter, verifyOTP)
router.post('/resendOTP', redirectIfAuthenticated, otpLimiter, resendOTP)
router.post('/password/forgot', redirectIfAuthenticated, forgetPassword)
router.put('/password/reset/:token', redirectIfAuthenticated, resetPassword)

router.post('/logout', isAuthenticated, logout)
router.get('/getuser', isAuthenticated, getUser)

// User Profile Settings
router.put('/updateProfile', isAuthenticated, updateProfile)
router.put('/requestEmailChange', isAuthenticated, requestEmailChange);
router.get('/confirm-email-change', confirmEmailChange);
router.put('/password/change', isAuthenticated, changePassword);
router.delete('/deleteAccount', isAuthenticated, deleteAccount)

//Admin Routes
router.get('/admin/stats', isAuthenticated, authorizeRoles("admin"), getAdminStats);
router.get('/admin/users', isAuthenticated, authorizeRoles("admin"), getAllUsers);
router.get('/admin/users/:userId', isAuthenticated, authorizeRoles("admin"), getUserById);
router.patch('/admin/users/:userId/status', isAuthenticated, authorizeRoles("admin"), UpdateUserStatus);
router.patch('/admin/users/:userId/notes', isAuthenticated, authorizeRoles("admin"), updateAdminNotes);
router.patch('/admin/users/:userId/role', isAuthenticated, authorizeRoles("admin"), updateUserRole);
router.patch('/admin/users/:userId/info', isAuthenticated, authorizeRoles("admin"), updateUserInfo);
router.patch('/admin/users/:userId/verify-email-manually', isAuthenticated, authorizeRoles("admin"), verifyEmail);
router.patch('/admin/users/:userId/password/reset', isAuthenticated, authorizeRoles("admin"), resetUserPassword);
router.post('/admin/users/:userId/password/reset-link', isAuthenticated, authorizeRoles("admin"), sendUserPasswordResetLink);
router.patch('/admin/users/:userId/soft-delete', isAuthenticated, authorizeRoles("admin"), softDeleteUser);
router.patch('/admin/users/:userId/restore', isAuthenticated, authorizeRoles("admin"), restoreSoftDeletedUser);

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