import express from "express"
import { isAuthenticated } from "../../../middlewares/userAuth.js";
import { authorizeRoles } from "../../../middlewares/authorizeRoles.js";
import { getAdminStats } from "../../../controllers/Admin-Controller/Admin-Dashboard/AdminDashboardController.js";

const router = express.Router()
router.get('/admin/dashboard/stats', isAuthenticated, authorizeRoles("admin"), getAdminStats);

export default router