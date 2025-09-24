const NewLifeAreaSurveyView = ({ navigateToView }) => {

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4">New Life Area Survey</h2>
                <div className="space-y-4">
                    <p className="text-gray-600">Complete a new life area assessment to track your progress and identify areas for support.</p>

                    <div className="bg-blue-50 p-4 rounded border border-blue-200">
                        <h3 className="font-medium text-blue-900 mb-2">Survey Instructions</h3>
                        <p className="text-sm text-blue-700">This survey will take approximately 15-20 minutes to complete. You can save your progress and return later if needed.</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Life Area</label>
                            <select className="w-full border border-gray-300 rounded px-3 py-2">
                                <option value="">Choose a life area to assess</option>
                                <option value="housing">Housing & Safety</option>
                                <option value="education">Education & Learning</option>
                                <option value="employment">Employment & Career</option>
                                <option value="health">Health & Wellness</option>
                                <option value="relationships">Relationships & Support</option>
                                <option value="finances">Financial Management</option>
                                <option value="legal">Legal Issues</option>
                                <option value="transportation">Transportation</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Assessment Date</label>
                            <input type="date" className="border border-gray-300 rounded px-3 py-2" defaultValue={new Date().toISOString().split('T')[0]} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                            <textarea rows="3" className="w-full border border-gray-300 rounded px-3 py-2" placeholder="Any additional notes or context for this assessment"></textarea>
                        </div>

                        <div className="flex space-x-3">
                            <button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
                                Start Survey
                            </button>
                            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50" onClick={() => navigateToView && navigateToView('LifeAreaSurveys')}>
                                Back to Surveys
                            </button>
                        </div>
                    </div>

                    <p className="text-sm text-gray-500">Full survey form functionality will be implemented here.</p>
                </div>
            </div>
        </div>
    );
};

export default NewLifeAreaSurveyView;