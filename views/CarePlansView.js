const CarePlansView = ({ navigateToView }) => {

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4">CARE Plans</h2>
                <div className="space-y-4">
                    <p className="text-gray-600">Create and manage your Comprehensive Assessment and Resource Evaluation (CARE) plans.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div className="bg-blue-50 p-4 rounded border border-blue-200">
                            <h3 className="font-medium text-blue-900 mb-2">Current Plans</h3>
                            <p className="text-sm text-blue-700 mb-3">View and manage your active CARE plans</p>
                            <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                                View Plans
                            </button>
                        </div>

                        <div className="bg-green-50 p-4 rounded border border-green-200">
                            <h3 className="font-medium text-green-900 mb-2">Create New Plan</h3>
                            <p className="text-sm text-green-700 mb-3">Start a new CARE plan assessment</p>
                            <button className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                                New Plan
                            </button>
                        </div>
                    </div>

                    <p className="text-sm text-gray-500 mt-6">Full CARE Plans functionality will be implemented here.</p>
                </div>
            </div>
        </div>
    );
};

export default CarePlansView;