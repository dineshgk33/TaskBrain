import { NavLink } from "react-router-dom";

const Sidebar = ({ role, isOpen, onClose }) => {
    const managerLinks = [
        { label: "Overview", path: "/dashboard/manager" },
        { label: "User Management", path: "/dashboard/manager/users" },
    ];

    const studentLinks = [
        { label: "My Tasks", path: "/dashboard/student" },
        { label: "Progress", path: "/dashboard/student/progress" },
    ];

    const links = role === "manager" ? managerLinks : studentLinks;

    return (
        <>
            {/* OVERLAY (MOBILE) */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* SIDEBAR */}
            <aside
                className={`
          fixed md:static top-0 left-0 z-50
          h-full w-64 bg-white border-r
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
            >
                {/* HEADER */}
                <div className="h-16 flex items-center px-6 border-b">
          <span
              className="
              text-lg font-semibold
              bg-gradient-to-r from-pink-500 to-violet-500
              bg-clip-text text-transparent
            "
          >
            {role === "manager" ? "Manager Panel" : "Student Panel"}
          </span>
                </div>

                {/* LINKS */}
                <nav className="p-4 space-y-2">
                    {links.map((link) => (
                        <NavLink
                            key={link.label}
                            to={link.path}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `block px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${
                                    isActive
                                        ? "bg-pink-100 text-pink-600"
                                        : "text-gray-700 hover:bg-gray-100"
                                }`
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
