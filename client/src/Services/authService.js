// authService.js
import { api } from "./api";

const authService = {
    // ── Public routes ──
    register: async (data) => {
        return await api.post('/register', data);
    },

    login: async (data) => {
        return await api.post('/login', data);
    },

    verifyOTP: async (data) => {
        return await api.post('/otpVerify', data);
    },

    resendOTP: async (data) => {
        return await api.post('/resendOTP', data);
    },

    forgotPassword: async (data) => {
        return await api.post('/password/forgot', data);
    },

    resetPassword: async ({ token, password, confirmPassword }) => {
        return await api.put(`/password/reset/${token}`, { password, confirmPassword });
    },

    // ── Authenticated user routes ──
    logout: async () => {
        return await api.post('/logout');
    },

    getUser: async () => {
        const data = await api.get('/getuser')
        return data.user
    },

    changePassword: async (data) => {
        return await api.put('/changePassword', data);
    },

    deleteAccount: async () => {
        return await api.post('/deleteAccount');
    },

    // ── Testing / Admin routes ──
    refreshAccessToken: async () => {
        return await api.post('/refresh');
    },

    getAllUsers: async () => {
        return await api.get('/admin/users');
    },

    checkAuth: async () => {
        return await api.get('/check');
    },
};

export default authService;