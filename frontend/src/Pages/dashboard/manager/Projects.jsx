import { Plus, Search, Filter, Calendar, Flag, MoreVertical, Sparkles, CheckCircle, Layout, Server, Database, UserPlus } from "lucide-react";
import { useState, useEffect } from "react";
import CreateProjectModal from "../../../components/dashboard/CreateProjectModel.jsx";
import TechStackModal from "../../../components/dashboard/TechStackModal.jsx";
import { getAllTasks } from "../../../services/taskService";
import { getAllProjects, allocateTask } from "../../../services/projectService";
import { AllocationModal } from "../../../components/dashboard/AllocationModal";
import { ProjectCard } from "../../../components/dashboard/ProjectCard.jsx";

const StatCard = ({ title, value }) => (
    <div className="bg-white border rounded-xl p-5 shadow-sm">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-800 mt-1">
            {value}
        </p>
    </div>
);


const Projects = () => {
    // 🔹 MODAL STATE
    const [open, setOpen] = useState(false);
    const [aiModalOpen, setAiModalOpen] = useState(false);
    const [selectedRequirement, setSelectedRequirement] = useState("");
    const [selectedProject, setSelectedProject] = useState(null);

    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]); // New state for tasks
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [editingProject, setEditingProject] = useState(null);

    const fetchData = async () => {
        try {
            const [projectsData, tasksData] = await Promise.all([getAllProjects(), getAllTasks()]);
            console.log("DEBUG: Fetched projects:", projectsData);
            setProjects(projectsData);
            setTasks(tasksData); // Store tasks
            setError(null);
        } catch (error) {
            console.error("Failed to fetch data", error);
            setError("Failed to load projects. Please check if backend is running.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSuggestStack = (project) => {
        const req = project.description || `Build a project named ${project.projectName}`;
        setSelectedRequirement(req);
        setSelectedProject(project);
        setAiModalOpen(true);
    };

    const handleEditProject = (project) => {
        setEditingProject(project);
        setOpen(true);
    };

    // Allocation Handler (Triggered by Card)
    const handleAllocateClick = (project) => {
        setSelectedProject(project);
        setAllocationProject(project);
        setIsAllocationModalOpen(true);
    };

    const [isAllocationModalOpen, setIsAllocationModalOpen] = useState(false);
    const [allocationProject, setAllocationProject] = useState(null);

    // Confirm Handler (Triggered by Modal)
    const handleConfirmAllocate = async (payload) => {
        setIsAllocationModalOpen(false);
        if (!allocationProject) return;

        try {
            // payload contains { type, autoCount, manualUserIds }
            await allocateTask(allocationProject.projectId, payload);
            alert("Allocation Successful!");
            fetchData(); // Refresh both projects and tasks
        } catch (error) {
            console.error("Allocation failed", error);
            alert("Failed to allocate task: " + (error.response?.data || error.message));
        } finally {
            setAllocationProject(null);
        }
    };

    const stats = {
        total: projects.length,
        active: projects.filter(p => p.status === 'IN_PROGRESS' || p.status === 'PLANNED').length,
        completed: projects.filter(p => p.status === 'COMPLETED').length,
        risk: projects.filter(p => p.priority === 'High' && p.status !== 'COMPLETED').length,
    };

    return (
        <>
            {/* 🔹 MAIN PAGE CONTENT */}
            <div className="space-y-8">
                {/* HEADER */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                            Projects
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Manage, track, and analyze all your projects
                        </p>
                    </div>

                    {/* 🔹 OPEN MODAL BUTTON */}
                    <button
                        onClick={() => {
                            setEditingProject(null); // Clear editing state for create mode
                            setOpen(true);
                        }}
                        className="
                            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                            bg-gradient-to-r from-pink-500 to-violet-500
                            text-white hover:from-pink-600 hover:to-violet-600
                            transition-all
                        "
                    >
                        <Plus className="w-4 h-4" />
                        Create Project
                    </button>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <StatCard title="Total Projects" value={stats.total} />
                    <StatCard title="Active Projects" value={stats.active} />
                    <StatCard title="Completed Projects" value={stats.completed} />
                    <StatCard title="At Risk" value={stats.risk} />
                </div>

                {/* CONTENT */}
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 mb-4">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-10 text-gray-500">Loading projects...</div>
                ) : projects.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        {projects.map(project => {
                            const hasTasks = tasks.some(t => t.project?.projectId === project.projectId);
                            return (
                                <ProjectCard
                                    key={project.projectId}
                                    project={{
                                        ...project,
                                        isAllocated: hasTasks
                                    }}
                                    onSuggestStack={handleSuggestStack}
                                    onEdit={handleEditProject}
                                    onAllocate={() => handleAllocateClick({
                                        ...project,
                                        isAllocated: hasTasks
                                    })}
                                    onRefresh={fetchData}
                                />
                            );
                        })}
                    </div>
                ) : (
                    /* EMPTY STATE */
                    <div className="bg-white border rounded-xl p-8 text-center">
                        <h3 className="text-lg font-medium text-gray-800">
                            No projects yet
                        </h3>
                        <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
                            Start by creating your first project.
                        </p>

                        <button
                            onClick={() => setOpen(true)}
                            className="
                                mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg
                                text-sm font-medium border
                                text-pink-600 border-pink-300
                                hover:bg-pink-50 transition-all
                            "
                        >
                            <Plus className="w-4 h-4" />
                            Create Your First Project
                        </button>
                    </div>
                )}
            </div>

            {/* 🔹 ADD MODAL HERE (BOTTOM, OUTSIDE MAIN DIV) */}
            <CreateProjectModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onProjectCreated={() => {
                    setOpen(false);
                    fetchData();
                }}
                projectToEdit={editingProject}
            />

            {/* 🔹 AI STACK MODAL */}
            <TechStackModal
                isOpen={aiModalOpen}
                onClose={() => {
                    setAiModalOpen(false);
                    fetchData(); // Refresh to show updated data
                }}
                initialRequirement={selectedRequirement}
                projectId={selectedProject?.projectId}
                savedStack={selectedProject} // Pass the full project object as saved stack
            />
            <AllocationModal
                isOpen={isAllocationModalOpen}
                onClose={() => setIsAllocationModalOpen(false)}
                onAllocate={handleConfirmAllocate}
                project={allocationProject}
            />
        </>
    );
};

export default Projects;
