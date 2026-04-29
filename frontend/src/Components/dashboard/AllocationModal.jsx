import { useState, useEffect } from "react";
import { X, User, Check, Sparkles, Users, UserPlus, Loader2 } from "lucide-react";
import { getAllUsers } from "../../services/userService";
import AILoadingOverlay from "../common/AILoadingOverlay";

export const AllocationModal = ({ isOpen, onClose, onAllocate, project, isAllocating }) => {
    const [mode, setMode] = useState("AUTO"); // AUTO, MANUAL, HYBRID
    const [candidates, setCandidates] = useState([]);
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [autoCount, setAutoCount] = useState(1);
    const [loading, setLoading] = useState(false);
    const [suggestedCount, setSuggestedCount] = useState(1);

    const calculateSuggestedCount = (proj) => {
        if (!proj) return 1;
        
        // 1. Calculate Complexity Score (Tech Stack Layers)
        let techLayers = 1;
        if (proj.frontendTech) techLayers += 1;
        if (proj.backendTech) techLayers += 1;
        if (proj.databaseTech) techLayers += 1;
        if (proj.aiMlTech) techLayers += 1;
        
        // 2. Base count calculation
        if (!proj.deadline) return Math.min(6, techLayers);
        
        const targetDate = new Date(proj.deadline);
        const today = new Date();
        const diffTime = targetDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let urgencyMultiplier = 1;
        if (diffDays <= 7) urgencyMultiplier = 2;
        else if (diffDays <= 14) urgencyMultiplier = 1.5;
        else if (diffDays <= 30) urgencyMultiplier = 1.2;

        // 3. Final Suggested Count
        const suggested = Math.ceil(techLayers * urgencyMultiplier);
        return Math.min(10, suggested); // Cap at 10
    };

    useEffect(() => {
        if (isOpen) {
            const suggested = calculateSuggestedCount(project);
            setSuggestedCount(suggested);
            setAutoCount(suggested);

            const loadUsers = async () => {
                setLoading(true);
                try {
                    const users = await getAllUsers();
                    // Filter for Employees and Project Managers
                    const eligible = users.filter(u => u.role === "EMPLOYEE" || u.role === "PROJECT_MANAGER");
                    setCandidates(eligible);
                } catch (e) {
                    console.error("Failed to load users", e);
                } finally {
                    setLoading(false);
                }
            };
            loadUsers();
            setSelectedUserIds([]);
            setMode("AUTO");
        }
    }, [isOpen, project]);

    const toggleUser = (userId) => {
        setSelectedUserIds(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSubmit = () => {
        onAllocate({
            type: mode,
            autoCount: mode === "MANUAL" ? 0 : parseInt(autoCount),
            manualUserIds: mode === "AUTO" ? [] : selectedUserIds
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col relative overflow-hidden">

                {isAllocating && <AILoadingOverlay message="Analyzing project requirements..." />}

                {/* Header */}
                <div className="p-6 border-b flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Allocate Task for {project?.projectName}</h2>
                        <p className="text-sm text-gray-500 mt-1">Choose how assignments should be distributed</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="p-4 bg-gray-50 grid grid-cols-3 gap-2">
                    {[
                        { id: 'AUTO', label: 'AI Auto', icon: Sparkles },
                        { id: 'MANUAL', label: 'Manual', icon: Users },
                        { id: 'HYBRID', label: 'Hybrid', icon: UserPlus }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setMode(tab.id)}
                            className={`flex items-center justify-center gap-2 p-3 rounded-lg text-sm font-medium transition-all
                                ${mode === tab.id
                                    ? 'bg-white shadow text-violet-600 ring-1 ring-violet-200'
                                    : 'text-gray-600 hover:bg-gray-200'}`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-6 flex-1 overflow-y-auto">

                    {/* AUTO Instructions */}
                    {mode === 'AUTO' && (
                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 text-blue-700 rounded-lg text-sm">
                                AI will analyze the project requirements and automatically select the best employees from the entire pool, creating tailored tasks for them.
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Number of Employees to Assign
                                    </label>
                                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 text-[10px] font-bold border border-violet-200 animate-pulse" title="Based on Project Scale & Deadline">
                                        <Sparkles className="w-3 h-3" />
                                        SCALE & DEADLINE: {suggestedCount}
                                    </span>
                                </div>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={autoCount}
                                    onChange={e => setAutoCount(e.target.value)}
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-violet-500 outline-none transition-all hover:border-violet-300"
                                />
                            </div>
                        </div>
                    )}

                    {/* MANUAL & HYBRID User Selection */}
                    {(mode === 'MANUAL' || mode === 'HYBRID') && (
                        <div className="space-y-4">
                            {mode === 'HYBRID' && (
                                <div className="p-4 bg-purple-50 text-purple-700 rounded-lg text-sm mb-4">
                                    Select specific core members first. AI will assign tasks to them, and then pick additional members if requested.
                                </div>
                            )}

                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-medium text-gray-700">Select Team Members</label>
                                <span className="text-xs text-gray-500">{selectedUserIds.length} selected</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto border rounded-xl p-2">
                                {loading ? <div className="p-4 text-center text-gray-500 col-span-2">Loading users...</div> : candidates.map(user => (
                                    <div
                                        key={user.userId}
                                        onClick={() => toggleUser(user.userId)}
                                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-all
                                            ${selectedUserIds.includes(user.userId)
                                                ? 'bg-violet-50 border-violet-200 ring-1 ring-violet-200'
                                                : 'hover:bg-gray-50 border-gray-100'}`}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white
                                            ${selectedUserIds.includes(user.userId) ? 'bg-violet-600' : 'bg-gray-400'}`}>
                                            {user.fullName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className={`text-sm font-medium ${selectedUserIds.includes(user.userId) ? 'text-violet-900' : 'text-gray-700'}`}>
                                                {user.fullName}
                                            </p>
                                            <p className="text-xs text-gray-500">{user.role}</p>
                                        </div>
                                        {selectedUserIds.includes(user.userId) && (
                                            <Check className="w-4 h-4 text-violet-600 ml-auto" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* HYBRID Additional Count */}
                    {mode === 'HYBRID' && (
                        <div className="mt-6 border-t pt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                + Add Additional AI-Selected Members
                            </label>
                            <input
                                type="number"
                                min="0" // Allow 0 if they just want manual + AI task generation
                                max="10"
                                value={autoCount}
                                onChange={e => setAutoCount(e.target.value)}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-violet-500 outline-none"
                            />
                            <p className="text-xs text-gray-500 mt-1">Leave as 0 to only assignments for selected users.</p>
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="p-6 border-t bg-gray-50 flex justify-end gap-3 rounded-b-xl">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={(mode !== 'AUTO' && selectedUserIds.length === 0) || isAllocating}
                        className="px-6 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-200 flex items-center gap-2"
                    >
                        {isAllocating && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isAllocating ? "Allocating..." : "Confirm Allocation"}
                    </button>
                </div>

            </div>
        </div>
    );
};
