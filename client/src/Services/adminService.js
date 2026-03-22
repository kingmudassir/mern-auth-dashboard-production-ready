// authService.js
import { api } from "./api";

const adminService = {
    getAdminStats: async () => {
        return await api.get('/admin/stats');
    },

    getAllUsers: async () => {
        return await api.get('/admin/users');
    },
};

export default adminService;