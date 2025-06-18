import React, {useEffect, useState} from 'react';
import ReferralContainer from "./referralContainer";

function ClientCarePlans({user, viewingUser, viewingUserData}) {

    const [userReferrals, setUserReferrals] = useState(viewingUserData.referrals)

    async function getUserReferrals() {
        // const id = clientId === undefined ? user.email : clientId
        const referrals = await fetch("/api/get-referrals?userId=" + viewingUser._id)
            .then(res => res.json())
        await setUserReferrals(referrals)
    }

    useEffect(() => {
        getUserReferrals().then()
    }, [])

    return (
        <div className={"mt-5 p-6 border rounded dark:border-none dark:bg-black dark:bg-opacity-70 dark:text-white dark:rounded-lg dark:shadow-xl"}>
            <h2 className={"uppercase text-gray-500 mb-4"}>Manage Care Plans</h2>
            {userReferrals?.filter(item => !item.hasOwnProperty("archived") || item.archived === "false").sort((a, b) => {
                return b.domain.localeCompare(a.domain)
            }).map(item => {
                return (
                    <ReferralContainer key={item._id} item={item} user={viewingUser} notes={viewingUserData.notes}
                                       loggedInUser={user}
                                       tasks={viewingUserData.tasks.filter((task) => task.referralId === item._id)}
                                       modifier={user.email}
                                       setUserReferrals={setUserReferrals}/>
                )
            })}

            <h2 className={"uppercase text-gray-500 mb-4 mt-10"}>Archived Care Plans</h2>
            {userReferrals?.filter(item => item.hasOwnProperty("archived") && item.archived === "true").sort((a, b) => {
                return b.domain.localeCompare(a.domain)
            }).map(item => {
                return (
                    <ReferralContainer key={item._id} item={item} user={viewingUser} notes={viewingUserData.notes}
                                       loggedInUser={user}
                                       tasks={viewingUserData.tasks.filter((task) => task.referralId === item._id)}
                                       modifier={user.email}
                                       setUserReferrals={setUserReferrals}/>
                )
            })}
        </div>
    );
}

export default ClientCarePlans;
