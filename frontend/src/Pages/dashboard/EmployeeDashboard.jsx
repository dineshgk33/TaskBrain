import { ClipboardList, CheckCircle, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { getTasksByUser } from "../../services/taskService";

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
                            <div key={task.taskId} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium text-gray-800">{task.taskName}</h4>
                                    <p className="text-sm text-gray-500 line-clamp-1">{task.description}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium 
                                    ${task.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {task.status || 'PENDING'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeDashboard;

