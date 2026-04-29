import { NavLink } from "react-router-dom";

const Sidebar = ({ role, isOpen, onClose }) => {
    const managerLinks = [
        { label: "Overview", path: "/dashboard/manager" },
        { label: "Projects", path: "/dashboard/manager/projects" },
        { label: "Tasks", path: "/dashboard/manager/tasks" },
        { label: "User Management", path: "/dashboard/manager/users" },
        { label: "Reports & Analytics", path: "/dashboard/manager/analytics" },
        { label: "AI Insights", path: "/dashboard/manager/ai-insights" },
        { label: "Settings", path: "/dashboard/manager/settings" },
    ];

    const workRole = (localStorage.getItem("workRole") || "").toUpperCase();

    const employeeLinks = [
        { label: "My Tasks", path: "/dashboard/employee" },
        { label: "My Projects", path: "/dashboard/employee/projects" },
        { label: "Progress", path: "/dashboard/employee/progress" },
        ...(workRole === "DESIGNER" ? [{ label: "AI Design Agent", path: "/dashboard/employee/ai" }] : []),
        { label: "Profile", path: "/dashboard/employee/profile" },
    ];

    const studentLinks = [
        { label: "My Projects", path: "/dashboard/student/projects" },
        { label: "My Tasks", path: "/dashboard/student/tasks" },
        { label: "Progress", path: "/dashboard/student/progress" },
        { label: "AI Guidance", path: "/dashboard/student/ai" },
    ];

    let links = [];
    if (role === "manager") links = managerLinks;
    else if (role === "employee") links = employeeLinks;
    else links = studentLinks;

    return (
        <>
            {/* MOBILE OVERLAY */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* SIDEBAR */}
            <aside
                className={`
                    fixed top-0 left-0 z-50
                    h-screen w-72 bg-white
                    transform transition-transform duration-300
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    md:translate-x-0
                    flex
                `}
            >
                {/* CONTENT */}
                <div className="flex-1 flex flex-col">
                    {/* HEADER */}
                    <div className="h-16 flex items-center px-6 shrink-0">
                        <span
                            className="
                                text-lg font-semibold
                                bg-gradient-to-r from-pink-500 to-violet-500
                                bg-clip-text text-transparent
                            "
                        >
                            {role === "manager"
                                ? "Manager Panel"
                                : role === "employee"
                                    ? "Employee Panel"
                                    : "Student Panel"}
                        </span>
                    </div>

                    {/* NAV LINKS */}
                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        {links.map((link) => (
                            <NavLink
                                key={link.label}
                                to={link.path}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `block px-4 py-2 rounded-lg text-sm font-medium transition-all
                                    ${isActive
                                        ? "bg-pink-100 text-pink-600"
                                        : "text-gray-700 hover:bg-gray-100"
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* GRADIENT BORDER */}
                <div className="w-[3px] bg-gradient-to-b from-pink-500 via-violet-500 to-indigo-500" />
            </aside>
        </>
    );
};

export default Sidebar;
