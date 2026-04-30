import { Plus, AlertTriangle, Eye, ImageIcon, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { getAllTasks } from "../../../services/taskService";
import { getAllProjects, allocateTask } from "../../../services/projectService";
import { ProjectCard } from "../../../components/dashboard/ProjectCard.jsx";
import { AllocationModal } from "../../../components/dashboard/AllocationModal";
import DesignRequirementModal from "../../../components/dashboard/DesignRequirementModal";
import axios from "axios";

const StatusBadge = ({ status }) => {
    const styles = {
        todo: "bg-gray-100 text-gray-600",
        progress: "bg-blue-100 text-blue-600",
        completed: "bg-green-100 text-green-600",
        overdue: "bg-red-100 text-red-600",
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || styles.todo}`}>
            {status}
        </span>
    );
};

const Tasks = () => {
    console.log("Tasks component loaded - v2.1 Fixed");
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProjectId, setSelectedProjectId] = useState(null);

    const [loadingProject, setLoadingProject] = useState(null);
    const [isAllocationModalOpen, setIsAllocationModalOpen] = useState(false);
    const [isAllocating, setIsAllocating] = useState(false);
    const [allocationProject, setAllocationProject] = useState(null);

    // 🔹 DESIGN REQUIREMENT MODAL STATE
    const [isDesignModalOpen, setIsDesignModalOpen] = useState(false);
    const [selectedDesignTask, setSelectedDesignTask] = useState(null);
    const [viewImage, setViewImage] = useState(null); // URL for image modal

    const fetchData = async () => {
        try {
            const [tasksData, projectsData] = await Promise.all([getAllTasks(), getAllProjects()]);
            setTasks(tasksData);
            setProjects(projectsData);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleProjectSelect = (project) => {
        setSelectedProjectId(prev => prev === project.projectId ? null : project.projectId);
    };

    // Allocation Handler (Triggered by Card)
    const handleAllocateClick = (project) => {
        setAllocationProject(project);
        setIsAllocationModalOpen(true);
    };

    // Confirm Handler (Triggered by Modal)
    const handleConfirmAllocate = async (payload) => {
        if (!allocationProject) return;

        try {
            setIsAllocating(true);
            setLoadingProject(allocationProject.projectId);
            // payload contains { type, autoCount, manualUserIds }
            await allocateTask(allocationProject.projectId, payload);

            // Refresh
            alert("Allocation Successful!");
            setIsAllocationModalOpen(false);
            fetchData();

        } catch (error) {
            console.error("Allocation failed", error);
            alert("Failed to allocate task: " + (error.response?.data || error.message));
        } finally {
            setIsAllocating(false);
            setLoadingProject(null);
            setAllocationProject(null);
        }
    };

    // Handle Designer Click
    const handleDesignerClick = (task, employee) => {
        // Allow adding requirements for DESIGNER and generic EMPLOYEE roles
        // This ensures the feature works even if the user hasn't strictly set up a "DESIGNER" role yet.
        const role = employee.role ? employee.role.toUpperCase() : '';
        if (role === 'DESIGNER' || role === 'EMPLOYEE' || role === 'PROJECT_MANAGER') {
            setSelectedDesignTask(task);
            setIsDesignModalOpen(true);
        } else {
            // If completely unknown role, maybe just alert or ignore
            // But usually it's one of these.
            console.warn("Click ignored for role:", role);
        }
    };

    const handleSaveRequirements = async (taskId, requirements) => {
        try {
            // Use authenticated service instead of direct axios
            const { updateDesignRequirements } = await import("../../../services/taskService");
            await updateDesignRequirements(taskId, requirements);

            alert("Requirements sent to Designer!");
            setIsDesignModalOpen(false); // Close modal
            fetchData(); // Refresh to see update
        } catch (error) {
            console.error("Failed to save requirements", error);
            alert("Failed to send requirements: " + (error.response?.data?.message || error.message));
        }
    };

    const handleApprove = async (taskId, approved) => {
        const feedback = approved ? "Approved by PM" : prompt("Enter rejection reason:");
        if (!approved && !feedback) return; // Cancelled

        try {
            const { approveTask } = await import("../../../services/taskService");
            await approveTask(taskId, approved, feedback);
            alert(approved ? "Task Approved" : "Task Rejected");
            fetchData();
        } catch (error) {
            console.error("Approval failed", error);
            alert("Failed to update approval status");
        }
    };

    return (
        <div className="space-y-8">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                        Tasks
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Track work allocation, progress, and deadlines
                    </p>
                </div>
            </div>

            {/* PROJECTS SECTION */}
            {projects.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-700">Projects Overview</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {projects.map(project => {
                            const hasTasks = tasks.some(t => t.project?.projectId === project.projectId);
                            return (
                                <ProjectCard
                                    key={project.projectId}
                                    project={{
                                        ...project,
                                        isSelected: selectedProjectId === project.projectId,
                                        isAllocated: hasTasks
                                    }}
                                    onSelect={handleProjectSelect}
                                    onAllocate={() => handleAllocateClick({
                                        ...project,
                                        isAllocated: hasTasks
                                    })}
                                />
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Allocation Modal */}
            <AllocationModal
                isOpen={isAllocationModalOpen}
                onClose={() => setIsAllocationModalOpen(false)}
                onAllocate={handleConfirmAllocate}
                project={allocationProject}
                isAllocating={isAllocating}
            />

            {/* 🔹 DESIGN MODAL */}
            <DesignRequirementModal
                isOpen={isDesignModalOpen}
                onClose={() => setIsDesignModalOpen(false)}
                task={selectedDesignTask}
                onSave={handleSaveRequirements}
            />

            {/* TASK LIST TABLE */}
            <div className="bg-white border rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th className="text-left px-4 py-3">Task</th>
                            <th className="text-left px-4 py-3">Project</th>
                            <th className="text-left px-4 py-3">Assignee</th>
                            <th className="text-left px-4 py-3">Status</th>
                            <th className="text-left px-4 py-3">Deadline</th>
                            <th className="text-left px-4 py-3">Progress</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="text-center py-10 text-gray-500">Loading tasks...</td>
                            </tr>
                        ) : (
                            tasks
                                .filter(task => selectedProjectId ? task.project?.projectId === selectedProjectId : true)
                                .map((task) => (
                                    <tr key={task.taskId} className="border-t hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 font-medium text-gray-800">
                                            {task.taskName}
                                            {task.designRequirements && (
                                                <span className="block text-[10px] text-violet-500 font-normal mt-0.5 truncate max-w-[150px]">
                                                    Req: {task.designRequirements}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            {task.project ? task.project.projectName : "N/A"}
                                        </td>
                                        <td className="px-4 py-3">
                                            {task.assignedEmployees && task.assignedEmployees.length > 0 ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="flex -space-x-2">
                                                        {task.assignedEmployees.slice(0, 3).map((emp, i) => (
                                                            <div
                                                                key={emp.userId || i}
                                                                className={`
                                                                    w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-white
                                                                    ${emp.role === 'DESIGNER' ? 'bg-pink-100 text-pink-600 cursor-pointer hover:ring-pink-300' : 'bg-violet-100 text-violet-600'}
                                                                    transition-all
                                                                `}
                                                                title={`${emp.fullName} (${emp.role}) ${emp.role === 'DESIGNER' ? '- Click to add requirements' : ''}`}
                                                                onClick={() => handleDesignerClick(task, emp)}
                                                            >
                                                                {emp.fullName.charAt(0)}
                                                            </div>
                                                        ))}
                                                        {task.assignedEmployees.length > 3 && (
                                                            <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold ring-2 ring-white">
                                                                +{task.assignedEmployees.length - 3}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="text-sm text-gray-700">
                                                        {task.assignedEmployees.length === 1 ? task.assignedEmployees[0].fullName : `${task.assignedEmployees.length} Assignees`}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 italic">Unassigned</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col gap-1">
                                                <StatusBadge status={task.status.toLowerCase().replace("_", "")} />
                                                {task.phase && (
                                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100 w-fit">
                                                        {task.phase.replace("_", " ")}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {task.deadline || "No deadline"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center justify-between text-xs text-gray-600">
                                                    <span>{task.progress}%</span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full ${task.status === 'COMPLETED' ? 'bg-green-500' : 'bg-blue-500'}`}
                                                        style={{ width: `${task.progress}%` }}
                                                    />
                                                </div>

                                                {/* 🔹 Design Verification UI */}
                                                {(task.approvalStatus !== 'NONE' && task.approvalStatus !== null) && (task.designImageUrls?.length > 0) && (
                                                    <div className="mt-2 text-xs space-y-1">
                                                        {task.designImageUrls && task.designImageUrls.length > 0 ? (
                                                            task.designImageUrls.map((url, index) => (
                                                                <button
                                                                    key={index}
                                                                    onClick={() => setViewImage(`http://localhost:9999/${url}`)}
                                                                    className="flex items-center gap-1 text-violet-600 hover:underline font-medium focus:outline-none"
                                                                >
                                                                    <ImageIcon className="w-3 h-3" />
                                                                    View Design {index + 1}
                                                                </button>
                                                            ))
                                                        ) : (
                                                            <span className="text-gray-400 italic mb-2 block">No designs attached</span>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Approval UI */}
                                                {task.approvalStatus === 'PENDING' && (
                                                    <div className="flex gap-2 mt-1">
                                                        <button
                                                            onClick={() => handleApprove(task.taskId, true)}
                                                            className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 shadow-sm"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleApprove(task.taskId, false)}
                                                            className="px-2 py-1 text-xs bg-red-100 text-red-600 border border-red-200 rounded hover:bg-red-200"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                                {task.approvalStatus === 'REJECTED' && (
                                                    <span className="text-xs text-red-500 font-medium">Needs Revision</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                        )}
                    </tbody>
                </table>
            </div>
            {/* IMAGE VIEW MODAL */}
            {viewImage && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setViewImage(null)}>
                    <button className="absolute top-4 right-4 text-white hover:text-gray-300">
                        <ArrowLeft className="w-6 h-6 rotate-180" /> {/* Using Arrow as Close/Back */}
                    </button>
                    <img
                        src={viewImage}
                        alt="Design Preview"
                        className="max-w-full max-h-[90vh] rounded-lg shadow-2xl object-contain"
                        onClick={(e) => e.stopPropagation()} // Prevent close on image click
                    />
                </div>
            )}
        </div>
    );
};

export default Tasks;
