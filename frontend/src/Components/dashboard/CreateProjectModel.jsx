import { X } from "lucide-react";

const CreateProjectModal = ({ isOpen, onClose }) => {
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
                        Create New Project
                    </h3>

                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* FORM */}
                <div className="space-y-4">
                    {/* PROJECT NAME */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Project Name
                        </label>
                        <input
                            type="text"
                            placeholder="Enter project name"
                            className="mt-1 w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                        />
                    </div>

                    {/* DESCRIPTION */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Brief project description"
                            className="mt-1 w-full px-3 py-2 border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-pink-400"
                        />
                    </div>

                    {/* DATES */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Start Date
                            </label>
                            <input
                                type="date"
                                className="mt-1 w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Deadline
                            </label>
                            <input
                                type="date"
                                className="mt-1 w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                            />
                        </div>
                    </div>

                    {/* PRIORITY */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Priority
                        </label>
                        <select
                            className="mt-1 w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-sm font-medium border text-gray-600 hover:bg-gray-100"
                        >
                            Cancel
                        </button>

                        <button
                            className="px-4 py-2 rounded-lg text-sm font-medium
                                bg-gradient-to-r from-pink-500 to-violet-500
                                text-white hover:from-pink-600 hover:to-violet-600
                                transition-all"
                        >
                            Create Project
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateProjectModal;
