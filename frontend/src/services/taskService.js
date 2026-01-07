import axios from "axios";

const API_URL = "http://localhost:8080/api/tasks";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const getTasksByUser = async (userId) => {
    const response = await axios.get(`${API_URL}/user/${userId}`, getAuthHeaders());
    return response.data;
};
