import { ClipboardList, CheckCircle, Clock, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { getTasksByUser, updateTaskProgress } from "../../services/taskService";
import RequirementViewModal from "../../components/dashboard/RequirementViewModal";

const StatCard = ({ title, value, icon, color }) => {
    const Icon = icon;
    return (
        <div className="bg-white border rounded-xl p-5 flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-2xl font-semibold text-gray-800 mt-1">
                    {value}
                </p>
            </div>
            <div className={`p-3 rounded-lg ${color} bg-opacity-15`}>
                <Icon className={`w-6 h-6 ${color.replace("bg", "text")}`} />
            </div>
        </div>
    );
};

const EmployeeDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        pending: 0
    });

    // Modal State
    const [isReqModalOpen, setIsReqModalOpen] = useState(false);
    const [selectedReqTask, setSelectedReqTask] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        try {
            const data = await getTasksByUser(userId);
            setTasks(data);

            setStats({
                total: data.length,
                completed: data.filter(t => t.status === "COMPLETED").length,
                pending: data.filter(t => t.status !== "COMPLETED").length
            });
        } catch (error) {
            console.error("Failed to fetch tasks", error);
        }
    };

    const handleViewRequirements = (task) => {
        setSelectedReqTask(task);
        setIsReqModalOpen(true);
    };

    return (
        <div className="space-y-8">
            {/* HEADER */}
            <div>
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                    Employee Dashboard
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    View your assigned tasks and track your progress
                </p>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard
                    title="Total Tasks"
                    value={stats.total}
                    icon={ClipboardList}
                    color="bg-pink-500"
                />

                <StatCard
                    title="Completed"
                    value={stats.completed}
                    icon={CheckCircle}
                    color="bg-emerald-500"
                />

                <StatCard
                    title="Pending"
                    value={stats.pending}
                    icon={Clock}
                    color="bg-violet-500"
                />
            </div>

            {/* TASK LIST OR EMPTY STATE */}
            {tasks.length === 0 ? (
                <div className="bg-white border rounded-xl p-8 text-center">
                    <p className="text-gray-600">
                        No tasks assigned yet.
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        Tasks assigned by your manager will appear here.
                    </p>
                </div>
            ) : (
                <div className="bg-white border rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b bg-gray-50">
                        <h3 className="font-semibold text-gray-700">Assigned Tasks</h3>
                    </div>
                    <div className="divide-y">
                        {tasks.map(task => (
                            <div key={task.taskId} className="p-4 hover:bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-medium text-gray-800">{task.taskName}</h4>
                                        {task.phase && (
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 uppercase tracking-wide">
                                                {task.phase.replace("_", " ")}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 line-clamp-1">{task.description}</p>

                                    {/* Design Requirements Button */}
                                    <div className="mt-3">
                                        {task.designRequirements ? (
                                            <button
                                                onClick={() => handleViewRequirements(task)}
                                                className="group flex items-center gap-2 text-xs font-medium text-violet-600 bg-violet-50 hover:bg-violet-100 border border-violet-100 px-3 py-2 rounded-lg transition-colors"
                                            >
                                                <span>🎨</span>
                                                View Design Requirements
                                                <Eye className="w-3 h-3 text-violet-400 group-hover:text-violet-600 transition-colors" />
                                            </button>
                                        ) : (
                                            <p className="text-xs text-gray-400 italic flex items-center gap-1">
                                                <span>🎨</span> No requirements set
                                            </p>
                                        )}
                                    </div>

                                    {/* Approval Status Message */}
                                    {task.approvalStatus === 'PENDING' && (
                                        <p className="text-xs text-amber-600 font-medium mt-2 flex items-center gap-1">
                                            <ClipboardList className="w-3 h-3" /> Under Manager Review
                                        </p>
                                    )}
                                    {task.approvalStatus === 'REJECTED' && (
                                        <p className="text-xs text-red-600 font-medium mt-2">
                                            ⚠️ Rejected: check feedback and revise.
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-4 min-w-[200px]">
                                    {/* Progress Control */}
                                    <div className="flex flex-col w-full gap-1">
                                        <div className="flex justify-between text-xs text-gray-600">
                                            <span>Progress</span>
                                            <span className="font-medium">{task.progress}%</span>
                                        </div>
                                        {task.approvalStatus === 'PENDING' ? (
                                            <div className="w-full bg-gray-100 rounded-full h-2">
                                                <div className="bg-amber-400 h-2 rounded-full" style={{ width: `${task.progress}%` }} />
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={task.progress}
                                                    onChange={(e) => {
                                                        const val = parseInt(e.target.value);
                                                        setTasks(curr => curr.map(t => t.taskId === task.taskId ? { ...t, progress: val } : t));
                                                    }}
                                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
                                                />
                                                <button
                                                    onClick={async () => {
                                                        try {
                                                            await updateTaskProgress(task.taskId, task.progress);
                                                            alert("Progress revised!");
                                                            fetchTasks(); // Refresh to check for strict phase transitions
                                                        } catch (e) {
                                                            alert("Update failed");
                                                        }
                                                    }}
                                                    className="px-2 py-1 text-xs bg-violet-600 text-white rounded hover:bg-violet-700"
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Status Badge */}
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap
                                        ${task.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {task.status || 'PENDING'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* REQUIREMENTS MODAL */}
            <RequirementViewModal
                isOpen={isReqModalOpen}
                onClose={() => setIsReqModalOpen(false)}
                title={selectedReqTask?.taskName}
                content={selectedReqTask?.designRequirements}
            />
        </div>
    );
};

export default EmployeeDashboard;

