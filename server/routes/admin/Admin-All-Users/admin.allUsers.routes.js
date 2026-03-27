import express from "express"
import { isAuthenticated } from "../../../middlewares/userAuth.js";
import { authorizeRoles } from "../../../middlewares/authorizeRoles.js";
import { getAllUsers } from "../../../controllers/Admin-Controller/All-Users/GetAllUsers.controller.js";

const router = express.Router()
router.get('/admin/users', isAuthenticated, authorizeRoles("admin"), getAllUsers)

export default router