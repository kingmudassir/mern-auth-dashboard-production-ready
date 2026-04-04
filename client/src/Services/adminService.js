// authService.js
import { api } from "./api";

const adminService = {
    getAdminStats: async () => {
        return await api.get('/admin/dashboard/stats');
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

    getAdminAccounts: async () => {
        return await api.get('/admin/users/admins');
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

    // ==================== REPORTS ====================
    getReports: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.priority) params.append('priority', filters.priority);
        if (filters.category) params.append('category', filters.category);
        if (filters.page) params.append('page', filters.page);
        if (filters.limit) params.append('limit', filters.limit);
        return await api.get(`/admin/reports?${params.toString()}`);
    },

    getReportById: async (reportId) => {
        return await api.get(`/admin/reports/${reportId}`);
    },

    resolveReport: async ({ reportId, resolution, resolutionNotes }) => {
        return await api.patch(`/admin/reports/${reportId}/resolve`, { resolution, resolutionNotes });
    },

    dismissReport: async (reportId) => {
        return await api.patch(`/admin/reports/${reportId}/dismiss`);
    },

    updateReportPriority: async ({ reportId, priority }) => {
        return await api.patch(`/admin/reports/${reportId}/priority`, { priority });
    },

    // ==================== LISTINGS ====================
    getAllListings: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.page) params.append('page', filters.page);
        if (filters.limit) params.append('limit', filters.limit);
        if (filters.sortBy) params.append('sortBy', filters.sortBy);
        if (filters.order) params.append('order', filters.order);
        return await api.get(`/admin/listings?${params.toString()}`);
    },

    getPendingListings: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.page) params.append('page', filters.page);
        if (filters.limit) params.append('limit', filters.limit);
        if (filters.sortBy) params.append('sortBy', filters.sortBy);
        if (filters.order) params.append('order', filters.order);
        return await api.get(`/admin/listings/pending?${params.toString()}`);
    },

    getFlaggedListings: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.page) params.append('page', filters.page);
        if (filters.limit) params.append('limit', filters.limit);
        if (filters.sortBy) params.append('sortBy', filters.sortBy);
        if (filters.order) params.append('order', filters.order);
        return await api.get(`/admin/listings/flagged?${params.toString()}`);
    },

    // This is the one you were likely calling in ListingReviewPage
    getListingById: async (listingId) => {
        // MATCHES BACKEND: router.get('/admin/listings/:listingId/detail')
        return await api.get(`/admin/listings/${listingId}/detail`);
    },

    approveListing: async (listingId) => {
        return await api.patch(`/admin/listings/${listingId}/approve`);
    },

    rejectListing: async ({ listingId, rejectionReason }) => {
        return await api.patch(`/admin/listings/${listingId}/reject`, { rejectionReason });
    },

    removeFlaggedListing: async (listingId) => {
        return await api.patch(`/admin/listings/${listingId}/remove`);
    },

    // ==================== CATALOGUE: MAKES ====================
    getMakes: async () => {
        return await api.get('/admin/catalogue/makes');
    },

    getMakeById: async (makeId) => {
        return await api.get(`/admin/catalogue/makes/${makeId}`);
    },

    addMake: async ({ name, models }) => {
        return await api.post('/admin/catalogue/makes', { name, models });
    },

    updateMake: async ({ makeId, name, models, isActive }) => {
        return await api.patch(`/admin/catalogue/makes/${makeId}`, { name, models, isActive });
    },

    deleteMake: async (makeId) => {
        return await api.delete(`/admin/catalogue/makes/${makeId}`);
    },

    addModelToMake: async ({ makeId, modelName, years }) => {
        return await api.post(`/admin/catalogue/makes/${makeId}/models`, { modelName, years });
    },

    // ==================== CATALOGUE: CITIES ====================
    getCities: async () => {
        return await api.get('/admin/catalogue/cities');
    },

    getCityById: async (cityId) => {
        return await api.get(`/admin/catalogue/cities/${cityId}`);
    },

    addCity: async ({ name, province, regionCode }) => {
        return await api.post('/admin/catalogue/cities', { name, province, regionCode });
    },

    updateCity: async ({ cityId, name, province, regionCode, isActive }) => {
        return await api.patch(`/admin/catalogue/cities/${cityId}`, { name, province, regionCode, isActive });
    },

    deleteCity: async (cityId) => {
        return await api.delete(`/admin/catalogue/cities/${cityId}`);
    },


};

export default adminService;