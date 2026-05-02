import api from "./api";

// LOGIN
export const login = async (data) => {
    const response = await api.post("/auth/login", data);
    return response.data;
};

// SIGNUP
export const signup = async (data) => {
    const response = await api.post("/auth/signup", data);
    return response.data;
};