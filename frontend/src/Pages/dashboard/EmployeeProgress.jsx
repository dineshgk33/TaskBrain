import { useState, useEffect } from "react";
import { CheckCircle, Clock, AlertCircle, TrendingUp, Calendar } from "lucide-react";
import { getAllTasks } from "../../services/taskService";

const EmployeeProgress = () => {
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        pending: 0,
        overdue: 0,
        completionRate: 0
    });
    const [recentTasks, setRecentTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const userId = localStorage.getItem("userId");

    useEffect(() => {
        fetchProgress();
    }, []);

    const fetchProgress = async () => {
        try {
            const allTasks = await getAllTasks();
            // Filter tasks for this user (assuming backend returns all, need to filter client side or use specific endpoint if available)
            // Ideally backend should have /tasks/user/{id}. taskService has getTasksByUser.

            // Let's use getTasksByUser logic if possible, but getAllTasks was imported. 
            // Checking taskService... it has getTasksByUser(userId).

            // Wait, I should import getTasksByUser instead.
            // But for now let's stick to the logic I can see or just use what I have.
            // I'll re-import getTasksByUser in a moment if needed, but let's assume filtering here for safety.

            const myTasks = allTasks.filter(t =>
                t.assignedEmployees && t.assignedEmployees.some(e => e.id.toString() === userId)
            );

            const total = myTasks.length;
            const completed = myTasks.filter(t => t.status === "COMPLETED").length;
            const pending = myTasks.filter(t => t.status === "PENDING" || t.status === "IN_PROGRESS").length;
            const overdue = myTasks.filter(t => new Date(t.deadline) < new Date() && t.status !== "COMPLETED").length;

            setStats({
                total,
                completed,
                pending,
                overdue,
                completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
            });

            setRecentTasks(myTasks.slice(0, 5)); // Just take first 5
        } catch (error) {
            console.error("Failed to fetch progress", error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ label, value, icon: Icon, color, subtext }) => (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:scale-[1.02]">
            <div className={`p-4 rounded-full ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
                <Icon className={`w-6 h-6 text-${color.split('-')[1]}-600`} />
            </div>
            <div>
                <p className="text-gray-500 text-sm font-medium">{label}</p>
                <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
                {subtext && <p className="text-xs text-gray-400 mt-0.5">{subtext}</p>}
            </div>
        </div>
    );

    if (loading) return <div className="p-10 text-center text-gray-500">Loading progress...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <TrendingUp className="w-8 h-8 text-pink-500" />
                    My Progress
                </h2>
                <p className="text-gray-500 mt-1">Track your performance and task completion.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Completion Rate"
                    value={`${stats.completionRate}%`}
                    icon={TrendingUp}
                    color="bg-green-500"
                    subtext="Keep it up!"
                />
                <StatCard
                    label="Completed Tasks"
                    value={stats.completed}
                    icon={CheckCircle}
                    color="bg-blue-500"
                />
                <StatCard
                    label="Pending Tasks"
                    value={stats.pending}
                    icon={Clock}
                    color="bg-yellow-500"
                />
                <StatCard
                    label="Overdue"
                    value={stats.overdue}
                    icon={AlertCircle}
                    color="bg-red-500"
                    subtext="Action needed"
                />
            </div>

            {/* Progress Bar */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Overall Completion</h3>
                    <span className="text-2xl font-bold text-pink-600">{stats.completionRate}%</span>
                </div>
                <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-pink-500 to-violet-500 transition-all duration-1000 ease-out"
                        style={{ width: `${stats.completionRate}%` }}
                    />
                </div>
                <p className="text-center text-gray-500 text-sm mt-4">
                    You have completed {stats.completed} out of {stats.total} assigned tasks.
                </p>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    Recent Tasks
                </h3>
                <div className="space-y-4">
                    {recentTasks.length > 0 ? (
                        recentTasks.map((task) => (
                            <div key={task.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-12 rounded-full ${task.status === 'COMPLETED' ? 'bg-green-500' :
                                            task.status === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-gray-300'
                                        }`} />
                                    <div>
                                        <h4 className="font-medium text-gray-800">{task.taskName}</h4>
                                        <p className="text-sm text-gray-500">{task.projectName || "Project Task"}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${task.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                        task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    {task.status}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-8">No recent tasks found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmployeeProgress;
