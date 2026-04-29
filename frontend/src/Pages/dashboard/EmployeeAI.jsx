import { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Loader2, Sparkles, Folder, ClipboardList, ChevronLeft, ChevronRight, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { getTasksByUser } from "../../services/taskService";
import axios from "axios";
import DesignPreview from "../../components/dashboard/DesignPreview";

const EmployeeAI = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchProjects = async () => {
        const userId = localStorage.getItem("userId");
        if (!userId) return;
        try {
            const allTasks = await getTasksByUser(userId);
            const projectMap = new Map();

            allTasks.forEach(task => {
                if (task.project) {
                    if (!projectMap.has(task.project.projectId)) {
                        projectMap.set(task.project.projectId, {
                            ...task.project,
                            projectTasks: [] // Store tasks for this project
                        });
                    }
                    // Add task to the project's task list
                    projectMap.get(task.project.projectId).projectTasks.push(task);
                }
            });
            setProjects(Array.from(projectMap.values()));
        } catch (error) {
            console.error("Failed to fetch projects", error);
        }
    };

    const handleCopyRequirement = (req, e) => {
        e.stopPropagation(); // Prevent triggering project selection
        navigator.clipboard.writeText(req);
        // Optional: Show a toast or feedback
        alert("Requirement copied to clipboard!");
    };

    const handleSendMessage = async () => {
        if (!input.trim()) return;
        if (!selectedProject) {
            alert("Please select a project first to give the AI context.");
            return;
        }

        const userMsg = { role: "user", content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const projectContext = `Project: ${selectedProject.projectName}. Description: ${selectedProject.description}. Tech Stack: ${selectedProject.frontendTech}, ${selectedProject.backendTech}.`;

            const response = await axios.post(
                "http://localhost:8080/api/ai/chat",
                {
                    projectContext,
                    userPrompt: userMsg.content,
                    history: messages
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const aiMsg = { role: "ai", content: response.data };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error("AI Error", error);
            setMessages(prev => [...prev, { role: "ai", content: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-[calc(100vh-2rem)] gap-4 animate-in fade-in duration-500 relative">
            {/* Collapse toggle button (absolute positioned if sidebar is closed, or inside if open) */}

            {/* Sidebar: Projects & Requirements */}
            <div
                className={`
                    bg-white border rounded-2xl flex flex-col shadow-sm transition-all duration-300 ease-in-out
                    ${isSidebarCollapsed ? 'w-20 items-center py-4' : 'w-96 p-4'}
                `}
            >
                <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center mb-6' : 'justify-between mb-4'}`}>
                    {!isSidebarCollapsed && (
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <Folder className="w-5 h-5 text-violet-600" />
                            Projects
                        </h3>
                    )}
                    <button
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                        title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    >
                        {isSidebarCollapsed ? <PanelLeftOpen className="w-6 h-6 text-violet-600" /> : <PanelLeftClose className="w-5 h-5" />}
                    </button>
                </div>

                {/* Sidebar Content */}
                <div className={`flex-1 overflow-y-auto space-y-3 ${isSidebarCollapsed ? 'hidden' : 'pr-2'}`}>
                    {projects.map(p => (
                        <div
                            key={p.projectId}
                            onClick={() => setSelectedProject(p)}
                            className={`rounded-xl transition-all border overflow-hidden ${selectedProject?.projectId === p.projectId
                                ? "bg-violet-50/50 border-violet-200 shadow-sm"
                                : "hover:bg-gray-50 border-transparent"
                                }`}
                        >
                            {/* Project Header */}
                            <div className="p-3 cursor-pointer">
                                <h4 className={`font-medium ${selectedProject?.projectId === p.projectId ? 'text-violet-700' : 'text-gray-700'}`}>
                                    {p.projectName}
                                </h4>
                                <p className="text-xs text-gray-500 truncate">{p.description}</p>
                            </div>

                            {/* Expanded Tasks View */}
                            {selectedProject?.projectId === p.projectId && (
                                <div className="bg-white/50 border-t border-violet-100 p-3 space-y-3">
                                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Project Tasks</p>
                                    {p.projectTasks.map(task => (
                                        <div key={task.taskId} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                            <div className="flex justify-between items-start gap-2 mb-2">
                                                <span className="text-sm font-medium text-gray-800 line-clamp-1">{task.taskName}</span>
                                            </div>

                                            {task.designRequirements ? (
                                                <div className="bg-gray-50 p-2 rounded text-xs text-gray-600 relative group">
                                                    <p className="line-clamp-3 mb-1">{task.designRequirements}</p>
                                                    <button
                                                        onClick={(e) => handleCopyRequirement(task.designRequirements, e)}
                                                        className="w-full flex items-center justify-center gap-1.5 py-1.5 mt-2 bg-violet-100 text-violet-700 rounded hover:bg-violet-200 transition-colors font-medium"
                                                    >
                                                        <ClipboardList className="w-3 h-3" />
                                                        Copy
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">No specific requirements</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    {projects.length === 0 && (
                        <p className="text-sm text-gray-400 text-center py-4">No projects found.</p>
                    )}
                </div>

                {/* Minimized Icons View */}
                {isSidebarCollapsed && (
                    <div className="flex flex-col gap-4 items-center">
                        {projects.map(p => (
                            <div
                                key={p.projectId}
                                onClick={() => { setSelectedProject(p); setIsSidebarCollapsed(false); }}
                                className={`p-3 rounded-xl cursor-pointer transition-all ${selectedProject?.projectId === p.projectId
                                    ? "bg-violet-100 text-violet-600 shadow-sm"
                                    : "hover:bg-gray-50 text-gray-500"
                                    }`}
                                title={p.projectName}
                            >
                                <Folder className="w-6 h-6" />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Chat Interface */}
            <div className="flex-1 bg-white border rounded-2xl shadow-sm flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b bg-gradient-to-r from-violet-50 to-white flex items-center gap-3">
                    <div className="p-2 bg-white rounded-full shadow-sm">
                        <Sparkles className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-800">AI Design Assistant</h2>
                        <p className="text-xs text-gray-500">
                            {selectedProject
                                ? `Context: ${selectedProject.projectName}`
                                : "Select a project to start designing"}
                        </p>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                            <Bot className="w-12 h-12 mb-3 opacity-20" />
                            <p>Select a project and ask me to generate<br />UI designs, color palettes, or user flows!</p>
                        </div>
                    )}
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'ai' && (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white shrink-0 shadow-md">
                                    <Bot className="w-4 h-4" />
                                </div>
                            )}
                            <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap
                                ${msg.role === 'user'
                                    ? 'bg-gray-800 text-white rounded-br-none'
                                    : 'bg-white border border-gray-100 text-gray-700 rounded-bl-none prose prose-sm'}`}>

                                {msg.role === 'ai' ? (
                                    (() => {
                                        const parts = msg.content.split(/<<<DESIGN_PREVIEW>>>|<<<\/?DESIGN_PREVIEW>>>/);
                                        // If parsing worked, we might have [text, code, text] or just [text, code]
                                        // The split behavior generally: "A <<<B>>> C" -> ["A ", "B", " C"]
                                        // We need to carefully re-assemble or check indexes.

                                        // Simple regex match might be safer to iterate
                                        const regex = /<<<DESIGN_PREVIEW>>>([\s\S]*?)<<<\/?DESIGN_PREVIEW>>>/g;
                                        const matches = [...msg.content.matchAll(regex)];

                                        if (matches.length > 0) {
                                            // Render text before code, then code, then text after...
                                            // For simplicity, let's assume one main design block for now or split by the first match.

                                            // Actually, let's use split again but map carefully.
                                            // The regex split will capture the delimiter unless we use capturing group.
                                            const splitParts = msg.content.split(/(<<<DESIGN_PREVIEW>>>[\s\S]*?<<<\/?DESIGN_PREVIEW>>>)/g);

                                            return splitParts.map((part, i) => {
                                                if (part.startsWith('<<<DESIGN_PREVIEW>>>')) {
                                                    const code = part.replace('<<<DESIGN_PREVIEW>>>', '').replace('<<</DESIGN_PREVIEW>>>', '').trim();
                                                    return <DesignPreview key={i} code={code} />;
                                                } else {
                                                    return <span key={i}>{part}</span>;
                                                }
                                            });
                                        } else {
                                            return msg.content;
                                        }
                                    })()
                                ) : (
                                    msg.content
                                )}
                            </div>
                            {msg.role === 'user' && (
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 shrink-0">
                                    <User className="w-4 h-4" />
                                </div>
                            )}
                        </div>
                    ))}
                    {loading && (
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white shrink-0 shadow-md">
                                <Bot className="w-4 h-4" />
                            </div>
                            <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-violet-500" />
                                <span className="text-xs text-gray-500">Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder={selectedProject ? "Ask for a design suggestions..." : "Select a project first..."}
                            disabled={!selectedProject || loading}
                            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!selectedProject || loading || !input.trim()}
                            className="px-4 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-violet-200"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeAI;
