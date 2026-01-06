import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../Components/dashboard/Sidebar";


const DashboardLayout = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem("role");
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/auth");
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">

            {/* SIDEBAR */}
            <Sidebar
                role={role}
                isOpen={menuOpen}
                onClose={() => setMenuOpen(false)}
            />

            {/* MAIN AREA */}
            <div className="flex-1 min-w-0">
                {/* DASHBOARD NAVBAR */}
                <header className="h-16 flex items-center justify-between px-4 md:px-6 bg-white border-b">
                    <div className="flex items-center gap-3">
                        <button
                            className="md:hidden text-2xl"
                            onClick={() => setMenuOpen(true)}
                        >
                            ☰
                        </button>

                        <h1
                            className="
                text-lg md:text-xl font-semibold
                bg-gradient-to-r from-pink-500 to-violet-500
                bg-clip-text text-transparent
              "
                        >
                            Dashboard
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block px-3 py-1 rounded-full text-sm
              bg-pink-100 text-pink-600 capitalize">
              {role}
            </span>

                        <button
                            onClick={handleLogout}
                            className="px-4 py-1.5 rounded-lg text-sm font-medium
                bg-gradient-to-r from-pink-500 to-violet-500
                text-white hover:from-pink-600 hover:to-violet-600
                transition-all"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                {/* PAGE CONTENT */}
                <main className="p-4 md:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};


export default DashboardLayout;
