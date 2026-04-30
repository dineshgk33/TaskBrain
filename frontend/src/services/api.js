import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:9999/api",
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

