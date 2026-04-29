import { useState, useEffect } from "react";
import { Code, Eye, Monitor, Smartphone, Tablet } from "lucide-react";

const DesignPreview = ({ code }) => {
    const [viewMode, setViewMode] = useState("preview"); // preview | code
    const [device, setDevice] = useState("monitor"); // monitor | tablet | mobile

    // Inject Tailwind CDN into the iframe
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            body { background-color: transparent; }
            /* Hide scrollbar for cleaner look if needed */
            ::-webkit-scrollbar { width: 6px; }
            ::-webkit-scrollbar-track { background: transparent; }
            ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
        </style>
    </head>
    <body>
        ${code}
    </body>
    </html>
    `;

    const getWidth = () => {
        switch (device) {
            case "mobile": return "375px";
            case "tablet": return "768px";
            default: return "100%";
        }
    };

    return (
        <div className="mt-4 border rounded-xl overflow-hidden bg-white shadow-sm ring-1 ring-gray-200">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b">
                <div className="flex items-center space-x-1 bg-white rounded-lg p-1 border">
                    <button
                        onClick={() => setViewMode("preview")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === "preview" ? "bg-violet-100 text-violet-700" : "text-gray-600 hover:bg-gray-50"
                            }`}
                    >
                        <Eye className="w-4 h-4" />
                        Preview
                    </button>
                    <button
                        onClick={() => setViewMode("code")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === "code" ? "bg-violet-100 text-violet-700" : "text-gray-600 hover:bg-gray-50"
                            }`}
                    >
                        <Code className="w-4 h-4" />
                        Code
                    </button>
                </div>

                {viewMode === "preview" && (
                    <div className="flex items-center space-x-1 text-gray-400">
                        <button
                            onClick={() => setDevice("monitor")}
                            className={`p-1.5 rounded hover:bg-white hover:text-gray-700 transition ${device === 'monitor' ? 'text-violet-600 bg-white shadow-sm' : ''}`} title="Desktop"
                        >
                            <Monitor className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setDevice("tablet")}
                            className={`p-1.5 rounded hover:bg-white hover:text-gray-700 transition ${device === 'tablet' ? 'text-violet-600 bg-white shadow-sm' : ''}`} title="Tablet"
                        >
                            <Tablet className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setDevice("mobile")}
                            className={`p-1.5 rounded hover:bg-white hover:text-gray-700 transition ${device === 'mobile' ? 'text-violet-600 bg-white shadow-sm' : ''}`} title="Mobile"
                        >
                            <Smartphone className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Content Content */}
            <div className="bg-gray-100 p-4 transition-all duration-300">
                {viewMode === "preview" ? (
                    <div className="mx-auto bg-white shadow-2xl transition-all duration-300 overflow-hidden rounded-lg" style={{ width: getWidth(), height: "500px" }}>
                        <iframe
                            srcDoc={htmlContent}
                            className="w-full h-full border-0"
                            title="Design Preview"
                            sandbox="allow-scripts"
                        />
                    </div>
                ) : (
                    <div className="h-[500px] overflow-auto bg-[#1e1e1e] p-4 rounded-lg text-sm font-mono text-gray-300 leading-relaxed shadow-inner">
                        <pre>{code}</pre>
                    </div>
                )}
            </div>

            <div className="px-4 py-2 bg-gray-50 border-t text-xs text-gray-400 flex justify-between">
                <span>Tailwind CSS v3.x injected</span>
                <span>Live Render</span>
            </div>
        </div>
    );
};

export default DesignPreview;
