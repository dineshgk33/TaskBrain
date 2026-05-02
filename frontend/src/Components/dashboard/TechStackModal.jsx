import { X, Sparkles, Loader2, Database, Layout, Server, Brain, Wrench, Save, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { generateTechStack } from "../../services/aiService";
import { updateProjectTechStack } from "../../services/projectService";
import AILoadingOverlay from "../common/AILoadingOverlay";

const TechStackModal = ({ isOpen, onClose, initialRequirement = "", projectId, savedStack }) => {
    const [requirement, setRequirement] = useState(initialRequirement);
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [recommendation, setRecommendation] = useState(null);

    // Update requirement when prop changes, or load saved stack
    useEffect(() => {
        if (isOpen) {
            setRequirement(initialRequirement);

            if (savedStack && savedStack.frontendTech) {
                // Construct recommendation object from saved stack
                setRecommendation({
                    frontend: { name: savedStack.frontendTech, reason: "Saved Configuration" },
                    backend: { name: savedStack.backendTech, reason: "Saved Configuration" },
                    database: { name: savedStack.databaseTech, reason: "Saved Configuration" },
                    ai_ml: savedStack.aiMlTech ? { name: savedStack.aiMlTech, reason: "Saved Configuration" } : null,
                    tools: savedStack.toolsTech ? savedStack.toolsTech.split(", ") : []
                });
            } else {
                setRecommendation(null);
            }
        }
    }, [isOpen, initialRequirement, savedStack]);

    if (!isOpen) return null;

    const handleGenerate = async () => {
        if (!requirement.trim()) return;
        setLoading(true);
        setRecommendation(null);
        try {
            const data = await generateTechStack(requirement);
            setRecommendation(data);
        } catch (error) {
            console.error("AI Error:", error);
            const errorMessage = error.response?.data || "Failed to generate recommendation. Make sure the API key is configured.";
            alert(typeof errorMessage === 'string' ? errorMessage : "Failed to generate recommendation.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProject = async () => {
        if (!recommendation || !projectId) return;
        setUpdating(true);
        try {
            const techStackUpdate = {
                frontendTech: recommendation.frontend?.name,
                backendTech: recommendation.backend?.name,
                databaseTech: recommendation.database?.name,
                aiMlTech: recommendation.ai_ml?.name,
                toolsTech: recommendation.tools ? recommendation.tools.join(", ") : ""
            };

            await updateProjectTechStack(projectId, techStackUpdate);
            alert("Project tech stack updated successfully!");
            onClose();
        } catch (error) {
            console.error("Failed to update project:", error);
            alert("Failed to update project tech stack.");
        } finally {
            setUpdating(false);
        }
    };

    const TechItem = ({ title, icon: Icon, data }) => {
        if (!data) return null;
        return (
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-white rounded-lg border shadow-sm text-pink-500">
                        <Icon size={16} />
                    </div>
                    <h4 className="font-semibold text-gray-700">{title}</h4>
                </div>
                <div className="ml-9">
                    <p className="font-bold text-gray-900">{data.name}</p>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">{data.reason}</p>
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto overflow-hidden">
                {loading && <AILoadingOverlay message="Generating architecture..." />}
                {/* Header */}
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg text-white">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">AI Stack Architect</h3>
                            <p className="text-xs text-gray-500">Powered by Gemini</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Input Section */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">
                            Describe your project idea
                        </label>
                        <div className="relative">
                            <textarea
                                value={requirement}
                                onChange={(e) => setRequirement(e.target.value)}
                                placeholder="E.g., I want to build a real-time chat application similar to WhatsApp..."
                                className="w-full h-24 px-4 py-3 rounded-xl border focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none resize-none text-sm"
                            />
                            <div className="absolute bottom-3 right-3 flex gap-2">
                                <button
                                    onClick={handleGenerate}
                                    disabled={loading || !requirement.trim()}
                                    className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                                >
                                    {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                                    Generate Stack
                                </button>

                                {recommendation && projectId && (
                                    <button
                                        onClick={handleUpdateProject}
                                        disabled={updating}
                                        className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                                    >
                                        {updating ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                        Update Project
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Results Section */}
                    {recommendation && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center gap-2 text-sm text-green-600 font-medium bg-green-50 px-3 py-1.5 rounded-full w-fit">
                                <CheckCircle size={14} />
                                Recommended Architecture
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <TechItem title="Frontend" icon={Layout} data={recommendation.frontend} />
                                <TechItem title="Backend" icon={Server} data={recommendation.backend} />
                                <TechItem title="Database" icon={Database} data={recommendation.database} />
                                <TechItem title="AI / ML" icon={Brain} data={recommendation.ai_ml} />
                            </div>

                            {recommendation.tools && recommendation.tools.length > 0 && (
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1.5 bg-white rounded-lg border shadow-sm text-violet-500">
                                            <Wrench size={16} />
                                        </div>
                                        <h4 className="font-semibold text-gray-700">Recommended Tools</h4>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {recommendation.tools.map((tool, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-white border rounded-full text-xs font-medium text-gray-600">
                                                {tool}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

TechStackModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    initialRequirement: PropTypes.string,
    projectId: PropTypes.number,
};

export default TechStackModal;
