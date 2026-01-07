import { useState, useEffect } from "react";
import { getUser, updateUser } from "../../services/userService";

const Profile = () => {
    const [user, setUser] = useState({ fullName: "", email: "" });
    const [password, setPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const userId = localStorage.getItem("userId");

    useEffect(() => {
        if (userId) {
            fetchUser();
        } else {
            setError("User not found (no userId). Please login again.");
        }
    }, [userId]);

    const fetchUser = async () => {
        try {
            const data = await getUser(userId);
            setUser({ fullName: data.fullName, email: data.email });
        } catch (err) {
            console.error(err);
            setError("Failed to fetch user details.");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const updateRequest = {
                fullName: user.fullName,
                password: password || null,
                currentPassword: currentPassword || null
            };
            const updatedUser = await updateUser(userId, updateRequest);
            setUser(prev => ({ ...prev, fullName: updatedUser.fullName }));
            setPassword(""); // Clear password field
            setCurrentPassword(""); // Clear current password field
            setMessage("Profile updated successfully!");
        } catch (err) {
            console.error(err);
            // Handle specific backend error message
            if (err.response && err.response.data && err.response.data.message) {
                setError("Error: " + err.response.data.message);
            } else if (err.response && typeof err.response.data === 'string') {
                setError("Error: " + err.response.data);
            } else {
                setError("Failed to update profile.");
            }
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Profile</h2>

            {message && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
                    {message}
                </div>
            )}

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Full Name</label>
                    <input
                        type="text"
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 outline-none"
                        value={user.fullName}
                        onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Email</label>
                    <input
                        type="email"
                        className="w-full border rounded-lg px-4 py-2 bg-gray-100 outline-none cursor-not-allowed"
                        value={user.email}
                        readOnly
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed.</p>
                </div>

                <div className="pt-4 border-t">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">Change Password</h3>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">New Password</label>
                        <input
                            type="password"
                            placeholder="Leave blank to keep current password"
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {password && (
                        <div className="mt-3">
                            <label className="block text-gray-700 font-medium mb-1">Current Password (Required)</label>
                            <input
                                type="password"
                                placeholder="Enter current password to confirm"
                                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 outline-none"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                        </div>
                    )}
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full py-2.5 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium hover:from-pink-600 hover:to-purple-600 transition-all"
                    >
                        Update Profile
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Profile;
