import { Component, Sparkles } from "lucide-react";

const AILoadingOverlay = ({ message = "AI is thinking..." }) => {
    return (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-xl animate-in fade-in duration-300">
            <div className="relative">
                {/* Outer Ring */}
                <div className="w-16 h-16 rounded-full border-4 border-violet-100 border-t-violet-600 animate-spin"></div>

                {/* Inner Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-violet-600 animate-pulse" />
                </div>
            </div>

            <div className="mt-4 text-center">
                <h3 className="text-lg font-semibold text-gray-800 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                    AI Processing
                </h3>
                <p className="text-sm text-gray-500 mt-1">{message}</p>
            </div>
        </div>
    );
};

export default AILoadingOverlay;
