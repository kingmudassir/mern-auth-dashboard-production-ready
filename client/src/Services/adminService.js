// authService.js
import { api } from "./api";

const adminService = {
    getAdminStats: async () => {
        return await api.get('/admin/stats');
    },

    getAllUsers: async () => {
        return await api.get('/admin/users');
    },

    getUserById: async (userId) => {
        return await api.get(`/admin/users/${userId}`);
    },

    updateUserStatus: async ({ userId, status, banReason }) => {
        return await api.patch(`/admin/users/${userId}/status`, { status, banReason });
    },

    updateAdminNotes: async ({ userId, notes }) => {
        return await api.patch(`/admin/users/${userId}/notes`, { notes });
    },

    updateUserRole: async ({ userId, role }) => {
        return await api.patch(`/admin/users/${userId}/role`, { role });
    },

    updateUserInfo: async ({ userId, ...fields }) => {
        return await api.patch(`/admin/users/${userId}/info`, fields);
    },

    manuallyVerifyEmail: async ({ userId }) => {
        return await api.patch(`/admin/users/${userId}/verify-email-manually`);
    },
};

export default adminService;