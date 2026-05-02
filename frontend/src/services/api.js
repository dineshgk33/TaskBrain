import axios from "axios";

const api = axios.create({
    baseURL: "https://taskbrain-5jmj.onrender.com/api",
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

