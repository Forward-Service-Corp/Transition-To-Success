const AddNewReferralView = ({ navigateToView }) => {

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4">Add New Referral</h2>
                <div className="space-y-4">
                    <p className="text-gray-600">Refer a new client to the Transition to Success program.</p>

                    <form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <input type="text" className="w-full border border-gray-300 rounded px-3 py-2" placeholder="Enter first name" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input type="text" className="w-full border border-gray-300 rounded px-3 py-2" placeholder="Enter last name" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input type="email" className="w-full border border-gray-300 rounded px-3 py-2" placeholder="Enter email address" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input type="tel" className="w-full border border-gray-300 rounded px-3 py-2" placeholder="Enter phone number" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Referral Source</label>
                            <select className="w-full border border-gray-300 rounded px-3 py-2">
                                <option value="">Select referral source</option>
                                <option value="dhs">Department of Human Services</option>
                                <option value="school">School District</option>
                                <option value="healthcare">Healthcare Provider</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                            <textarea rows="4" className="w-full border border-gray-300 rounded px-3 py-2" placeholder="Additional notes or information about the referral"></textarea>
                        </div>

                        <div className="flex space-x-3">
                            <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
                                Submit Referral
                            </button>
                            <button type="button" className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50">
                                Cancel
                            </button>
                        </div>
                    </form>

                    <p className="text-sm text-gray-500">Full referral processing functionality will be implemented here.</p>
                </div>
            </div>
        </div>
    );
};

export default AddNewReferralView;