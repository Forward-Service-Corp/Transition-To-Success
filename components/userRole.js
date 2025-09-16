import React from 'react';
import AssignedClient from "./assignedClient";
import RoleUpdateButton from "./roleUpdateButton";

function UserRole({terminationPattern, role, setRole, viewingUser, clients, setClients}) {

    return (
        <div className={"bg-gray-100 p-6 mb-5 rounded"}>
            <div className={"flex justify-between items-center border-0 border-b py-2 mb-4"}>
                <div>
                    <h2 className={"uppercase text-gray-500"}>Role Assignment</h2>
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
            <div className={`${(role === 'coach'|| role === 'admin') ? 'visible' : 'hidden'}`}>
                <div className={"flex justify-between items-center border-0 border-y py-2 mb-4 mt-8"}>
                    <div>
                        <h2 className={"uppercase text-gray-500"}>Current Clients</h2>
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
