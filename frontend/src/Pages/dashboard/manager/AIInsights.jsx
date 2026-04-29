import { useState } from "react";
import { Sparkles, AlertTriangle, TrendingUp, Activity, CheckCircle, Brain, RefreshCw } from "lucide-react";
import { getAllProjects } from "../../../services/projectService";
import { getAllTasks } from "../../../services/taskService";
import { getAllUsers } from "../../../services/userService";
import { getProjectInsights } from "../../../services/aiService";
import AILoadingOverlay from "../../../components/common/AILoadingOverlay";
import ManagerChatWidget from "../../../components/dashboard/ManagerChatWidget";

const AIInsights = () => {
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGenerateInsights = async () => {
        setLoading(true);
        setError(null);
        try {
            // 1. Gather Context
            const [projects, tasks, users] = await Promise.all([
                getAllProjects(),
                getAllTasks(),
                getAllUsers()
            ]);

            // 2. Prepare Summary for AI
            const context = {
                projectCount: projects.length,
                taskCount: tasks.length,
                teamSize: users.filter(u => u.role === 'EMPLOYEE').length,
                overdueTasks: tasks.filter(t => new Date(t.deadline) < new Date() && t.status !== 'COMPLETED').length,
                projects: projects.map(p => ({
                    name: p.projectName,
                    techStack: `${p.frontendTech}, ${p.backendTech}`,
                    status: "Active" // Simplified
                })),
                recentTasks: tasks.slice(0, 5).map(t => ({
                    name: t.taskName,
                    status: t.status,
                    assignee: t.assignedEmployees?.[0]?.fullName || "Unassigned"
                }))
            };

            // 3. Call AI
            const analysis = await getProjectInsights(context);
            setInsights(analysis);

        } catch (err) {
            console.error("AI Insight Error", err);
            setError("Failed to generate insights. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-[500px]">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Brain className="w-8 h-8 text-violet-600" />
                        AI Strategic Insights
                    </h2>
                    <p className="text-gray-500 mt-1">Get AI-powered risk analysis and team health reports.</p>
                </div>
                <button
                    onClick={handleGenerateInsights}
                    disabled={loading}
                    className="px-6 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium rounded-xl hover:shadow-lg hover:to-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                    {loading ? <RefreshCw className="animate-spin w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                    Generate Analysis
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl mb-6 flex items-center gap-2 border border-red-100">
                    <AlertTriangle className="w-5 h-5" />
                    {error}
                </div>
            )}

            {/* Loading Overlay */}
            {loading && <AILoadingOverlay message="Analyzing project risks & opportunities..." />}

            {/* Results */}
            {insights ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* Team Health Score */}
                    {insights.team_health && (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-pink-500" />
                                    Team Health
                                </h3>
                                <p className="text-gray-500 text-sm mt-1 max-w-xl">{insights.team_health.summary}</p>
                            </div>
                            <div className="text-center">
                                <div className={`text-4xl font-bold ${insights.team_health.score > 80 ? 'text-green-500' : 'text-yellow-500'}`}>
                                    {insights.team_health.score}/100
                                </div>
                                <div className="text-xs uppercase tracking-wider text-gray-400 font-bold mt-1">Score</div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Risks */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                                Identified Risks
                            </h3>
                            {insights.risks?.map((risk, idx) => (
                                <div key={idx} className="bg-white p-5 rounded-xl border border-red-100 shadow-sm border-l-4 border-l-red-400">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-gray-800">{risk.title}</h4>
                                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${risk.severity === 'High' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                                            }`}>
                                            {risk.severity}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed">{risk.description}</p>
                                </div>
                            ))}
                        </div>

                        {/* Recommendations */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-blue-500" />
                                Strategic Recommendations
                            </h3>
                            {insights.recommendations?.map((rec, idx) => (
                                <div key={idx} className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm border-l-4 border-l-blue-400">
                                    <h4 className="font-semibold text-gray-800 mb-2">{rec.title}</h4>
                                    <div className="flex items-start gap-2 text-sm text-gray-600">
                                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                        <p>{rec.action}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            ) : (
                // Empty State
                !loading && (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm mb-4">
                            <Brain className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-600">No Insights Generated Yet</h3>
                        <p className="text-gray-400 max-w-sm mx-auto mt-2">
                            Click the "Generate Analysis" button to let AI analyze your current project data and provide strategic advice.
                        </p>
                    </div>
                )
            )}

        </div>
    );
};

export default AIInsights;
