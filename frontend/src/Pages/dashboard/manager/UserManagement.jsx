import { useState, useEffect } from "react";
import UserFormModal from "../../../Components/dashboard/UserFormModel.jsx";
import { User, Pencil } from "lucide-react";

const UserManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    // ✅ LOAD USERS FROM localStorage
    const [users, setUsers] = useState(() => {
        const saved = localStorage.getItem("users");
        return saved ? JSON.parse(saved) : [];
    });

    // ✅ SAVE USERS TO localStorage
    useEffect(() => {
        localStorage.setItem("users", JSON.stringify(users));
    }, [users]);

    // ✅ FILTER LOGIC
    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole =
            roleFilter === "all" || user.workRole === roleFilter;

        return matchesSearch && matchesRole;
    });

    // ✅ CREATE or UPDATE USER
    const handleSaveUser = (user) => {
        setUsers((prev) => {
            const exists = prev.find((u) => u.id === user.id);
            return exists
                ? prev.map((u) => (u.id === user.id ? user : u))
                : [...prev, user];
        });
    };

    return (
        <div className="space-y-6">
            {/* PAGE HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                        User Management
                    </h2>
                    <p className="text-sm text-gray-500">
                        Manage your team members and their roles
                    </p>
                </div>

                <button
                    onClick={() => {
                        setEditingUser(null);
                        setIsModalOpen(true);
                    }}
                    className="
            px-4 py-2 rounded-lg text-sm font-medium
            bg-gradient-to-r from-pink-500 to-violet-500
            text-white hover:from-pink-600 hover:to-violet-600
            transition-all
          "
                >
                    + Add User
                </button>
            </div>

            {/* SUMMARY */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white border rounded-xl p-4">
                    <p className="text-sm text-gray-500">Total Users</p>
                    <p className="text-xl font-semibold text-gray-800">
                        {users.length}
                    </p>
                </div>

                <div className="bg-white border rounded-xl p-4">
                    <p className="text-sm text-gray-500">Developers</p>
                    <p className="text-xl font-semibold text-gray-800">
                        {users.filter(u => u.workRole === "developer").length}
                    </p>
                </div>

                <div className="bg-white border rounded-xl p-4">
                    <p className="text-sm text-gray-500">Testers</p>
                    <p className="text-xl font-semibold text-gray-800">
                        {users.filter(u => u.workRole === "tester").length}
                    </p>
                </div>

                <div className="bg-white border rounded-xl p-4">
                    <p className="text-sm text-gray-500">Other Roles</p>
                    <p className="text-xl font-semibold text-gray-800">
                        {users.filter(
                            u => !["developer", "tester"].includes(u.workRole)
                        ).length}
                    </p>
                </div>
            </div>

            {/* SEARCH & FILTER */}
            <div className="flex flex-col md:flex-row gap-3">
                <input
                    type="text"
                    placeholder="Search by name or email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-1/2 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500"
                />

                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full md:w-48 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500"
                >
                    <option value="all">All Roles</option>
                    <option value="developer">Developer</option>
                    <option value="tester">Tester</option>
                    <option value="designer">Designer</option>
                    <option value="manager-assistant">Manager Assistant</option>
                </select>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-xl border overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                    <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-600">
                            Name
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-600">
                            Email
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-600">
                            Work Role
                        </th>
                        <th className="px-4 py-3 text-right font-medium text-gray-600">
                            Actions
                        </th>
                    </tr>
                    </thead>

                    <tbody>
                    {filteredUsers.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="px-4 py-12 text-center text-gray-500">
                                No matching users found
                            </td>
                        </tr>
                    ) : (
                        filteredUsers.map((user) => (
                            <tr
                                key={user.id}
                                className="border-t hover:bg-gray-50 transition-all"
                            >
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center">
                                            <User className="w-4 h-4 text-pink-600" />
                                        </div>
                                        <span className="font-medium text-gray-800">
                        {user.name}
                      </span>
                                    </div>
                                </td>

                                <td className="px-4 py-3 text-gray-600">
                                    {user.email}
                                </td>

                                <td className="px-4 py-3">
                    <span
                        className={`
                        inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize
                        ${
                            user.workRole === "developer"
                                ? "bg-indigo-100 text-indigo-600"
                                : user.workRole === "tester"
                                    ? "bg-violet-100 text-violet-600"
                                    : "bg-gray-100 text-gray-600"
                        }
                      `}
                    >
                      {user.workRole}
                    </span>
                                </td>

                                <td className="px-4 py-3 text-right">
                                    <button
                                        onClick={() => {
                                            setEditingUser(user);
                                            setIsModalOpen(true);
                                        }}
                                        className="inline-flex items-center gap-1 text-sm text-pink-600 hover:text-pink-700"
                                    >
                                        <Pencil className="w-4 h-4" />
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* MODAL */}
            <UserFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveUser}
                initialData={editingUser}
            />
        </div>
    );
};

export default UserManagement;
