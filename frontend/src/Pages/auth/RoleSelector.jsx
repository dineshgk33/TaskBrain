const RoleSelector = ({ role, setRole }) => {
    return (
        <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
                Select your role
            </p>

            <div className="grid grid-cols-2 gap-4">
                {/* MANAGER */}
                <button
                    type="button"
                    onClick={() => setRole("manager")}
                    className={`
            py-3 rounded-lg border font-medium text-center transition-all
            ${
                        role === "manager"
                            ? "bg-pink-500 text-white border-pink-500"
                            : "bg-white text-gray-700 border-gray-300 hover:border-pink-400"
                    }
          `}
                >
                    Manager
                </button>

                {/* STUDENT */}
                <button
                    type="button"
                    onClick={() => setRole("student")}
                    className={`
            py-3 rounded-lg border font-medium text-center transition-all
            ${
                        role === "student"
                            ? "bg-pink-500 text-white border-pink-500"
                            : "bg-white text-gray-700 border-gray-300 hover:border-pink-400"
                    }
          `}
                >
                    Student
                </button>
            </div>
        </div>
    );
};

export default RoleSelector;
