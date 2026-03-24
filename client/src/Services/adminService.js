// authService.js
import { api } from "./api";

const adminService = {
    getAdminStats: async () => {
        return await api.get('/admin/stats');
    },

    getAllUsers: async () => {
        return await api.get('/admin/users');
    },

    getDeletedUsers: async () => {
        return await api.get('/admin/users/deleted');
    },

    getBannedUsers: async () => {
        return await api.get('/admin/users/banned');
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

    resetUserPassword: async ({ userId, newPassword }) => {
        return await api.patch(`/admin/users/${userId}/password/reset`, { newPassword });
    },

    sendUserPasswordResetLink: async ({ userId }) => {
        return await api.post(`/admin/users/${userId}/password/reset-link`);
    },

    softDeleteUser: async ({ userId }) => {
        return await api.patch(`/admin/users/${userId}/soft-delete`);
    },

    restoreUser: async ({ userId }) => {
        return await api.patch(`/admin/users/${userId}/restore`);
    },
};

export default adminService;