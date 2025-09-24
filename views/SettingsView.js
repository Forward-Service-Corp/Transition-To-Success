const SettingsView = ({ navigateToView }) => {

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4">Settings</h2>
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Preferences</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">Email Notifications</span>
                                <input type="checkbox" className="rounded" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">SMS Notifications</span>
                                <input type="checkbox" className="rounded" />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">Auto-save Progress</span>
                                <input type="checkbox" className="rounded" defaultChecked />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Privacy</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">Share Progress with Coach</span>
                                <input type="checkbox" className="rounded" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">Include in Reports</span>
                                <input type="checkbox" className="rounded" defaultChecked />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        <button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 mr-3">
                            Save Settings
                        </button>
                        <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50">
                            Reset to Defaults
                        </button>
                    </div>

                    <p className="text-sm text-gray-500">Additional settings functionality will be implemented here.</p>
                </div>
            </div>
        </div>
    );
};

export default SettingsView;