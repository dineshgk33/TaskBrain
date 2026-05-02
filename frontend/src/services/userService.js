import axios from "axios";

const API_URL = "https://taskbrain-backend.onrender.com/api/users";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const getAllUsers = async () => {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
};

export const deleteUser = async (userId) => {
    await axios.delete(`${API_URL}/${userId}`, getAuthHeaders());
};

export const getUser = async (userId) => {
    const response = await axios.get(`${API_URL}/${userId}`, getAuthHeaders());
    return response.data;
};

export const updateUser = async (userId, data) => {
    const response = await axios.put(`${API_URL}/${userId}`, data, getAuthHeaders());
    return response.data;
};

export const createUser = async (userData) => {
    const response = await axios.post(API_URL, userData, getAuthHeaders());
    return response.data;
};

export const updateEmployeeProfile = async (userId, profileData) => {
    const response = await axios.put(`${API_URL}/${userId}/employee-profile`, profileData, getAuthHeaders());
    return response.data;
};
