import api from "./api";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const generateTechStack = async (requirement) => {
    const response = await api.post("/ai/recommend-stack", { requirement }, getAuthHeaders());
    // The backend returns a String (JSON representation), but Axios might parse it if content-type is json.
    // Our Controller returns a String. If it's valid JSON, we might get an object.
    // If it's a string, we parse it.
    if (typeof response.data === 'string') {
        return JSON.parse(response.data);
    }
    return response.data;
};

export const getProjectInsights = async (data) => {
    // data is a JSON string or object summarizing the projects/tasks
    const response = await api.post("/ai/insights", { data: JSON.stringify(data) }, getAuthHeaders());
    if (typeof response.data === 'string') {
        return JSON.parse(response.data);
    }
    return response.data;
};
