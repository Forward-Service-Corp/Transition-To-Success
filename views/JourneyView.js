const JourneyView = ({ navigateToView }) => {

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4">The Journey</h2>
                <div className="space-y-4">
                    <p className="text-gray-600">Track your progress and milestones on your path to success.</p>

                    <div className="bg-gradient-to-r from-orange-100 to-orange-50 p-6 rounded-lg border border-orange-200">
                        <h3 className="font-medium text-orange-900 mb-3">Your Progress Journey</h3>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <div className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0"></div>
                                <span className="text-sm text-gray-700">Started your transition journey</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0"></div>
                                <span className="text-sm text-gray-700">Completed initial assessment</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-4 h-4 bg-yellow-400 rounded-full flex-shrink-0"></div>
                                <span className="text-sm text-gray-700">In progress: Life area surveys</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-4 h-4 bg-gray-300 rounded-full flex-shrink-0"></div>
                                <span className="text-sm text-gray-500">Upcoming: CARE plan development</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-sm text-gray-500">Full journey tracking functionality will be implemented here.</p>
                </div>
            </div>
        </div>
    );
};

export default JourneyView;