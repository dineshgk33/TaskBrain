import { Plus, Calendar, Flag, Sparkles, CheckCircle, Layout, Server, Database, UserPlus, Video, Loader2, XCircle } from "lucide-react";
import { useState } from "react";
import { createProjectMeeting, deleteProjectMeeting } from "../../services/projectService";

export const ProjectCard = ({ project, onSuggestStack, onEdit, onAllocate, onSelect, onRefresh }) => {
    const [isProcessingMeeting, setIsProcessingMeeting] = useState(false);

    const statusColors = {
        "PLANNED": "bg-blue-100 text-blue-700",
        "IN_PROGRESS": "bg-yellow-100 text-yellow-700",
        "COMPLETED": "bg-green-100 text-green-700",
        "ON_HOLD": "bg-gray-100 text-gray-700",
        "CANCELLED": "bg-red-100 text-red-700"
    };

    const handleMeetingClick = async (e) => {
        e.stopPropagation();
        console.log(`DEBUG: Start/Join Meeting clicked for Project ID: ${project.projectId}, Name: ${project.projectName}`);
        
        if (project.meetingLink) {
            window.open(project.meetingLink, "_blank");
        } else {
            setIsProcessingMeeting(true);
            try {
                const data = await createProjectMeeting(project.projectId);
                window.open(data.meetingLink, "_blank");
                if (onRefresh) onRefresh();
            } catch (error) {
                console.error("Failed to create meeting", error);
                alert("Failed to create meeting: " + error.message);
            } finally {
                setIsProcessingMeeting(false);
            }
        }
    };

    const handleStopMeeting = async (e) => {
        e.stopPropagation();
        console.log(`DEBUG: Stop Meeting clicked for Project ID: ${project.projectId}, Name: ${project.projectName}`);
        
        if (!window.confirm("Are you sure you want to stop this meeting? The link will be removed for all members.")) return;
        
        setIsProcessingMeeting(true);
        try {
            await deleteProjectMeeting(project.projectId);
            if (onRefresh) onRefresh();
        } catch (error) {
            console.error("Failed to stop meeting", error);
            alert("Failed to stop meeting: " + error.message);
        } finally {
            setIsProcessingMeeting(false);
        }
    };

    return (
        <div
            onClick={() => onSelect && onSelect(project)}
            className={`bg-white border rounded-xl p-5 hover:shadow-md transition-all relative group cursor-pointer ${project.isSelected ? 'ring-2 ring-violet-500 shadow-md' : ''
                }`}
        >
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-800">{project.projectName}</h3>
                        {onEdit && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onEdit(project); }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"
                            >
                                <Plus className="w-3 h-3 rotate-45" /> {/* Using rotated Plus as Edit icon since Pencil might not be imported */}
                            </button>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{project.description}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[project.status] || "bg-gray-100 text-gray-700"}`}>
                    {project.status.replace("_", " ")}
                </span>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{project.deadline}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Flag className="w-4 h-4" />
                        <span>{project.priority}</span>
                    </div>
                </div>

                {/* AI Stack Button */}
                <div className="flex items-center gap-2">
                    {onSuggestStack && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onSuggestStack(project); }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${project.frontendTech
                                ? "bg-green-50 text-green-700 hover:bg-green-100"
                                : "bg-violet-50 text-violet-600 hover:bg-violet-100"
                                }`}
                        >
                            {project.frontendTech ? (
                                <>
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    View Stack
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-3.5 h-3.5" />
                                    AI Stack
                                </>
                            )}
                        </button>
                    )}

                    <button
                        onClick={(e) => { e.stopPropagation(); onAllocate(project); }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${project.isAllocated
                                ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                                : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                            }`}
                        title={project.isAllocated ? "Re-allocating will wipe existing tasks!" : "Auto Allocate Task via AI"}
                    >
                        <UserPlus className="w-3.5 h-3.5" />
                        {project.isAllocated ? "Reallocate Task" : "Allocate Task"}
                    </button>
                </div>
            </div>

            {/* Display Saved Stack Summary + Meeting Button if available */}
            <div className="mt-4 pt-3 border-t flex flex-wrap items-center gap-2 justify-between">
                <div className="flex flex-wrap gap-2">
                    {project.frontendTech && (
                        <>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                <Layout className="w-3.5 h-3.5" />
                                <span className="truncate max-w-[100px]">{project.frontendTech}</span>
                            </div>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                                <Server className="w-3.5 h-3.5" />
                                <span className="truncate max-w-[100px]">{project.backendTech}</span>
                            </div>
                            {project.databaseTech && (
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                                    <Database className="w-3.5 h-3.5" />
                                    <span className="truncate max-w-[100px]">{project.databaseTech}</span>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Meeting Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleMeetingClick}
                        disabled={isProcessingMeeting}
                        className={`
                            flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                            ${project.meetingLink
                                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-md"
                                : "bg-gradient-to-r from-pink-500 to-violet-500 text-white hover:shadow-md"
                            }
                            ${isProcessingMeeting ? "opacity-75 cursor-not-allowed" : ""}
                        `}
                    >
                        {isProcessingMeeting ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <Video className="w-3.5 h-3.5" />
                        )}
                        {project.meetingLink ? "Join Meeting" : "Start Meeting"}
                    </button>

                    {project.meetingLink && (
                        <button
                            onClick={handleStopMeeting}
                            disabled={isProcessingMeeting}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 transition-all"
                            title="Stop current meeting"
                        >
                            <XCircle className="w-3.5 h-3.5" />
                            Stop
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
