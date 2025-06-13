import Layout from "../../components/layout";
import {getSession} from "next-auth/react";
import ReferralContainer from "../../components/referralContainer";
import { useState, useEffect } from "react";

export default function CarePlan({pageDataJson}) {
    const {user, referrals} = pageDataJson
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        // Fetch tasks when component mounts
        const fetchTasks = async () => {
            try {
                const response = await fetch(`/api/get-tasks?userId=${user._id}`);
                const data = await response.json();
                setTasks(data);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        if (user && user._id) {
            fetchTasks();
        }
    }, [user]);

    return (
        <Layout title={"Create Care Plan"} session={user}>
            {referrals.map(item => {
                return (
                    <ReferralContainer 
                        key={item._id} 
                        item={item} 
                        user={user} 
                        tasks={tasks} 
                        setTasks={setTasks}
                        notes={[]}
                        modifier={user.email}
                        loggedInUser={user}
                    />
                )
            })}
        </Layout>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession(context)
    if (!session) return {redirect: {destination: "/login", permanent: false}}
    const {req} = context;

    const protocol = req.headers['x-forwarded-proto'] || 'http'
    const baseUrl = req ? `${protocol}://${req.headers.host}` : ''

    // page data
    const pageDataUrl = baseUrl + "/api/pages/indexPageData?userId=" + session.user.email
    const getPageData = await fetch(pageDataUrl)
    const pageDataJson = await getPageData.json()

    // redirect to profile page if required fields are not complete
    const {county, name, homeCounty, programs} = pageDataJson.user
    if(!county.length || !homeCounty || !programs.length || !name) return  {redirect: {destination: "/profile", permanent: false}}

    return {
        props: {pageDataJson}
    }

}
