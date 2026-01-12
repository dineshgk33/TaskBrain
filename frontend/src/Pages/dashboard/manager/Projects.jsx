import { Plus } from "lucide-react";
import { useState } from "react";
import CreateProjectModal from "../../../Components/dashboard/CreateProjectModel.jsx";

const StatCard = ({ title, value }) => (
    <div className="bg-white border rounded-xl p-5">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-800 mt-1">
            {value}
        </p>
    </div>
);

const Projects = () => {
    // 🔹 MODAL STATE
    const [open, setOpen] = useState(false);

    const stats = {
        total: 0,
        active: 0,
        completed: 0,
        risk: 0,
    };

    return (
        <>
            {/* 🔹 MAIN PAGE CONTENT */}
            <div className="space-y-8">
                {/* HEADER */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                            Projects
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Manage, track, and analyze all your projects
                        </p>
                    </div>

                    {/* 🔹 OPEN MODAL BUTTON */}
                    <button
                        onClick={() => setOpen(true)}
                        className="
                            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                            bg-gradient-to-r from-pink-500 to-violet-500
                            text-white hover:from-pink-600 hover:to-violet-600
                            transition-all
                        "
                    >
                        <Plus className="w-4 h-4" />
                        Create Project
                    </button>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <StatCard title="Total Projects" value={stats.total} />
                    <StatCard title="Active Projects" value={stats.active} />
                    <StatCard title="Completed Projects" value={stats.completed} />
                    <StatCard title="At Risk" value={stats.risk} />
                </div>

                {/* EMPTY STATE */}
                <div className="bg-white border rounded-xl p-8 text-center">
                    <h3 className="text-lg font-medium text-gray-800">
                        No projects yet
                    </h3>
                    <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
                        Start by creating your first project.
                    </p>

                    <button
                        onClick={() => setOpen(true)}
                        className="
                            mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg
                            text-sm font-medium border
                            text-pink-600 border-pink-300
                            hover:bg-pink-50 transition-all
                        "
                    >
                        <Plus className="w-4 h-4" />
                        Create Your First Project
                    </button>
                </div>
            </div>

            {/* 🔹 ADD MODAL HERE (BOTTOM, OUTSIDE MAIN DIV) */}
            <CreateProjectModal
                isOpen={open}
                onClose={() => setOpen(false)}
            />
        </>
    );
};

export default Projects;
