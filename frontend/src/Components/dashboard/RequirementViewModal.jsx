import React from 'react';
import { X, FileText } from 'lucide-react';

const RequirementViewModal = ({ isOpen, onClose, title, content }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b flex items-center justify-between bg-gradient-to-r from-violet-50 to-indigo-50">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-white rounded-lg shadow-sm text-violet-600">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">Design Requirements</h3>
                            <p className="text-sm text-gray-500 line-clamp-1">Task: {title}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white rounded-full transition-colors text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {content || <span className="text-gray-400 italic">No detailed requirements provided.</span>}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 rounded-lg text-sm font-medium bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors shadow-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RequirementViewModal;
