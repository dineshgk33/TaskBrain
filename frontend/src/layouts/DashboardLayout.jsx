import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import ManagerChatWidget from "../components/dashboard/ManagerChatWidget";
import EmployeeChatWidget from "../components/dashboard/EmployeeChatWidget";

const DashboardLayout = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem("role");
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* TOP BAR ROW (SIDEBAR + NAVBAR) */}
            <div className="flex">
                {/* SIDEBAR */}
                <Sidebar
                    role={role}
                    isOpen={menuOpen}
                    onClose={() => setMenuOpen(false)}
                />

                {/* NAVBAR */}
                <header className="h-16 flex-1 flex items-center justify-between px-4 md:px-6 bg-white">
                    <div className="flex items-center gap-3">
                        <button
                            className="md:hidden text-2xl"
                            onClick={() => setMenuOpen(true)}
                        >
                            ☰
                        </button>

                        <h1 className="text-lg md:text-xl font-semibold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
                            Dashboard
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="hidden sm:inline-block px-3 py-1 rounded-full text-sm bg-pink-100 text-pink-600 capitalize">
                            {role}
                        </span>

                        <button
                            onClick={() => navigate("/")}
                            className="text-gray-600 hover:text-pink-600 font-medium"
                        >
                            Home
                        </button>

                        <button
                            onClick={() => navigate("/dashboard/profile")}
                            className="text-gray-600 hover:text-pink-600 font-medium"
                        >
                            Profile
                        </button>

                        <button
                            onClick={handleLogout}
                            className="px-4 py-1.5 rounded-lg text-sm font-medium bg-gradient-to-r from-pink-500 to-violet-500 text-white"
                        >
                            Logout
                        </button>
                    </div>
                </header>
            </div>

            {/* ✅ FULL-WIDTH GRADIENT BORDER */}
            <div className="h-[2px] w-full bg-gradient-to-r from-pink-500 via-violet-500 to-indigo-500" />

            {/* MAIN CONTENT ROW */}
            <div className="flex flex-1">
                <main className="flex-1 md:ml-72 p-4 md:p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>

            {/* Persistent Manager Chatbot */}
            {role && role.toLowerCase() === "manager" && <ManagerChatWidget />}
            {role && role.toLowerCase() === "employee" && <EmployeeChatWidget />}
        </div>

    );
};

export default DashboardLayout;
