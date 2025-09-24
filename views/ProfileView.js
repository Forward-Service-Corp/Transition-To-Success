import { useSession } from 'next-auth/react';

const ProfileView = ({ navigateToView }) => {
    const { data: session } = useSession();

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">User Profile</h2>
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <p className="text-sm text-gray-900">{session?.name || 'Not provided'}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="text-sm text-gray-900">{session?.email || 'Not provided'}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">User Level</label>
                        <p className="text-sm text-gray-900 capitalize">{session?.level || 'client'}</p>
                    </div>
                </div>
            </div>
            <div className="text-center">
                <p className="text-sm text-gray-500">Additional profile functionality will be implemented here.</p>
            </div>
        </div>
    );
};

export default ProfileView;