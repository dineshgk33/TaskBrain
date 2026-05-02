import axios from "axios";

const API_URL = "https://taskbrain-5jmj.onrender.com/api/tasks";

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

export const getAllTasks = async () => {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
};

export const updateTaskProgress = async (taskId, progress) => {
    const response = await axios.put(`${API_URL}/${taskId}/progress`, { progress }, getAuthHeaders());
    return response.data;
};

export const approveTask = async (taskId, approved, feedback) => {
    const response = await axios.put(`${API_URL}/${taskId}/approval`, { approved, feedback }, getAuthHeaders());
    return response.data;
};

export const updateDesignRequirements = async (taskId, requirements) => {
    const response = await axios.patch(`${API_URL}/${taskId}/requirements`, { requirements }, getAuthHeaders());
    return response.data;
};

export const submitTask = async (taskId) => {
    const response = await axios.put(`${API_URL}/${taskId}/submit`, {}, getAuthHeaders());
    return response.data;
};

export const uploadDesign = async (taskId, file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(`${API_URL}/${taskId}/design`, formData, {
        headers: {
            ...getAuthHeaders().headers,
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
};

export const deleteDesign = async (taskId, imageUrl) => {
    const response = await axios.delete(`${API_URL}/${taskId}/design`, {
        params: { imageUrl },
        ...getAuthHeaders()
    });
    return response.data;
};

