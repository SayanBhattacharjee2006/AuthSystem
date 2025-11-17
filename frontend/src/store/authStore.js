import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:8000/api/auth";

export const useAuthStore = create((set) => ({
    user:null,
    isLoading:false,
    errors:null,
    isAuthenticated: false,
    usCheckingAuth:true,

    signup : async (email,name,password) => {
        set(
            {
                isLoading:true,
                errors:null
            }
        )

        try {
            const res = await axios.post(`${API_URL}/signup`,{email,name,password})
            console.log(res)
            set({
                isLoading:false,
                user:res.data.user,
                isAuthenticated:true
            })
        } catch (error) {
            set({
                isLoading:false,
                errors: error.response?.data?.message || error.response?.data || "Something went wrong"
           })
           throw error;
        }
    }
}))