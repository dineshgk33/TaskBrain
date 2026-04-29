import { useState, useEffect, useRef } from "react";
import { Folder, ArrowLeft, Eye, ClipboardList, CheckCircle, Clock, Send, Upload, Trash2, ImageIcon, Video } from "lucide-react";
import { getTasksByUser, updateTaskProgress, submitTask, uploadDesign, deleteDesign } from "../../services/taskService";
import RequirementViewModal from "../../components/dashboard/RequirementViewModal";

const EmployeeProjects = () => {
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const userRole = (localStorage.getItem("workRole") || localStorage.getItem("role"))?.toUpperCase(); // Get User Role (prefer workRole)

    // Modal State
    const [isReqModalOpen, setIsReqModalOpen] = useState(false);
    const [selectedReqTask, setSelectedReqTask] = useState(null);
    const [viewImage, setViewImage] = useState(null); // URL for image modal
    const fileInputRef = useRef(null);
    const [uploadingTaskId, setUploadingTaskId] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        try {
            const allTasks = await getTasksByUser(userId);
            setTasks(allTasks);

            // Group tasks by project to derive My Projects list
            const projectMap = new Map();
            allTasks.forEach(task => {
                if (task.project) {
                    if (!projectMap.has(task.project.projectId)) {
                        projectMap.set(task.project.projectId, {
                            ...task.project,
                            taskCount: 0,
                            myTasks: []
                        });
                    }
                    const proj = projectMap.get(task.project.projectId);
                    proj.taskCount += 1;
                    proj.myTasks.push(task);
                }
            });
            setProjects(Array.from(projectMap.values()));
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewRequirements = (task) => {
        setSelectedReqTask(task);
        setIsReqModalOpen(true);
    };

    const handleSaveProgress = async (taskId, progress) => {
        try {
            await updateTaskProgress(taskId, progress);
            alert("Progress revised!");
            fetchData(); // Refresh to ensure data consistency
        } catch (e) {
            alert("Update failed");
        }
    };

    const handleUploadClick = (taskId) => {
        setUploadingTaskId(taskId);
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file || !uploadingTaskId) return;

        try {
            await uploadDesign(uploadingTaskId, file);
            alert("Design uploaded successfully!");
            fetchData();
        } catch (e) {
            console.error(e);
            alert("Upload failed: " + (e.response?.data || e.message));
        } finally {
            setUploadingTaskId(null);
            e.target.value = ''; // Reset input
        }
    };

    const handleSubmitTask = async (taskId) => {
        if (!window.confirm("Are you sure you want to submit these designs for verification?")) return;
        try {
            await submitTask(taskId);
            alert("Sent for verification!");
            fetchData();
        } catch (e) {
            console.error(e);
            alert("Submission failed: " + (e.response?.data || e.message));
        }
    };

    const handleDeleteDesign = async (taskId, imageUrl) => {
        if (!window.confirm("Are you sure you want to delete this design?")) return;
        try {
            await deleteDesign(taskId, imageUrl);
            alert("Design deleted successfully!");
            fetchData();
        } catch (e) {
            console.error(e);
            alert("Deletion failed: " + (e.response?.data || e.message));
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading your projects...</div>;
    }

    // PROJECT DETAILS VIEW
    if (selectedProject) {
        return (
            <div className="space-y-6 animate-in fade-in duration-300">
                {/* Header with Back Button */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setSelectedProject(null)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{selectedProject.projectName}</h2>
                        <p className="text-gray-500">{selectedProject.description}</p>
                    </div>
                </div>

                {/* Meeting Access for Employees */}
                {selectedProject.meetingLink && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3 text-blue-800">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Video className="w-5 h-5 animate-pulse" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm">Meeting is Active!</p>
                                <p className="text-xs text-blue-600">The manager has started a project meeting.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => window.open(selectedProject.meetingLink, "_blank")}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            <Video className="w-4 h-4" />
                            Join Now
                        </button>
                    </div>
                )}

                {/* My Tasks in this Project */}
                <div className="bg-white border rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b bg-gray-50">
                        <h3 className="font-semibold text-gray-700">My Tasks in this Project</h3>
                    </div>
                    <div className="divide-y max-h-[600px] overflow-y-auto">
                        {selectedProject.myTasks.map(task => (
                            <div key={task.taskId} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-semibold text-lg text-gray-800">{task.taskName}</h4>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide
                                                ${task.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {task.status || 'PENDING'}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed">{task.description}</p>

                                        {/* Requirement Button */}
                                        <div>
                                            {task.designRequirements ? (
                                                <button
                                                    onClick={() => handleViewRequirements(task)}
                                                    className="inline-flex items-center gap-2 text-sm font-medium text-violet-600 bg-violet-50 hover:bg-violet-100 border border-violet-100 px-4 py-2 rounded-lg transition-colors"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    View Requirements
                                                </button>
                                            ) : (
                                                <span className="text-sm text-gray-400 italic flex items-center gap-1">
                                                    No specific requirements
                                                </span>
                                            )}
                                        </div>

                                        {/* Upload & Submit Buttons - Always Visible for Designer */}
                                        <div className="flex flex-col gap-2">
                                            {/* Uploaded Designs List */}
                                            {task.designImageUrls && task.designImageUrls.length > 0 && (
                                                <div className="flex flex-col gap-2 mb-3">
                                                    <div className="text-xs text-gray-500 font-semibold">Uploaded Designs:</div>
                                                    {task.designImageUrls.map((url, index) => (
                                                        <div key={index} className="flex items-center justify-between bg-violet-50 px-3 py-2 rounded-lg border border-violet-100">
                                                            <button
                                                                onClick={() => setViewImage(`http://localhost:8080/${url}`)}
                                                                className="flex items-center gap-2 text-xs font-medium text-violet-700 hover:underline truncate max-w-[150px]"
                                                                title="View Design"
                                                            >
                                                                <ImageIcon className="w-3 h-3" />
                                                                Design File {index + 1}
                                                            </button>
                                                            {userRole === 'DESIGNER' && (
                                                                <button
                                                                    onClick={() => handleDeleteDesign(task.taskId, url)}
                                                                    className="p-1 hover:bg-red-100 rounded text-red-500 transition-colors"
                                                                    title="Delete Design"
                                                                >
                                                                    <Trash2 className="w-3 h-3" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex items-center gap-2">
                                                {userRole === 'DESIGNER' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleUploadClick(task.taskId)}
                                                            className="inline-flex items-center gap-2 text-sm font-medium text-violet-700 bg-violet-100 hover:bg-violet-200 px-4 py-2 rounded-lg transition-colors border border-violet-200"
                                                        >
                                                            <Upload className="w-4 h-4" />
                                                            Upload Design
                                                        </button>

                                                        {task.designImageUrls && task.designImageUrls.length > 0 && (
                                                            <button
                                                                onClick={() => handleSubmitTask(task.taskId)}
                                                                className="inline-flex items-center gap-2 text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 px-5 py-2 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                                            >
                                                                <Send className="w-4 h-4" />
                                                                Send to Manager
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress */}
                                    <div className="w-full md:w-64 bg-gray-50 p-4 rounded-xl border">
                                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                                            <span>Progress</span>
                                            <span className="font-bold">{task.progress}%</span>
                                        </div>
                                        {task.approvalStatus === 'PENDING' ? (
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div className="bg-amber-400 h-2.5 rounded-full" style={{ width: `${task.progress}%` }} />
                                                <p className="text-xs text-amber-600 mt-2 font-medium text-center">Under Review</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={task.progress}
                                                    onChange={(e) => {
                                                        const val = parseInt(e.target.value);
                                                        // Update local state deeply
                                                        // Note: In a real app we might want better state management, but for now we rely on re-fetching or simple local update if needed. 
                                                        // Here we just let the slider move but the "Save" sends the api.
                                                        // Since we don't have deep setProjects logic here, visual feedback might lag without fetch.
                                                        // Let's just rely on the slider visual for now or trigger re-render properly.
                                                        // Actually, since `selectedProject` is derived state from `tasks`, updating `tasks` updates this view.
                                                        setTasks(curr => curr.map(t => t.taskId === task.taskId ? { ...t, progress: val } : t));

                                                        // Also update inside selectedProject for immediate feedback
                                                        setSelectedProject(prev => ({
                                                            ...prev,
                                                            myTasks: prev.myTasks.map(t => t.taskId === task.taskId ? { ...t, progress: val } : t)
                                                        }));
                                                    }}
                                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
                                                />
                                                <button
                                                    onClick={() => handleSaveProgress(task.taskId, task.progress)}
                                                    className="w-full py-1.5 text-xs font-semibold bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                                                >
                                                    Save Progress
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Modal Reuse */}
                <RequirementViewModal
                    isOpen={isReqModalOpen}
                    onClose={() => setIsReqModalOpen(false)}
                    title={selectedReqTask?.taskName}
                    content={selectedReqTask?.designRequirements}
                />

                {/* Hidden File Input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                />

                {/* IMAGE VIEW MODAL */}
                {
                    viewImage && (
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
                    )
                }
            </div >
        );
    }

    // PROJECTS LIST VIEW
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    My Projects
                </h2>
                <p className="text-gray-500 mt-1">Projects you are actively contributing to</p>
            </div>

            {projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white/50 border-2 border-dashed border-gray-200 rounded-2xl hover:bg-white/80 transition-colors">
                    <div className="p-4 bg-gray-50 rounded-full mb-4">
                        <Folder className="w-10 h-10 text-gray-300" />
                    </div>
                    <p className="text-gray-500 font-medium">No active projects found</p>
                    <p className="text-sm text-gray-400 mt-1">Assignments will appear here automatically</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map(project => (
                        <div
                            key={project.projectId}
                            onClick={() => setSelectedProject(project)}
                            className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100"
                        >
                            {/* Decorative Gradient Background */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-100/50 to-pink-100/50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500" />

                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="p-3 bg-gradient-to-br from-violet-50 to-white border border-violet-100 rounded-xl shadow-sm text-violet-600 group-hover:from-violet-600 group-hover:to-indigo-600 group-hover:text-white group-hover:shadow-violet-200 transition-all duration-300">
                                        <Folder className="w-6 h-6" />
                                    </div>
                                    <span className="px-3 py-1 text-xs font-semibold bg-gray-50 text-gray-600 rounded-full border border-gray-100 group-hover:border-violet-100 group-hover:bg-violet-50 group-hover:text-violet-600 transition-colors">
                                        {project.taskCount} Task{project.taskCount !== 1 ? 's' : ''}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-gray-800 mb-2 pr-4 group-hover:text-violet-700 transition-colors">
                                    {project.projectName}
                                </h3>
                                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed h-10">
                                    {project.description || "No description provided."}
                                </p>

                                <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between text-xs font-medium text-gray-400 group-hover:text-violet-500 transition-colors">
                                    <div className="flex items-center gap-2">
                                        <span>View Details</span>
                                        {project.meetingLink && (
                                            <span className="flex items-center gap-1 text-blue-600 animate-pulse">
                                                <Video className="w-3 h-3" />
                                                Live
                                            </span>
                                        )}
                                    </div>
                                    <ArrowLeft className="w-4 h-4 rotate-180 transform group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EmployeeProjects;
