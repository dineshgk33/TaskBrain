import api from "./api";

export const signup = async (user) => {
  try {
    const res = await api.post("/auth/signup", user);
    return res.data;
  } catch (error) {
    throw error.response?.data || "Signup failed";
  }
};

export const login = async (credentials) => {
  try {
    const res = await api.post("/auth/login", credentials);
    return res.data;
  } catch (error) {
    throw error.response?.data || "Invalid credentials";
  }
};

