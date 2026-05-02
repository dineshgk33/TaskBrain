import { X } from "lucide-react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { createProject, updateProject } from "../../services/projectService";

const CreateProjectModal = ({ isOpen, onClose, onProjectCreated, projectToEdit }) => {
    const [projectData, setProjectData] = useState({
        projectName: "",
        description: "",
        startDate: "",
        deadline: "",
        priority: "Low",
        status: "PLANNED" // Default status
    });

    useEffect(() => {
        if (projectToEdit) {
            setProjectData({
                projectName: projectToEdit.projectName,
                description: projectToEdit.description || "",
                startDate: projectToEdit.startDate,
                deadline: projectToEdit.deadline,
                priority: projectToEdit.priority,
                status: projectToEdit.status
            });
        } else {
            // Reset for create mode
            setProjectData({
                projectName: "",
                description: "",
                startDate: "",
                deadline: "",
                priority: "Low",
                status: "PLANNED"
            });
        }
    }, [projectToEdit, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProjectData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            if (projectToEdit) {
                await updateProject(projectToEdit.projectId, projectData);
            } else {
                await createProject(projectData);
            }

            if (onProjectCreated) {
                onProjectCreated();
            }
            onClose();
        } catch (error) {
            console.error("Error saving project:", error);
            alert("Failed to save project. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* OVERLAY */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
            />

            {/* MODAL */}
            <div className="relative w-full max-w-lg bg-white rounded-xl shadow-lg p-6">
                {/* HEADER */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                        {projectToEdit ? "Edit Project" : "Create New Project"}
                    </h3>

                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* FORM */}
                <div className="space-y-4">
                    {/* PROJECT NAME */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Project Name
                        </label>
                        <input
                            type="text"
                            name="projectName"
                            value={projectData.projectName}
                            onChange={handleChange}
                            placeholder="Enter project name"
                            className="mt-1 w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                        />
                    </div>

                    {/* DESCRIPTION */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            rows={3}
                            name="description"
                            value={projectData.description}
                            onChange={handleChange}
                            placeholder="Brief project description"
                            className="mt-1 w-full px-3 py-2 border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-pink-400"
                        />
                    </div>

                    {/* DATES */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Start Date
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                value={projectData.startDate}
                                onChange={handleChange}
                                className="mt-1 w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Deadline
                            </label>
                            <input
                                type="date"
                                name="deadline"
                                value={projectData.deadline}
                                onChange={handleChange}
                                className="mt-1 w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                            />
                        </div>
                    </div>

                    {/* PRIORITY & STATUS */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Priority
                            </label>
                            <select
                                name="priority"
                                value={projectData.priority}
                                onChange={handleChange}
                                className="mt-1 w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Status
                            </label>
                            <select
                                name="status"
                                value={projectData.status}
                                onChange={handleChange}
                                className="mt-1 w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                            >
                                <option value="PLANNED">Planned</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="ON_HOLD">On Hold</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>
                    </div>


                    {/* ACTIONS */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-sm font-medium border text-gray-600 hover:bg-gray-100"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 rounded-lg text-sm font-medium
                                bg-gradient-to-r from-pink-500 to-violet-500
                                text-white hover:from-pink-600 hover:to-violet-600
                                transition-all"
                        >
                            {projectToEdit ? "Update Project" : "Create Project"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

CreateProjectModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onProjectCreated: PropTypes.func,
    projectToEdit: PropTypes.object
};

export default CreateProjectModal;
