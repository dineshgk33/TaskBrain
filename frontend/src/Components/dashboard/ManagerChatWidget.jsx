import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import api, { getAuthHeaders } from '../../services/api';

const ManagerChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'ai', content: 'Hello! I am your Project Management Consultant. How can I assist you with your team or projects today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            // Prepare history (limit context window if needed)
            const history = messages.slice(-10); // Last 10 messages context

            const response = await api.post('/ai/manager-chat', {
                message: userMsg.content,
                history: history
            }, getAuthHeaders());

            const aiMsg = { role: 'ai', content: response.data };
            setMessages(prev => [...prev, aiMsg]);

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'ai', content: "I'm having trouble connecting right now. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">

            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-4 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-2 text-white">
                            <Bot className="w-5 h-5" />
                            <h3 className="font-semibold">AI Consultant</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${msg.role === 'user'
                                        ? 'bg-violet-600 text-white rounded-br-none'
                                        : 'bg-white text-gray-700 border border-gray-100 rounded-bl-none'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start animate-pulse">
                                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 flex gap-1 items-center shadow-sm">
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 bg-white border-t shrink-0">
                        <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-2 py-1">
                            <input
                                type="text"
                                placeholder="Ask about strategy..."
                                className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-2 outline-none text-gray-700"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                disabled={loading}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || loading}
                                className="p-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 transition-all"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-4 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center ${isOpen
                        ? 'bg-gray-800 text-white hover:bg-black rotate-90 scale-90'
                        : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:scale-105 hover:shadow-2xl hover:shadow-violet-200'
                    }`}
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
            </button>
        </div>
    );
};

export default ManagerChatWidget;
