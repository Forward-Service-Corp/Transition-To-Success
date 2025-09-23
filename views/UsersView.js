const UsersView = ({ navigateToView }) => {

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4">User Management</h2>
                <div className="space-y-4">
                    <p className="text-gray-600">Manage system users, roles, and permissions.</p>

                    <div className="bg-red-50 p-4 rounded border border-red-200">
                        <h3 className="font-medium text-red-900 mb-2">Administrator Only</h3>
                        <p className="text-sm text-red-700">This section is restricted to system administrators.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded border">
                            <h3 className="font-medium text-gray-900 mb-2">User Accounts</h3>
                            <p className="text-sm text-gray-600 mb-3">View and manage user accounts</p>
                            <button className="text-sm bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700">
                                Manage Users
                            </button>
                        </div>

                        <div className="bg-gray-50 p-4 rounded border">
                            <h3 className="font-medium text-gray-900 mb-2">Permissions</h3>
                            <p className="text-sm text-gray-600 mb-3">Configure user roles and access levels</p>
                            <button className="text-sm bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700">
                                Manage Roles
                            </button>
                        </div>
                    </div>

                    <p className="text-sm text-gray-500">Full user management functionality will be implemented here.</p>
                </div>
            </div>
        </div>
    );
};

export default UsersView;