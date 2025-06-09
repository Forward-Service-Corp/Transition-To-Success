import Layout from "../components/layout";
import {getSession} from "next-auth/react";
import Head from "next/head";
import ReferralContainer from "../components/referralContainer";
import {useState} from "react";
import CarePlansIntro from "../components/carePlansIntro";
import CarePlansInstructions from "../components/carePlansInstructions";

export default function CarePlans({pageJson}) {

    const [tasks, setTasks] = useState(pageJson.todos)
    const [userReferrals, setUserReferrals] = useState(pageJson.referrals)
    const [sort] = useState('priority')

    return (
        <Layout title={"CARE Plans"} session={pageJson.user}>
            <Head>
                <title>TTS / Care Plans</title>
            </Head>
            <CarePlansIntro/>
            <CarePlansInstructions/>

            <div className={`flex justify-between align-middle items-center`}>
                <div><h2 className={"uppercase text-gray-500 my-4"}>Manage Care Plans</h2></div>
            </div>

            {userReferrals.filter(item => !item.hasOwnProperty("archived") || item.archived === "false" || item.archived === null).sort((a, b) => {
                if (sort === 'domain') {
                    return a.domain.localeCompare(b.domain)
                } else {

                    if (a.priority !== null) {
                        a = parseInt(a.priority)
                    } else {
                        a = 0
                    }
                    if (b.priority !== null || true) {
                        b = parseInt(b.priority)
                    } else {
                        b = 0
                    }
                    return b - a

                }

            }).map((item, i) => {
                return (
                    <ReferralContainer key={item._id}
                                       item={item}
                                       user={pageJson.user}
                                       tasks={tasks.filter((task) => task.referralId === item._id)} notes={pageJson.notes} i={i}
                                       setTasks={setTasks}
                                       modifier={pageJson.user.email}
                                       loggedInUser={pageJson.user}
                                       setUserReferrals={setUserReferrals}/>
                )
            })}

            <h2 className={"uppercase text-gray-500 mb-4 mt-10"}>Archived Care Plans</h2>
            {userReferrals.filter(item => item.hasOwnProperty("archived") && item.archived === "true").sort((a, b) => {
                if (sort === 'domain') {
                    return a.domain.localeCompare(b.domain)
                } else {

                    if (a.priority !== null) {
                        a = parseInt(a.priority)
                    } else {
                        a = 0
                    }
                    if (b.priority !== null || true) {
                        b = parseInt(b.priority)
                    } else {
                        b = 0
                    }
                    return b - a

                }
            }).map(item => {
                return (
                    <ReferralContainer key={item._id} item={item} user={pageJson.user} notes={pageJson.notes}
                                       modifier={pageJson.email}
                                       tasks={tasks.filter((task) => task.referralId === item._id)}
                                       loggedInUser={pageJson}
                                       setUserReferrals={setUserReferrals}/>
                )
            })}
        </Layout>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession(context)
    if (!session) return {redirect: {destination: "/login", permanent: false}}
    const {req} = context;
    // const {sub} = session;

    const protocol = req.headers['x-forwarded-proto'] || 'http'
    const baseUrl = req ? `${protocol}://${req.headers.host}` : ''

    // page data
    const pageDataUrl = baseUrl + "/api/pages/carePlansPageData?userId=" + session.user._id
    const getPageData = await fetch(pageDataUrl)
    const pageJson = await getPageData.json()

    // redirect to profile page if required fields are not complete
    const {user} = pageJson
    // if(!user.county.length || !user.homeCounty  || !user.programs.length || !user.name) return  {redirect: {destination: "/profile", permanent: false}}

    return {
        props: {pageJson, user}
    }

}

