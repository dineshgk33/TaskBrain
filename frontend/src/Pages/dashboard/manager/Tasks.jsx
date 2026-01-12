import { Plus, AlertTriangle } from "lucide-react";

const StatCard = ({ title, value }) => (
    <div className="bg-white border rounded-xl p-5">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-800 mt-1">
            {value}
        </p>
    </div>
);

const StatusBadge = ({ status }) => {
    const styles = {
        todo: "bg-gray-100 text-gray-600",
        progress: "bg-blue-100 text-blue-600",
        completed: "bg-green-100 text-green-600",
        overdue: "bg-red-100 text-red-600",
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
            {status}
        </span>
    );
};

const Tasks = () => {
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

                <button
                    className="
                        flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                        bg-gradient-to-r from-pink-500 to-violet-500
                        text-white hover:from-pink-600 hover:to-violet-600
                        transition-all
                    "
                >
                    <Plus className="w-4 h-4" />
                    Create Task
                </button>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard title="Total Tasks" value={0} />
                <StatCard title="In Progress" value={0} />
                <StatCard title="Completed" value={0} />
                <StatCard title="Overdue" value={0} />
            </div>

            {/* FILTERS */}
            <div className="bg-white border rounded-xl p-4 flex flex-col md:flex-row gap-4">
                <select className="border rounded-lg px-3 py-2 text-sm">
                    <option>All Projects</option>
                </select>

                <select className="border rounded-lg px-3 py-2 text-sm">
                    <option>All Assignees</option>
                </select>

                <select className="border rounded-lg px-3 py-2 text-sm">
                    <option>All Status</option>
                </select>
            </div>

            {/* TASK LIST */}
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
                    <tr className="border-t">
                        <td className="px-4 py-3 font-medium text-gray-800">
                            UI Design Review
                        </td>
                        <td className="px-4 py-3">Website Revamp</td>
                        <td className="px-4 py-3">Alex</td>
                        <td className="px-4 py-3">
                            <StatusBadge status="progress" />
                        </td>
                        <td className="px-4 py-3 flex items-center gap-1 text-yellow-600">
                            <AlertTriangle className="w-4 h-4" />
                            2 days left
                        </td>
                        <td className="px-4 py-3">
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full w-[60%]" />
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Tasks;
