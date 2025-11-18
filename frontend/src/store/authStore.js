import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:8000/api/auth";

export const useAuthStore = create((set) => ({
    user: null,
    isLoading: false,
    errors: null,
    isAuthenticated: false,
    usCheckingAuth: true,

    signup: async (email, name, password) => {
        set({
            isLoading: true,
            errors: null,
        });

        try {
            const res = await axios.post(`${API_URL}/signup`, {
                email,
                name,
                password,
            });
            console.log(res);
            set({
                isLoading: false,
                user: res.data.user,
                isAuthenticated: true,
            });
        } catch (error) {
            set({
                isLoading: false,
                errors:
                    error.response?.data?.message ||
                    error.response?.data ||
                    "Something went wrong",
            });
            throw error;
        }
    },

    verifyEmail: async (code) => {
        set({
            isLoading: true,
            errors: null,
        });

        try {
            const res = await axios.post(`${API_URL}/verify-email`, { code });
            console.log(res);
            set({
                isLoading: false,
                user: res.data.user,
                isAuthenticated: true,
            });
            return res.data;
        } catch (error) {
            set({
                isLoading: false,
                errors:
                    error.response?.data?.message ||
                    error.response?.data ||
                    "Error verifying email",
            });
            throw error;
        }
    },

    checkAuth: async () => {
        set({
            isCheckingAuth: true,
            errors: null,
        });
        try {
            const res = await axios.get(`${API_URL}/check-auth`);
            set({
                isCheckingAuth: false,
                user: res.data.user,
                isAuthenticated: true,
            });
        } catch (error) {
            set({
                isCheckingAuth: false,
                errors: null,
                isAuthenticated: false,
            });
            throw error;
        }
    },
}));
