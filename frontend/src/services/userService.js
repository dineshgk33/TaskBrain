const UserManagement = () => {
    return (
        <div className="space-y-6">
            {/* PAGE HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                        User Management
                    </h2>
                    <p className="text-sm text-gray-500">
                        Manage your team members and their roles
                    </p>
                </div>

                <button
                    className="
            px-4 py-2 rounded-lg text-sm font-medium
            bg-gradient-to-r from-pink-500 to-violet-500
            text-white hover:from-pink-600 hover:to-violet-600
            transition-all
          "
                >
                    + Add User
                </button>
            </div>

            {/* TABLE WRAPPER (RESPONSIVE) */}
            <div className="bg-white rounded-xl border overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                    <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-600">
                            Name
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-600">
                            Email
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-600">
                            Work Role
                        </th>
                        <th className="px-4 py-3 text-right font-medium text-gray-600">
                            Actions
                        </th>
                    </tr>
                    </thead>

                    <tbody>
                    {/* EMPTY STATE */}
                    <tr>
                        <td
                            colSpan="4"
                            className="px-4 py-10 text-center text-gray-500"
                        >
                            No users added yet
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
