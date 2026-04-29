import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

const DesignRequirementModal = ({ isOpen, onClose, task, onSave }) => {
    const [requirements, setRequirements] = useState(task?.designRequirements || "");
    const [saving, setSaving] = useState(false);

    // Update local state when task changes
    React.useEffect(() => {
        if (task) {
            setRequirements(task.designRequirements || "");
        }
    }, [task]);

    if (!isOpen || !task) return null;

    const handleSave = async () => {
        setSaving(true);
        try {
            await onSave(task.taskId, requirements);
            onClose();
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b flex items-center justify-between bg-gradient-to-r from-violet-50 to-indigo-50">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">Design Requirements</h3>
                        <p className="text-sm text-gray-500">For: {task.taskName}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-gray-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-sm text-gray-600 mb-2">
                        Send specific design requirements to the designer. They will see this in their task details.
                    </p>
                    <textarea
                        value={requirements}
                        onChange={(e) => setRequirements(e.target.value)}
                        placeholder="e.g. Use glassmorphism style, follow brand guidelines for colors..."
                        className="w-full h-32 px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-50 outline-none resize-none transition-all text-sm"
                    />
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                        disabled={saving}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-violet-600 text-white hover:bg-violet-700 transition-colors flex items-center gap-2 shadow-lg shadow-violet-200"
                        disabled={saving}
                    >
                        <Send className="w-4 h-4" />
                        {saving ? "Sending..." : "Send Requirements"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DesignRequirementModal;
