import Layout from "../components/layout";
import {getSession} from "next-auth/react";
import Head from "next/head";
import ReferralContainer from "../components/referralContainer";
import {useState} from "react";
import CarePlansIntro from "../components/carePlansIntro";
import CarePlansInstructions from "../components/carePlansInstructions";
import { Printer } from "phosphor-react";

export default function CarePlans({pageJson}) {

    const [tasks, setTasks] = useState(pageJson.todos)
    const [userReferrals, setUserReferrals] = useState(pageJson.referrals)
    const [sort] = useState('priority')

    const updateTaskHandler = async (newTasks) => {
        setTasks(newTasks)
    }

    return (
        <Layout title={"CARE Plans"} session={pageJson.user}>
            <Head>
                <title>TTS / Care Plans</title>
            </Head>
            <CarePlansIntro/>
            <CarePlansInstructions/>
            

            <div className={`flex justify-between align-middle items-center`}>
                <div><h2 className={"uppercase text-gray-500 my-4 print:hidden"}>Manage Care Plans</h2></div>
                <button
                        onClick={() => window.print()}
                        className={
                          "flex items-center my-3 py-2 px-6 text-white text-xs bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 dark:disabled:bg-gray-800 rounded-lg shadow-xl dark:font-extralight dark:text-white dark:hover:bg-indigo-600 print:hidden"
                        }
                      >
                        <span className={"inline-block mr-2"}>
                          <Printer size={22} />
                        </span>
                        <span className={"inline-block"}>Print All Active Care Plans</span>
                      </button>
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
                                       updateTaskHandler={updateTaskHandler}
                                       modifier={pageJson.user.email}
                                       loggedInUser={pageJson.user}
                                       setUserReferrals={setUserReferrals}/>
                )
            })}

            <h2 className={"uppercase text-gray-500 mb-4 mt-10 print:hidden"}>Archived Care Plans</h2>
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
                    <ReferralContainer key={item._id} 
                                       item={item} 
                                       user={pageJson.user} 
                                       notes={pageJson.notes}
                                       modifier={pageJson.user.email}
                                       tasks={tasks.filter((task) => task.referralId === item._id)}
                                       updateTaskHandler={updateTaskHandler}
                                       loggedInUser={pageJson.user}
                                       setUserReferrals={setUserReferrals}/>
                )
            })}
        </Layout>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession(context)
    if (!session) return {redirect: {destination: "/login", permanent: false}}
    
    if (!session.user?._id) {
        console.error("care-plans.js: Session missing user._id");
        return {redirect: {destination: "/login", permanent: false}}
    }
    
    const {req} = context;

    const protocol = req.headers['x-forwarded-proto'] || 'http'
    const baseUrl = req ? `${protocol}://${req.headers.host}` : ''

    try {
        // page data
        const pageDataUrl = baseUrl + "/api/pages/carePlansPageData?userId=" + session.user._id
        const getPageData = await fetch(pageDataUrl)
        
        if (!getPageData.ok) {
            console.error("care-plans.js: API fetch failed:", getPageData.status);
            return {redirect: {destination: "/login", permanent: false}}
        }
        
        const pageJson = await getPageData.json()

        // redirect to profile page if required fields are not complete
        const {user} = pageJson
        // if(!user.county.length || !user.homeCounty  || !user.programs.length || !user.name) return  {redirect: {destination: "/profile", permanent: false}}

        return {
            props: {pageJson, user}
        }
    } catch (error) {
        console.error("care-plans.js: Error in getServerSideProps:", error);
        return {redirect: {destination: "/login", permanent: false}}
    }

}
