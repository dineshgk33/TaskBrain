import { useState, useEffect } from "react";
import { getAllProjects } from "../../../services/projectService";
import { getAllTasks } from "../../../services/taskService";
import { getAllUsers } from "../../../services/userService";
import { TrendingUp, Users, CheckCircle, Clock, AlertTriangle, PieChart, Activity, Briefcase } from "lucide-react";

const Analytics = () => {
    const [stats, setStats] = useState({
        totalProjects: 0,
        totalTasks: 0,
        completedTasks: 0,
        avgProgress: 0,
        overdue: 0,
        activeDevelopers: 0
    });
    const [projectHealth, setProjectHealth] = useState([]);
    const [taskDistribution, setTaskDistribution] = useState({ todo: 0, inProgress: 0, done: 0, review: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [projects, tasks, users] = await Promise.all([
                    getAllProjects(),
                    getAllTasks(),
                    getAllUsers()
                ]);

                // Basic Stats
                const completed = tasks.filter(t => t.status === 'COMPLETED').length;
                const overdue = tasks.filter(t => new Date(t.deadline) < new Date() && t.status !== 'COMPLETED').length;
                const avgProg = projects.length > 0
                    ? projects.reduce((acc, p) => acc + (p.completionPercentage || 0), 0) / projects.length
                    : 0;

                setStats({
                    totalProjects: projects.length,
                    totalTasks: tasks.length,
                    completedTasks: completed,
                    avgProgress: Math.round(avgProg),
                    overdue: overdue,
                    activeDevelopers: users.filter(u => u.role === 'EMPLOYEE').length
                });

                // Task Distribution
                const dist = { todo: 0, inProgress: 0, done: 0, review: 0 };
                tasks.forEach(t => {
                    const s = t.status.toUpperCase();
                    if (s.includes('TODO') || s.includes('PENDING')) dist.todo++;
                    else if (s.includes('PROGRESS')) dist.inProgress++;
                    else if (s.includes('COMPLETED') || s.includes('DONE')) dist.done++;
                    else dist.review++;
                });
                setTaskDistribution(dist);

                // Project Health (Top 5 Active)
                const health = projects.slice(0, 5).map(p => {
                    const pTasks = tasks.filter(t => t.project?.projectId === p.projectId);
                    const pCompleted = pTasks.filter(t => t.status === 'COMPLETED').length;
                    const pTotal = pTasks.length;
                    const calcProgress = pTotal > 0 ? Math.round((pCompleted / pTotal) * 100) : 0;

                    return {
                        id: p.projectId,
                        name: p.projectName,
                        status: calcProgress === 100 ? 'Completed' : 'Active',
                        progress: calcProgress,
                        taskCount: pTotal
                    };
                });
                setProjectHealth(health);

            } catch (error) {
                console.error("Failed to load analytics", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition-shadow">
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
                {subtext && <p className={`text-xs mt-2 font-medium ${subtext.includes('+') ? 'text-green-600' : 'text-gray-400'}`}>{subtext}</p>}
            </div>
            <div className={`p-3 rounded-xl ${color}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
        </div>
    );

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Analytics Overview</h2>
                <p className="text-gray-500">Real-time insights into team performance and project health</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Projects"
                    value={stats.totalProjects}
                    icon={Briefcase}
                    color="bg-blue-500"
                    subtext={`${stats.activeDevelopers} Active Members`}
                />
                <StatCard
                    title="Avg. Completion"
                    value={`${stats.avgProgress}%`}
                    icon={TrendingUp}
                    color="bg-violet-500"
                    subtext="Across all projects"
                />
                <StatCard
                    title="Tasks Completed"
                    value={stats.completedTasks}
                    icon={CheckCircle}
                    color="bg-green-500"
                    subtext={`${stats.totalTasks} Total Tasks`}
                />
                <StatCard
                    title="Overdue Items"
                    value={stats.overdue}
                    icon={AlertTriangle}
                    color="bg-red-500"
                    subtext="Requires attention"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Task Distribution Chart (CSS Only) */}
                <div className="col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <PieChart className="w-5 h-5 text-gray-400" />
                            Task Distribution
                        </h3>
                    </div>

                    <div className="space-y-6">
                        {/* Custom Bar Chart Rows */}
                        {[
                            { label: 'Todo', val: taskDistribution.todo, color: 'bg-gray-400', text: 'text-gray-600' },
                            { label: 'In Progress', val: taskDistribution.inProgress, color: 'bg-blue-500', text: 'text-blue-600' },
                            { label: 'Review', val: taskDistribution.review, color: 'bg-yellow-500', text: 'text-yellow-600' },
                            { label: 'Completed', val: taskDistribution.done, color: 'bg-green-500', text: 'text-green-600' }
                        ].map(item => {
                            const percentage = stats.totalTasks > 0 ? (item.val / stats.totalTasks) * 100 : 0;
                            return (
                                <div key={item.label}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-gray-600">{item.label}</span>
                                        <span className={`font-bold ${item.text}`}>{item.val}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${item.color} transition-all duration-1000 ease-out`}
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Project Health Table */}
                <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-gray-400" />
                            Active Project Health
                        </h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">
                                    <th className="pb-3 pl-2">Project Name</th>
                                    <th className="pb-3 text-center">Status</th>
                                    <th className="pb-3 text-center">Tasks</th>
                                    <th className="pb-3">Progress</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {projectHealth.length > 0 ? projectHealth.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 pl-2 font-medium text-gray-800">{p.name}</td>
                                        <td className="py-4 text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-center text-gray-600 text-sm">{p.taskCount}</td>
                                        <td className="py-4 w-1/3 pr-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 bg-gray-100 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full ${p.progress === 100 ? 'bg-green-500' :
                                                                p.progress > 50 ? 'bg-violet-500' : 'bg-pink-500'
                                                            }`}
                                                        style={{ width: `${p.progress}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs font-medium text-gray-600 w-8">{p.progress}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-8 text-gray-400 italic">No active projects found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
