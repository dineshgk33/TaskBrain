import {
    Users,
    Code,
    Bug,
    ArrowUpRight,
    UserPlus,
} from "lucide-react";

import { useState, useEffect } from "react";
import { getAllUsers } from "../../services/userService";

const StatCard = ({ title, value, icon, accent }) => {
    // ... (StatCard component remains same)
    const Icon = icon;
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
    const [stats, setStats] = useState({
        total: 0,
        developers: 0,
        testers: 0,
        activeRoles: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const users = await getAllUsers();
                const developers = users.filter(u => u.workRole === 'developer').length;
                const testers = users.filter(u => u.workRole === 'tester').length;

                // Calculate unique active roles count
                const uniqueRoles = new Set(users.map(u => u.workRole).filter(r => r));

                setStats({
                    total: users.length,
                    developers,
                    testers,
                    activeRoles: uniqueRoles.size
                });
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            }
        };

        fetchStats();
    }, []);
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

