import { useState, useEffect } from "react";
import { User, Mail, Shield, Key, Save, Camera } from "lucide-react";
import { getUser, updateUser } from "../../services/userService";

const EmployeeProfile = () => {
    const [user, setUser] = useState({ fullName: "", email: "", role: "" });
    const [passwords, setPasswords] = useState({ current: "", new: "" });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: "", text: "" });

    const userId = localStorage.getItem("userId");

    useEffect(() => {
        if (userId) fetchUser();
    }, [userId]);

    const fetchUser = async () => {
        try {
            const data = await getUser(userId);
            setUser({
                fullName: data.fullName,
                email: data.email,
                role: localStorage.getItem("role") || "Employee"
            });
        } catch (err) {
            console.error(err);
            setMessage({ type: "error", text: "Failed to load profile." });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });

        try {
            const updateRequest = {
                fullName: user.fullName,
                password: passwords.new || null,
                currentPassword: passwords.current || null
            };

            const updated = await updateUser(userId, updateRequest);
            setUser(prev => ({ ...prev, fullName: updated.fullName }));
            setPasswords({ current: "", new: "" });
            setMessage({ type: "success", text: "Profile updated successfully!" });
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.response?.data || "Update failed.";
            setMessage({ type: "error", text: errorMsg });
        }
    };

    if (loading) return <div className="p-10 text-center">Loading profile...</div>;

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <User className="w-6 h-6 text-pink-500" />
                My Profile
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Profile Card */}
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                        <div className="relative w-24 h-24 mx-auto mb-4">
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-500 to-violet-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                                {user.fullName.charAt(0).toUpperCase()}
                            </div>
                            <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-md border hover:bg-gray-50">
                                <Camera className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">{user.fullName}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <div className="mt-4 inline-block px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-xs font-semibold uppercase tracking-wide">
                            {user.role}
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="md:col-span-2">
                    <form onSubmit={handleUpdate} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">

                        {message.text && (
                            <div className={`p-4 rounded-xl flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {message.type === 'success' ? <Shield className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                {message.text}
                            </div>
                        )}

                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Personal Details</h4>

                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={user.fullName}
                                            onChange={e => setUser({ ...user, fullName: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            value={user.email}
                                            readOnly
                                            className="w-full pl-10 pr-4 py-2 border rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4">
                            <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Security</h4>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                <div className="relative">
                                    <Key className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                    <input
                                        type="password"
                                        placeholder="Min 6 characters"
                                        value={passwords.new}
                                        onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {passwords.new && (
                                <div className="animate-in fade-in slide-in-from-top-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password (Confirm)</label>
                                    <input
                                        type="password"
                                        required
                                        value={passwords.current}
                                        onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="pt-6 flex justify-end">
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-pink-500 to-violet-600 text-white font-medium rounded-xl hover:shadow-lg hover:to-violet-700 transition-all active:scale-95"
                            >
                                <Save className="w-5 h-5" />
                                Save Changes
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default EmployeeProfile;
