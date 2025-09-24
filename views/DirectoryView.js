const DirectoryView = ({ navigateToView }) => {

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4">CARE Network Directory</h2>
                <div className="space-y-4">
                    <p className="text-gray-600">Connect with resources and support services in your community.</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="bg-purple-50 p-4 rounded border border-purple-200">
                            <h3 className="font-medium text-purple-900 mb-2">Healthcare Services</h3>
                            <p className="text-sm text-purple-700 mb-3">Medical, dental, and mental health providers</p>
                            <button className="text-sm bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700">
                                Browse
                            </button>
                        </div>

                        <div className="bg-indigo-50 p-4 rounded border border-indigo-200">
                            <h3 className="font-medium text-indigo-900 mb-2">Educational Resources</h3>
                            <p className="text-sm text-indigo-700 mb-3">Schools, training programs, and educational support</p>
                            <button className="text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">
                                Browse
                            </button>
                        </div>

                        <div className="bg-teal-50 p-4 rounded border border-teal-200">
                            <h3 className="font-medium text-teal-900 mb-2">Employment Services</h3>
                            <p className="text-sm text-teal-700 mb-3">Job placement, career counseling, and vocational training</p>
                            <button className="text-sm bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700">
                                Browse
                            </button>
                        </div>
                    </div>

                    <p className="text-sm text-gray-500 mt-6">Full directory functionality will be implemented here.</p>
                </div>
            </div>
        </div>
    );
};

export default DirectoryView;