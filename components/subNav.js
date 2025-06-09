import React from 'react';
import Link from "next/link";

export default function SubNav({session, handleLogout}) {
    return (
        <div className={`w-full bg-orange-700`}>
            <div className={`px-8 min-w-[640px] max-w-[1280px] m-auto`}>
                <ul className={`flex justify-end text-white font-extralight text-sm`}>
                    <li className={`py-2 px-4 text-xs`}>
                        <Link href={'/profile'}>Profile</Link>
                    </li>
                    <li className={`${session?.level === "admin" ? 'visible' : 'hidden'} py-2 px-4 text-xs`}>
                        <Link href={'/users'}>Users</Link>
                    </li>
                    <li className={`${session?.level === "admin" || session?.level === "coach" ? 'visible' : 'hidden'} py-2 px-4 text-xs`}>
                        <Link href={'/clients'}>My Clients</Link>
                    </li>
                    {/*<li className={`${environment === "testing" || environment === "dev" ? 'visible' : 'hidden'} py-2 px-4 text-xs cursor-pointer`}*/}
                    {/*    onClick={handleDeleteUser}>*/}
                    {/*    Delete Current User*/}
                    {/*</li>*/}
                    <li className={`py-2 px-4 text-xs cursor-pointer`} onClick={handleLogout}>Logout</li>
                </ul>
            </div>
        </div>
    );
}
