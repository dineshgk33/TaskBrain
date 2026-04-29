import api from "./api";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const createProject = async (projectData) => {
    const response = await api.post("/projects/create", projectData, getAuthHeaders());
    return response.data;
};

export const getAllProjects = async () => {
    const response = await api.get("/projects", getAuthHeaders());
    return response.data;
};

export const updateProjectTechStack = async (projectId, techStackData) => {
    const response = await api.put(`/projects/${projectId}/tech-stack`, techStackData, getAuthHeaders());
    return response.data;
};

export const updateProject = async (projectId, projectData) => {
    const response = await api.put(`/projects/${projectId}`, projectData, getAuthHeaders());
    return response.data;
};

export const allocateTask = async (projectId, payload) => {
    const response = await api.post(`/projects/${projectId}/allocate`, payload, getAuthHeaders());
    return response.data;
};

export const createProjectMeeting = async (projectId) => {
    const response = await api.post(`/meetings/${projectId}/create`, {}, getAuthHeaders());
    return response.data;
};

export const deleteProjectMeeting = async (projectId) => {
    const response = await api.delete(`/meetings/${projectId}/delete`, getAuthHeaders());
    return response.data;
};
