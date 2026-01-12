import React, {useState} from 'react';
import AssignedClient from "./assignedClient";
import RoleUpdateButton from "./roleUpdateButton";

function UserRole({terminationPattern, role, setRole, viewingUser, clients, setClients, loggedInUser, canManageServices, setCanManageServices}) {
    const [toggling, setToggling] = useState(false);

    // Only show toggle if logged in user is admin and viewing user is coach or admin
    const showServiceToggle = loggedInUser?.level === 'admin' && (role === 'coach' || role === 'admin');

    async function toggleServiceManagement() {
        if (toggling) return;
        
        setToggling(true);
        const newValue = !canManageServices;
        
        try {
            const response = await fetch("/api/toggle-service-management", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: viewingUser._id,
                    enabled: newValue
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.user) {
                    setCanManageServices(data.user.canManageServices || false);
                }
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to update permission');
            }
        } catch (err) {
            console.error('Error toggling service management:', err);
            alert('Failed to update permission');
        } finally {
            setToggling(false);
        }
    }

    return (
        <div className={"bg-gray-100 p-6 mb-5 rounded dark:bg-black dark:bg-opacity-70"}>
            <div className={"flex justify-between items-center border-0 border-b py-2 mb-4"}>
                <div>
                    <h2 className={"uppercase text-gray-500 dark:text-white"}>Role Assignment</h2>
                </div>
                <button
                    className={`${role === "coach" ? 'visible' : 'hidden'} text-xs rounded-full text-white px-4 py-2 bg-red-500`}
                    onClick={terminationPattern}>X Terminate coach</button>
            </div>
            <div className={`grid grid-cols-5 gap-4`}>
                <RoleUpdateButton role={role} title={'client'} id={viewingUser._id} setRole={setRole} />
                <RoleUpdateButton role={role} title={'coach'} id={viewingUser._id} setRole={setRole} />
                <RoleUpdateButton role={role} title={'admin'} id={viewingUser._id} setRole={setRole} />
                <RoleUpdateButton role={role} title={'inactive client'} id={viewingUser._id} setRole={setRole} />
                <RoleUpdateButton role={role} title={'terminated coach'} id={viewingUser._id} setRole={setRole} />

            </div>
            
            {/* Service Management Permission Toggle */}
            {showServiceToggle && (
                <div className={"flex justify-between items-center border-0 border-y py-4 mb-4 mt-8"}>
                    <div>
                        <h2 className={"uppercase text-gray-500 dark:text-white mb-2"}>Service Management Permission</h2>
                        <p className={"text-xs text-gray-600 dark:text-gray-400"}>
                            Allow this {role} to manage care network services (add, edit, delete)
                        </p>
                    </div>
                    <div className={"flex items-center"}>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={canManageServices || false}
                                onChange={toggleServiceManagement}
                                disabled={toggling}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                                {canManageServices ? 'Enabled' : 'Disabled'}
                            </span>
                        </label>
                    </div>
                </div>
            )}

            <div className={`${(role === 'coach'|| role === 'admin') ? 'visible' : 'hidden'}`}>
                <div className={"flex justify-between items-center border-0 border-y py-2 mb-4 mt-8"}>
                    <div>
                        <h2 className={"uppercase text-gray-500 dark:text-white"}>Current Clients</h2>
                    </div>
                </div>
                <div  className={`grid grid-cols-4 gap-4`}>
                    {clients.map((client) => (
                    <AssignedClient key={client._id} client={client} role={role} viewingUser={viewingUser} setCurrentClients={setClients} />
                ))}
                </div>
            </div>
        </div>
    );
}

export default UserRole;
