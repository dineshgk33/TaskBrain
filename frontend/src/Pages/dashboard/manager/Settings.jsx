import { useState, useEffect } from "react";
import { User, Bell, Lock, Save, Moon, Sun, Globe, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("profile");
    const [user, setUser] = useState({ fullName: "", email: "", role: "" });
    const [notifications, setNotifications] = useState({ email: true, push: false, updates: true });
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        // Load user from local storage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleSave = () => {
        alert("Settings saved successfully!");
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    const TabButton = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all
                ${activeTab === id
                    ? "bg-violet-100 text-violet-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
        >
            <Icon className="w-4 h-4" />
            {label}
        </button>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
                <p className="text-gray-500">Manage your account preferences and system settings</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b pb-2 overflow-x-auto">
                <TabButton id="profile" label="My Profile" icon={User} />
                <TabButton id="notifications" label="Notifications" icon={Bell} />
                <TabButton id="security" label="Security" icon={Lock} />
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 min-h-[400px]">

                {/* PROFILE TAB */}
                {activeTab === "profile" && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                                {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">{user.fullName || "User Name"}</h3>
                                <p className="text-gray-500">{user.email || "user@example.com"}</p>
                                <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 mt-2 border">
                                    {user.role || "ROLE"}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Full Name</label>
                                <input
                                    type="text"
                                    value={user.fullName}
                                    readOnly
                                    className="w-full p-2.5 bg-gray-50 border rounded-lg text-gray-500 cursor-not-allowed"
                                />
                                <p className="text-xs text-gray-400">Contact admin to change name</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Email Address</label>
                                <input
                                    type="email"
                                    value={user.email}
                                    readOnly
                                    className="w-full p-2.5 bg-gray-50 border rounded-lg text-gray-500 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                )}

                {/* NOTIFICATIONS TAB */}
                {activeTab === "notifications" && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800">Alert Preferences</h3>
                        <div className="space-y-4">
                            {[
                                { id: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
                                { id: 'push', label: 'Push Notifications', desc: 'Receive popup alerts in browser' },
                                { id: 'updates', label: 'System Updates', desc: 'Get notified about new features' }
                            ].map(item => (
                                <div key={item.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition-colors">
                                    <div>
                                        <h4 className="font-medium text-gray-800">{item.label}</h4>
                                        <p className="text-sm text-gray-500">{item.desc}</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={notifications[item.id]}
                                            onChange={() => setNotifications(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                                    </label>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t flex justify-end">
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors text-sm font-medium"
                            >
                                <Save className="w-4 h-4" />
                                Save Changes
                            </button>
                        </div>
                    </div>
                )}

                {/* SECURITY TAB */}
                {activeTab === "security" && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800">Password & Security</h3>
                        <div className="space-y-4 max-w-md">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Current Password</label>
                                <input type="password" placeholder="••••••••" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-violet-500 outline-none" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">New Password</label>
                                <input type="password" placeholder="••••••••" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-violet-500 outline-none" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
                                <input type="password" placeholder="••••••••" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-violet-500 outline-none" />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={handleSave}
                                className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-sm font-medium"
                            >
                                Update Password
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Settings;
