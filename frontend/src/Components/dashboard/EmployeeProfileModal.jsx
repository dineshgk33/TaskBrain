import { useState, useEffect } from "react";

const EmployeeProfileModal = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        availability: "FREE",
        currentlyWorking: "",
        skills: "",
        experienceYears: 0,
        totalProjectsWorked: 0,
        performanceRating: 0.0,
        onTimeDeliveryPercent: 0.0
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                availability: initialData.availability || "FREE",
                currentlyWorking: initialData.currentlyWorking || "N/A",
                skills: initialData.skills || "",
                experienceYears: initialData.experienceYears || 0,
                totalProjectsWorked: initialData.totalProjectsWorked || 0,
                performanceRating: initialData.performanceRating || 0.0,
                onTimeDeliveryPercent: initialData.onTimeDeliveryPercent || 0.0
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 max-h-[90vh] overflow-y-auto">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Update Employee Profile
                    </h3>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {/* Availability */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                            <select
                                name="availability"
                                value={formData.availability}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500"
                            >
                                <option value="FREE">Free</option>
                                <option value="BUSY">Busy</option>
                                <option value="ON_LEAVE">On Leave</option>
                            </select>
                        </div>

                        {/* Currently Working */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Currently Working On</label>
                            <input
                                type="text"
                                name="currentlyWorking"
                                value={formData.currentlyWorking}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500"
                            />
                        </div>

                        {/* Skills */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
                            <input
                                type="text"
                                name="skills"
                                placeholder="Java, React, SQL"
                                value={formData.skills}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Experience */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
                                <input
                                    type="number"
                                    name="experienceYears"
                                    value={formData.experienceYears}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500"
                                />
                            </div>
                            {/* Total Projects */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Total Projects</label>
                                <input
                                    type="number"
                                    name="totalProjectsWorked"
                                    value={formData.totalProjectsWorked}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Performance */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Performance (0-5)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    max="5"
                                    name="performanceRating"
                                    value={formData.performanceRating}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500"
                                />
                            </div>
                            {/* Delivery % */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">On-Time Delivery (%)</label>
                                <input
                                    type="number"
                                    step="1"
                                    max="100"
                                    name="onTimeDeliveryPercent"
                                    value={formData.onTimeDeliveryPercent}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500"
                                />
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-pink-500 to-violet-500 text-white hover:from-pink-600 hover:to-violet-600"
                            >
                                Update Profile
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EmployeeProfileModal;
