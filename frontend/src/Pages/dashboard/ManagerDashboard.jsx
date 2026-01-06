import {
    Users,
    Code,
    Bug,
    ArrowUpRight,
    UserPlus,
} from "lucide-react";

const StatCard = ({ title, value, icon: Icon, accent }) => {
    return (
        <div className="bg-white rounded-xl border p-5 flex items-center justify-between hover:shadow-md transition-all">
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-2xl font-semibold text-gray-800 mt-1">
                    {value}
                </p>
            </div>

            <div
                className={`p-3 rounded-lg ${accent} bg-opacity-15`}
            >
                <Icon className={`w-6 h-6 ${accent.replace("bg", "text")}`} />
            </div>
        </div>
    );
};

const ManagerDashboard = () => {
    return (
        <div className="space-y-8">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                        Manager Overview
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Monitor your team and manage roles efficiently
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
                    <UserPlus className="w-4 h-4" />
                    Add Member
                </button>
            </div>

            {/* STATS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Members"
                    value="3"
                    icon={Users}
                    accent="bg-pink-500"
                />

                <StatCard
                    title="Developers"
                    value="2"
                    icon={Code}
                    accent="bg-indigo-500"
                />

                <StatCard
                    title="Testers"
                    value="1"
                    icon={Bug}
                    accent="bg-violet-500"
                />

                <StatCard
                    title="Active Roles"
                    value="3"
                    icon={ArrowUpRight}
                    accent="bg-emerald-500"
                />
            </div>

            {/* INFO / GUIDANCE CARD */}
            <div className="bg-white rounded-xl border p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h3 className="text-lg font-medium text-gray-800">
                        Team Management
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 max-w-xl">
                        Use the User Management section to add new members, assign work
                        roles like developer or tester, and manage your team efficiently.
                    </p>
                </div>

                <a
                    href="/dashboard/manager/users"
                    className="inline-flex items-center gap-2 text-sm font-medium text-pink-600 hover:text-pink-700"
                >
                    Go to User Management
                    <ArrowUpRight className="w-4 h-4" />
                </a>
            </div>
        </div>
    );
};

export default ManagerDashboard;
