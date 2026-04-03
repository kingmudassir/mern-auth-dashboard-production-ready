import express from "express";

// ── Middleware ────────────────────────────────────────────────────
import { isAuthenticated }        from "../middlewares/userAuth.js";
import { redirectIfAuthenticated } from "../middlewares/authRedirect.js";
import { authorizeRoles }          from "../middlewares/authorizeRoles.js";
import { loginLimiter, otpLimiter, signupLimiter } from "../middlewares/rateLimiter.js";

// ── Auth controllers ──────────────────────────────────────────────
import {
    register, login, logout, getUser,
    verifyOTP, resendOTP,
    forgetPassword, resetPassword,
    updateProfile, requestEmailChange, confirmEmailChange,
    changePassword, deleteAccount,
    refreshAccessToken,
    getAdminAccounts, getBannedUsers, getDeletedUsers,
} from "../controllers/authController.js";

// ── Admin: Users ──────────────────────────────────────────────────
import { getUserById }                  from "../controllers/Admin-Controller/All-Users/AllUsers.js";
import { UpdateUserStatus }             from "../controllers/Admin-Controller/All-Users/UpdateUserStatus.js";
import { updateAdminNotes }             from "../controllers/Admin-Controller/All-Users/UpdateAdminNotes.js";
import { updateUserRole }               from "../controllers/Admin-Controller/All-Users/UpdateUserRole.js";
import { updateUserInfo }               from "../controllers/Admin-Controller/All-Users/UpdateUserInfo.js";
import { verifyEmail }                  from "../controllers/Admin-Controller/All-Users/VerifyEmail.js";
import { resetUserPassword }            from "../controllers/Admin-Controller/All-Users/ResetUserPassword.js";
import { sendUserPasswordResetLink }    from "../controllers/Admin-Controller/All-Users/SendUserPasswordResetLink.js";
import { softDeleteUser, restoreSoftDeletedUser } from "../controllers/Admin-Controller/All-Users/SoftDeleteUser.js";

// ── Admin: Reports ────────────────────────────────────────────────
import {
    getReports, getReportById,
    resolveReport, dismissReport, updateReportPriority,
} from "../controllers/Admin-Controller/Reports/ReportsController.js";

// ── Admin: Listings ───────────────────────────────────────────────
import { getAllListings } from "../controllers/Admin-Controller/Listings/GetAllListings.js";
import {
    getPendingListings, getFlaggedListings,
    approveListing, rejectListing, removeFlaggedListing,
} from "../controllers/Admin-Controller/Listings/ListingsController.js";

// ── Admin: Catalogue ──────────────────────────────────────────────
import {
    getMakes, getMakeById, addMake, updateMake, deleteMake, addModelToMake,
    getCities, getCityById, addCity, updateCity, deleteCity,
} from "../controllers/Admin-Controller/Catalogue/CatalogueController.js";

// ── Admin: Dashboard ──────────────────────────────────────────────
import { getAdminStats } from "../controllers/Admin-Controller/Admin-Dashboard/AdminDashboardController.js";
import { getAllUsers } from "../controllers/Admin-Controller/All-Users/GetAllUsers.controller.js";

const router = express.Router();
const admin  = [isAuthenticated, authorizeRoles("admin")]; // shorthand

// ═══════════════════════════════════════════════════════════════════
// PUBLIC AUTH
// ═══════════════════════════════════════════════════════════════════
router.post('/register',          redirectIfAuthenticated, signupLimiter, register);
router.post('/login',             redirectIfAuthenticated, loginLimiter,  login);
router.post('/otpVerify',         redirectIfAuthenticated, otpLimiter,    verifyOTP);
router.post('/resendOTP',         redirectIfAuthenticated, otpLimiter,    resendOTP);
router.post('/password/forgot',   redirectIfAuthenticated, forgetPassword);
router.put ('/password/reset/:token', redirectIfAuthenticated, resetPassword);

// ═══════════════════════════════════════════════════════════════════
// AUTHENTICATED USER
// ═══════════════════════════════════════════════════════════════════
router.post  ('/logout',               isAuthenticated, logout);
router.get   ('/getuser',              isAuthenticated, getUser);
router.put   ('/updateProfile',        isAuthenticated, updateProfile);
router.put   ('/requestEmailChange',   isAuthenticated, requestEmailChange);
router.get   ('/confirm-email-change',                  confirmEmailChange);  // token in query
router.put   ('/password/change',      isAuthenticated, changePassword);
router.delete('/deleteAccount',        isAuthenticated, deleteAccount);

// Testing only — remove in production
router.post('/refresh', refreshAccessToken);

// Auth check (used by redirectIfAuthenticated middleware flow)
router.get('/check', redirectIfAuthenticated, (_req, res) =>
    res.status(200).json({ alreadyLoggedIn: false })
);

// ═══════════════════════════════════════════════════════════════════
// ADMIN: DASHBOARD
// ═══════════════════════════════════════════════════════════════════
router.get('/admin/dashboard/stats', ...admin, getAdminStats);

// ═══════════════════════════════════════════════════════════════════
// ADMIN: USERS
// ═══════════════════════════════════════════════════════════════════
router.get  ('/admin/users',                         ...admin, getAllUsers);
router.get  ('/admin/users/admins',                  ...admin, getAdminAccounts);
router.get  ('/admin/users/banned',                  ...admin, getBannedUsers);
router.get  ('/admin/users/deleted',                 ...admin, getDeletedUsers);
router.get  ('/admin/users/:userId',                 ...admin, getUserById);
router.patch('/admin/users/:userId/status',          ...admin, UpdateUserStatus);
router.patch('/admin/users/:userId/notes',           ...admin, updateAdminNotes);
router.patch('/admin/users/:userId/role',            ...admin, updateUserRole);
router.patch('/admin/users/:userId/info',            ...admin, updateUserInfo);
router.patch('/admin/users/:userId/verify-email-manually', ...admin, verifyEmail);
router.patch('/admin/users/:userId/password/reset',  ...admin, resetUserPassword);
router.post ('/admin/users/:userId/password/reset-link', ...admin, sendUserPasswordResetLink);
router.patch('/admin/users/:userId/soft-delete',     ...admin, softDeleteUser);
router.patch('/admin/users/:userId/restore',         ...admin, restoreSoftDeletedUser);

// ═══════════════════════════════════════════════════════════════════
// ADMIN: REPORTS
// ═══════════════════════════════════════════════════════════════════
router.get  ('/admin/reports',                    ...admin, getReports);
router.get  ('/admin/reports/:reportId',          ...admin, getReportById);
router.patch('/admin/reports/:reportId/resolve',  ...admin, resolveReport);
router.patch('/admin/reports/:reportId/dismiss',  ...admin, dismissReport);
router.patch('/admin/reports/:reportId/priority', ...admin, updateReportPriority);

// ═══════════════════════════════════════════════════════════════════
// ADMIN: LISTINGS
// ═══════════════════════════════════════════════════════════════════
router.get  ('/admin/listings',                        ...admin, getAllListings);
router.get  ('/admin/listings/pending',                ...admin, getPendingListings);
router.get  ('/admin/listings/flagged',                ...admin, getFlaggedListings);
router.patch('/admin/listings/:listingId/approve',     ...admin, approveListing);
router.patch('/admin/listings/:listingId/reject',      ...admin, rejectListing);
router.patch('/admin/listings/:listingId/remove',      ...admin, removeFlaggedListing);

// ═══════════════════════════════════════════════════════════════════
// ADMIN: CATALOGUE — MAKES
// ═══════════════════════════════════════════════════════════════════
router.get   ('/admin/catalogue/makes',                  ...admin, getMakes);
router.get   ('/admin/catalogue/makes/:makeId',          ...admin, getMakeById);
router.post  ('/admin/catalogue/makes',                  ...admin, addMake);
router.patch ('/admin/catalogue/makes/:makeId',          ...admin, updateMake);
router.delete('/admin/catalogue/makes/:makeId',          ...admin, deleteMake);
router.post  ('/admin/catalogue/makes/:makeId/models',   ...admin, addModelToMake);

// ═══════════════════════════════════════════════════════════════════
// ADMIN: CATALOGUE — CITIES
// ═══════════════════════════════════════════════════════════════════
router.get   ('/admin/catalogue/cities',             ...admin, getCities);
router.get   ('/admin/catalogue/cities/:cityId',     ...admin, getCityById);
router.post  ('/admin/catalogue/cities',             ...admin, addCity);
router.patch ('/admin/catalogue/cities/:cityId',     ...admin, updateCity);
router.delete('/admin/catalogue/cities/:cityId',     ...admin, deleteCity);

export default router;