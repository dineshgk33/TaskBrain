import { useState, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

const STANDARD_ROLES = [
    "Frontend Developer", "Backend Developer", "Full Stack Developer",
    "Mobile Developer", "DevOps Engineer", "QA Engineer", "UI/UX Designer",
    "Product Manager", "Project Manager", "Business Analyst", "Data Scientist",
    "System Architect", "Security Engineer", "Database Administrator",
    "Cloud Architect", "Technical Lead", "Manager Assistant"
];

const UserFormModal = ({ isOpen, onClose, onSave, initialData }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [workRole, setWorkRole] = useState("");

    // Combobox State
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [filteredRoles, setFilteredRoles] = useState(STANDARD_ROLES);

    // Prefill data
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setName(initialData.name || "");
                setEmail(initialData.email || "");
                setPassword(initialData.password || "");
                setWorkRole(initialData.workRole || "");
            } else {
                setName("");
                setEmail("");
                setPassword("");
                setWorkRole("");
            }
            setFilteredRoles(STANDARD_ROLES);
        }
    }, [initialData, isOpen]);

    useEffect(() => {
        // Filter roles based on input (if it's not an exact match)
        if (workRole) {
            const lowerIds = workRole.toLowerCase();
            const filtered = STANDARD_ROLES.filter(r => r.toLowerCase().includes(lowerIds));
            setFilteredRoles(filtered);
        } else {
            setFilteredRoles(STANDARD_ROLES);
        }
    }, [workRole]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        // ... (validation remains same)
        if (!name || !email || !password || !workRole) {
            alert("All fields are required");
            return;
        }

        onSave({
            // ... (save logic)
            id: initialData?.id || Date.now(),
            name, email, password, workRole,
            systemRole: "student"
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* OVERLAY */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            {/* MODAL */}
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 transform transition-all scale-100">

                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    {initialData ? "Update User" : "Add New User"}
                </h3>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            placeholder="e.g. John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            placeholder="john@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all"
                        />
                    </div>

                    {/* CUSTOM COMBOBOX FOR ROLE */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Work Role</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Select or type a role..."
                                value={workRole}
                                onChange={(e) => {
                                    setWorkRole(e.target.value);
                                    setIsDropdownOpen(true);
                                }}
                                onFocus={() => setIsDropdownOpen(true)}
                                // Delayed blur to allow clicking options
                                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all"
                            />
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                        </div>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto custom-scrollbar">
                                {filteredRoles.length > 0 ? (
                                    filteredRoles.map((role) => (
                                        <div
                                            key={role}
                                            className="px-4 py-2.5 hover:bg-pink-50 cursor-pointer flex items-center justify-between group transition-colors"
                                            onClick={() => {
                                                setWorkRole(role);
                                                setIsDropdownOpen(false);
                                            }}
                                        >
                                            <span className="text-gray-700 group-hover:text-pink-700 font-medium">{role}</span>
                                            {workRole === role && <Check className="w-4 h-4 text-pink-600" />}
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-sm text-gray-500 italic bg-gray-50">
                                        Press enter to use "{workRole}"
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="
                                px-5 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-pink-500/30
                                bg-gradient-to-r from-pink-500 to-violet-600
                                text-white hover:from-pink-600 hover:to-violet-700 transform hover:-translate-y-0.5 transition-all
                            "
                        >
                            {initialData ? "Update User" : "Add User"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserFormModal;
