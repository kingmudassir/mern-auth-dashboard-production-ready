import express from "express"
import { changePassword, confirmEmailChange, deleteAccount, forgetPassword, getAdminAccounts, getBannedUsers, getDeletedUsers, getUser, login, logout, refreshAccessToken, register, requestEmailChange, resendOTP, resetPassword, updateProfile, verifyOTP } from "../controllers/authController.js"
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
import { getReports, getReportById, resolveReport, dismissReport, updateReportPriority } from "../controllers/Admin-Controller/Reports/ReportsController.js"
import { getPendingListings, getFlaggedListings, approveListing, rejectListing, removeFlaggedListing } from "../controllers/Admin-Controller/Listings/ListingsController.js"
import { getAllListings } from "../controllers/Admin-Controller/Listings/GetAllListings.js"
import { getMakes, getMakeById, addMake, updateMake, deleteMake, addModelToMake, getCities, getCityById, addCity, updateCity, deleteCity } from "../controllers/Admin-Controller/Catalogue/CatalogueController.js"
import { getAdminStats } from "../controllers/Admin-Controller/Admin-Dashboard/AdminDashboardController.js"

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
// router.get('/admin/stats', isAuthenticated, authorizeRoles("admin"), getAdminStats);
router.get('/admin/users/admins', isAuthenticated, authorizeRoles("admin"), getAdminAccounts);
router.get('/admin/users/banned', isAuthenticated, authorizeRoles("admin"), getBannedUsers);
router.get('/admin/users/deleted', isAuthenticated, authorizeRoles("admin"), getDeletedUsers);
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

// ==================== REPORTS ====================
router.get('/admin/reports', isAuthenticated, authorizeRoles("admin"), getReports);
router.get('/admin/reports/:reportId', isAuthenticated, authorizeRoles("admin"), getReportById);
router.patch('/admin/reports/:reportId/resolve', isAuthenticated, authorizeRoles("admin"), resolveReport);
router.patch('/admin/reports/:reportId/dismiss', isAuthenticated, authorizeRoles("admin"), dismissReport);
router.patch('/admin/reports/:reportId/priority', isAuthenticated, authorizeRoles("admin"), updateReportPriority);

// ==================== LISTINGS ====================
router.get('/admin/listings', isAuthenticated, authorizeRoles("admin"), getAllListings);
router.get('/admin/listings/pending', isAuthenticated, authorizeRoles("admin"), getPendingListings);
router.get('/admin/listings/flagged', isAuthenticated, authorizeRoles("admin"), getFlaggedListings);
router.patch('/admin/listings/:listingId/approve', isAuthenticated, authorizeRoles("admin"), approveListing);
router.patch('/admin/listings/:listingId/reject', isAuthenticated, authorizeRoles("admin"), rejectListing);
router.patch('/admin/listings/:listingId/remove', isAuthenticated, authorizeRoles("admin"), removeFlaggedListing);

// ==================== CATALOGUE: MAKES ====================
router.get('/admin/catalogue/makes', isAuthenticated, authorizeRoles("admin"), getMakes);
router.get('/admin/catalogue/makes/:makeId', isAuthenticated, authorizeRoles("admin"), getMakeById);
router.post('/admin/catalogue/makes', isAuthenticated, authorizeRoles("admin"), addMake);
router.patch('/admin/catalogue/makes/:makeId', isAuthenticated, authorizeRoles("admin"), updateMake);
router.delete('/admin/catalogue/makes/:makeId', isAuthenticated, authorizeRoles("admin"), deleteMake);
router.post('/admin/catalogue/makes/:makeId/models', isAuthenticated, authorizeRoles("admin"), addModelToMake);

// ==================== CATALOGUE: CITIES ====================
router.get('/admin/catalogue/cities', isAuthenticated, authorizeRoles("admin"), getCities);
router.get('/admin/catalogue/cities/:cityId', isAuthenticated, authorizeRoles("admin"), getCityById);
router.post('/admin/catalogue/cities', isAuthenticated, authorizeRoles("admin"), addCity);
router.patch('/admin/catalogue/cities/:cityId', isAuthenticated, authorizeRoles("admin"), updateCity);
router.delete('/admin/catalogue/cities/:cityId', isAuthenticated, authorizeRoles("admin"), deleteCity);

// route
router.get('/check', redirectIfAuthenticated, (req, res) => {
    // If middleware didn't redirect, user is not authenticated
    res.status(200).json({ alreadyLoggedIn: false });
});

export default router