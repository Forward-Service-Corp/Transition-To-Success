const MapOfMyDreamsView = ({ navigateToView }) => {

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4">Map of My Dreams</h2>
                <div className="space-y-4">
                    <p className="text-gray-600">Visualize your dreams and create a roadmap to achieve your goals.</p>

                    <div className="bg-gradient-to-br from-orange-100 via-orange-50 to-yellow-50 p-6 rounded-lg border border-orange-200">
                        <h3 className="font-medium text-orange-900 mb-4 text-center">Your Dream Map</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-orange-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                                    <span className="text-orange-800 font-semibold">🏠</span>
                                </div>
                                <h4 className="font-medium text-orange-900">Housing Goals</h4>
                                <p className="text-sm text-orange-700">Stable, safe housing</p>
                            </div>
                            <div className="text-center">
                                <div className="w-20 h-20 bg-yellow-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                                    <span className="text-yellow-800 font-semibold">🎓</span>
                                </div>
                                <h4 className="font-medium text-yellow-900">Education Goals</h4>
                                <p className="text-sm text-yellow-700">Learning and growth</p>
                            </div>
                            <div className="text-center">
                                <div className="w-20 h-20 bg-green-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                                    <span className="text-green-800 font-semibold">💼</span>
                                </div>
                                <h4 className="font-medium text-green-900">Career Goals</h4>
                                <p className="text-sm text-green-700">Meaningful employment</p>
                            </div>
                            <div className="text-center">
                                <div className="w-20 h-20 bg-blue-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                                    <span className="text-blue-800 font-semibold">❤️</span>
                                </div>
                                <h4 className="font-medium text-blue-900">Wellness Goals</h4>
                                <p className="text-sm text-blue-700">Health and happiness</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center space-x-3">
                        <button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
                            Update My Dreams
                        </button>
                        <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50">
                            View Progress
                        </button>
                    </div>

                    <p className="text-sm text-gray-500 text-center">Full dream mapping functionality will be implemented here.</p>
                </div>
            </div>
        </div>
    );
};

export default MapOfMyDreamsView;