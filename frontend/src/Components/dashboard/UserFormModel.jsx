import { useState, useEffect } from "react";

const UserFormModal = ({ isOpen, onClose, onSave, initialData }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [workRole, setWorkRole] = useState("");

    // Prefill data for UPDATE later
    useEffect(() => {
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
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name || !email || !password || !workRole) {
            alert("All fields are required");
            return;
        }

        onSave({
            id: initialData?.id || Date.now(),
            name,
            email,
            password,
            workRole,
            systemRole: "student",
        });

        onClose();
    };

    return (
        <>
            {/* OVERLAY */}
            <div
                className="fixed inset-0 bg-black/40 z-50"
                onClick={onClose}
            />

            {/* MODAL */}
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">

                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        {initialData ? "Update User" : "Add User"}
                    </h3>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500"
                        />

                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500"
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500"
                        />

                        <select
                            value={workRole}
                            onChange={(e) => setWorkRole(e.target.value)}
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500"
                        >
                            <option value="">Select work role</option>
                            <option value="developer">Developer</option>
                            <option value="tester">Tester</option>
                            <option value="designer">Designer</option>
                            <option value="manager-assistant">Manager Assistant</option>
                        </select>

                        {/* ACTIONS */}
                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="
                  px-4 py-2 rounded-lg text-sm font-medium
                  bg-gradient-to-r from-pink-500 to-violet-500
                  text-white hover:from-pink-600 hover:to-violet-600
                "
                            >
                                {initialData ? "Update" : "Add"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default UserFormModal;
