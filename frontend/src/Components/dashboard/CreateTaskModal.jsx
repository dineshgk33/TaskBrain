import { X, Info } from "lucide-react";
import { useState } from "react";

const CreateTaskModal = ({ isOpen, onClose }) => {
    const [autoAssign, setAutoAssign] = useState(true);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* OVERLAY */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
            />

            {/* MODAL */}
            <div className="relative w-full max-w-lg bg-white rounded-xl shadow-lg p-6">
                {/* HEADER */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Create Task
                    </h3>
                    <button onClick={onClose}>
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="space-y-4">
                    {/* TASK NAME */}
                    <input
                        placeholder="Task title"
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                    />

                    {/* PROJECT */}
                    <select className="w-full px-3 py-2 border rounded-lg text-sm">
                        <option>Select Project</option>
                    </select>

                    {/* AUTO ASSIGN TOGGLE */}
                    <div className="bg-gray-50 border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">
                                    Auto-assign task (AI)
                                </span>
                                <Info className="w-4 h-4 text-gray-400" />
                            </div>

                            <button
                                onClick={() => setAutoAssign(!autoAssign)}
                                className={`w-10 h-5 rounded-full transition-all ${
                                    autoAssign ? "bg-pink-500" : "bg-gray-300"
                                }`}
                            >
                                <div
                                    className={`w-4 h-4 bg-white rounded-full shadow transform transition ${
                                        autoAssign ? "translate-x-5" : "translate-x-1"
                                    }`}
                                />
                            </button>
                        </div>

                        <p className="text-xs text-gray-500 mt-2">
                            {autoAssign
                                ? "TaskBrain will assign the best available member based on workload, skills, and deadlines."
                                : "You can manually select a team member for this task."}
                        </p>
                    </div>

                    {/* MANUAL ASSIGNEE */}
                    {!autoAssign && (
                        <select className="w-full px-3 py-2 border rounded-lg text-sm">
                            <option>Select Assignee</option>
                        </select>
                    )}

                    {/* DEADLINE */}
                    <input
                        type="date"
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                    />

                    {/* ACTIONS */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border rounded-lg text-sm"
                        >
                            Cancel
                        </button>

                        <button
                            className="px-4 py-2 rounded-lg text-sm text-white
                            bg-gradient-to-r from-pink-500 to-violet-500"
                        >
                            Create Task
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateTaskModal;
