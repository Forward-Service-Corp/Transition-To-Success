const ClientsView = ({ navigateToView }) => {

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4">My Clients</h2>
                <div className="space-y-4">
                    <p className="text-gray-600">Manage your client caseload and track their progress.</p>

                    <div className="bg-gray-50 p-4 rounded border">
                        <h3 className="font-medium text-gray-900 mb-3">Client Overview</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">0</div>
                                <div className="text-sm text-gray-600">Active Clients</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">0</div>
                                <div className="text-sm text-gray-600">Completed Programs</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-orange-600">0</div>
                                <div className="text-sm text-gray-600">Pending Assessments</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex space-x-3">
                        <button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
                            Add New Client
                        </button>
                        <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50">
                            Export Client List
                        </button>
                    </div>

                    <p className="text-sm text-gray-500">Full client management functionality will be implemented here.</p>
                </div>
            </div>
        </div>
    );
};

export default ClientsView;