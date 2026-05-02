import axios from "axios";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api`,
    headers: {
        "Content-Type": "application/json",
    },
});

export const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export default api;

