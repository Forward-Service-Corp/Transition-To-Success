import React, {useEffect, useState, useCallback} from 'react';
import ReferralContainer from "./referralContainer";

function ClientCarePlans({user, viewingUser, viewingUserData}) {

    const [userReferrals, setUserReferrals] = useState(viewingUserData.referrals)
    const [tasks, setTasks] = useState(viewingUserData.tasks)

    const getUserReferrals = useCallback(async () => {
        // const id = clientId === undefined ? user.email : clientId
        const referrals = await fetch("/api/get-referrals?userId=" + viewingUser._id)
            .then(res => res.json())
        await setUserReferrals(referrals)
    }, [viewingUser._id])

    const updateTaskHandler = async (newTasks) => {
        setTasks(newTasks)
    }

    useEffect(() => {
        getUserReferrals().then()
    }, [getUserReferrals])

    return (
        <div className={"mt-5 p-6 border rounded dark:border-none dark:bg-black dark:bg-opacity-70 dark:text-white dark:rounded-lg dark:shadow-xl"}>
            <h2 className={"uppercase text-gray-500 mb-4"}>Manage Care Plans</h2>
            {userReferrals?.filter(item => !item.hasOwnProperty("archived") || item.archived === "false").sort((a, b) => {
                return b.domain.localeCompare(a.domain)
            }).map(item => {
                return (
                    <ReferralContainer key={item._id} item={item} user={viewingUser} notes={viewingUserData.notes}
                                       loggedInUser={user}
                                       tasks={tasks.filter((task) => task.referralId === item._id)}
                                       modifier={user.email}
                                       setUserReferrals={setUserReferrals}
                                       updateTaskHandler={updateTaskHandler}/>
                )
            })}

            <h2 className={"uppercase text-gray-500 mb-4 mt-10"}>Archived Care Plans</h2>
            {userReferrals?.filter(item => item.hasOwnProperty("archived") && item.archived === "true").sort((a, b) => {
                return b.domain.localeCompare(a.domain)
            }).map(item => {
                return (
                    <ReferralContainer key={item._id} item={item} user={viewingUser} notes={viewingUserData.notes}
                                       loggedInUser={user}
                                       tasks={tasks.filter((task) => task.referralId === item._id)}
                                       modifier={user.email}
                                       setUserReferrals={setUserReferrals}
                                       updateTaskHandler={updateTaskHandler}/>
                )
            })}
        </div>
    );
}

export default ClientCarePlans;
