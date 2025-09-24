const DisclaimerView = ({ navigateToView }) => {
    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4">Data Usage Disclaimer</h2>
                <div className="prose max-w-none">
                    <p className="mb-4">
                        You are accessing an application owned by Forward Service Corporation. The information
                        collected by this application is protected and will not be sold or shared with any third
                        parties.
                    </p>
                    <p className="mb-4">
                        We will use the data collected to improve our services and understand how people are
                        utilizing our programs. By accessing this site, you consent to FSC using your data in this way.
                    </p>
                    <p className="text-sm text-gray-600">
                        For questions about our data usage policies, please contact Forward Service Corporation
                        at (608) 665-9362.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DisclaimerView;