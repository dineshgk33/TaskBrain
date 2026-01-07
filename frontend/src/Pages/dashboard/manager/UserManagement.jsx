import { useState, useEffect } from "react";
import UserFormModal from "../../../components/dashboard/UserFormModel.jsx";
import EmployeeProfileModal from "../../../components/dashboard/EmployeeProfileModal.jsx";
import { User, Pencil, Trash2, Briefcase } from "lucide-react";
import { getAllUsers, deleteUser, createUser, updateEmployeeProfile } from "../../../services/userService";

const UserManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [selectedEmployeeForProfile, setSelectedEmployeeForProfile] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    const [users, setUsers] = useState([]);

    // ✅ LOAD USERS FROM API
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await getAllUsers();
            // Map backend fields to frontend expected format if needed
            // Backend: fullName, email, role, workRole, employeeProfile { availability }
            // Frontend expectation: name, email, workRole, status
            const formattedUsers = data
                .map(u => ({
                    id: u.userId,
                    name: u.fullName,
                    email: u.email,
                    workRole: u.workRole || "N/A",
                    status: u.employeeProfile?.availability || "N/A",
                    employeeProfile: u.employeeProfile // Keep full object for editing
                }))
                // Filter: Only show users who have a valid status (meaning they have an Employee Profile)
                .filter(u => u.status !== "N/A");

            setUsers(formattedUsers);
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };

    // ✅ FILTER LOGIC
    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole =
            roleFilter === "all" || user.workRole === roleFilter;

        return matchesSearch && matchesRole;
    });

    // ✅ DELETE USER
    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await deleteUser(userId);
                fetchUsers(); // Refresh list
            } catch (error) {
                console.error("Failed to delete user", error);
                alert("Failed to delete user");
            }
        }
    }

    // ✅ CREATE or UPDATE USER
    const handleSaveUser = async (userData) => {
        try {
            if (userData.id && filteredUsers.some(u => u.id === userData.id)) {
                // Update Logic (Future Scope if Edit Modal passes ID that matches existing)
                // For now, assuming Add User
                console.log("Update not fully implemented yet");
            } else {
                // Create Logic
                // Modal passes: name, email, password, workRole, systemRole
                const payload = {
                    fullName: userData.name,
                    email: userData.email,
                    password: userData.password,
                    workRole: userData.workRole
                };
                await createUser(payload);
                alert("User created successfully!");
                fetchUsers(); // Refresh list
            }
        } catch (error) {
            console.error("Failed to save user", error);
            alert("Failed to save user. Email might already exist.");
        }
    };

    const handleUpdateProfile = async (profileData) => {
        try {
            if (selectedEmployeeForProfile) {
                await updateEmployeeProfile(selectedEmployeeForProfile.id, profileData);
                alert("Employee profile updated successfully!");
                fetchUsers(); // Refresh
                setIsProfileModalOpen(false);
            }
        } catch (error) {
            console.error("Failed to update profile", error);
            alert("Failed to update profile.");
        }
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
                            <th className="px-4 py-3 text-left font-medium text-gray-600">
                                Status
                            </th>
                            <th className="px-4 py-3 text-right font-medium text-gray-600">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-4 py-12 text-center text-gray-500">
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
                        ${user.workRole === "developer"
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

                                    <td className="px-4 py-3">
                                        <span
                                            className={`
                                        inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize
                                        ${user.status === "FREE"
                                                    ? "bg-green-100 text-green-600"
                                                    : user.status === "BUSY"
                                                        ? "bg-red-100 text-red-600"
                                                        : "bg-gray-100 text-gray-600"
                                                }
                                      `}
                                        >
                                            {user.status || "N/A"}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3 text-right flex justify-end gap-2">
                                        <button
                                            onClick={() => {
                                                setSelectedEmployeeForProfile(user);
                                                setIsProfileModalOpen(true);
                                            }}
                                            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                                            title="Update Employee Profile"
                                        >
                                            <Briefcase className="w-4 h-4" />
                                            Update
                                        </button>
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
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700 ml-3"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete
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

            <EmployeeProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                onSave={handleUpdateProfile}
                initialData={selectedEmployeeForProfile?.employeeProfile}
            />
        </div>
    );
};

export default UserManagement;

