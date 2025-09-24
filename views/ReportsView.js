const ReportsView = ({ navigateToView }) => {

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4">Reports</h2>
                <div className="space-y-4">
                    <p className="text-gray-600">Generate and view reports on progress, outcomes, and program effectiveness.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded border border-blue-200">
                            <h3 className="font-medium text-blue-900 mb-2">Progress Report</h3>
                            <p className="text-sm text-blue-700 mb-3">Individual client progress tracking</p>
                            <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                                Generate
                            </button>
                        </div>

                        <div className="bg-green-50 p-4 rounded border border-green-200">
                            <h3 className="font-medium text-green-900 mb-2">Outcomes Summary</h3>
                            <p className="text-sm text-green-700 mb-3">Program completion and success rates</p>
                            <button className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                                Generate
                            </button>
                        </div>

                        <div className="bg-purple-50 p-4 rounded border border-purple-200">
                            <h3 className="font-medium text-purple-900 mb-2">Service Utilization</h3>
                            <p className="text-sm text-purple-700 mb-3">Resource usage and engagement metrics</p>
                            <button className="text-sm bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700">
                                Generate
                            </button>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded border">
                        <h3 className="font-medium text-gray-900 mb-2">Custom Reports</h3>
                        <p className="text-sm text-gray-600 mb-3">Create customized reports with specific date ranges and filters</p>
                        <button className="text-sm bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700">
                            Create Custom Report
                        </button>
                    </div>

                    <p className="text-sm text-gray-500">Full reporting functionality will be implemented here.</p>
                </div>
            </div>
        </div>
    );
};

export default ReportsView;