import { ClipboardList, CheckCircle, Clock } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, color }) => (
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

const StudentDashboard = () => {
    return (
        <div className="space-y-8">
            {/* HEADER */}
            <div>
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                    Student Dashboard
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    View your assigned tasks and track your progress
                </p>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard
                    title="Total Tasks"
                    value="0"
                    icon={ClipboardList}
                    color="bg-pink-500"
                />

                <StatCard
                    title="Completed"
                    value="0"
                    icon={CheckCircle}
                    color="bg-emerald-500"
                />

                <StatCard
                    title="Pending"
                    value="0"
                    icon={Clock}
                    color="bg-violet-500"
                />
            </div>

            {/* EMPTY STATE */}
            <div className="bg-white border rounded-xl p-8 text-center">
                <p className="text-gray-600">
                    No tasks assigned yet.
                </p>
                <p className="text-sm text-gray-500 mt-1">
                    Tasks assigned by your manager will appear here.
                </p>
            </div>
        </div>
    );
};

export default StudentDashboard;
