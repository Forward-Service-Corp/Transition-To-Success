import Layout from "../components/layout";
import {getSession} from "next-auth/react";
import {useEffect, useState} from "react";
import SavedDreams from "../components/savedDreams";
import Head from "next/head";
import DreamIntro from "../components/pages/dreamIntro";
import DreamForm from "../components/dreamForm";
import {useSession} from "next-auth/react";

export default function Dreams({user, dreams}) {

    // console.log(user)
    const [savedDreams, setSavedDreams] = useState([])
    const [simpleModal, setSimpleModal] = useState(false)
    const [currentTab, setCurrentTab] = useState("active")

    async function getDreams() {

        await fetch("/api/get-dreams?userId=" + user._id)
            .then(res => res.json())
            .then(res => { setSavedDreams(res) })
            .catch(err => console.warn(err.json()))
    }

    useEffect(() => {
        getDreams().then()
    }, [dreams]);

    return (
        <Layout title={"Dreams"} session={user} simpleModal={simpleModal} simpleModalTitle={`Great Work!`} simpleModalMessage={`You just created a new dream.`} simpleModalLabel={`Awesome!`}>
            <Head>
                <title>TTS / Dreams</title>
            </Head>
            <div className={""}>
                <div className={"grid grid-cols-1 md:grid-cols-2 gap-4"}>
                    <DreamIntro/>
                    <DreamForm setSavedDreams={setSavedDreams} user={user} setSimpleModal={setSimpleModal} getDreams={getDreams} />
                </div>
                <div className={"bg-gray-100 p-3 my-6 dark:p-8 dark:bg-[#111111] dark:text-white dark:text-center dark:rounded-2xl dark:bg-opacity-40 dark:shadow-2xl"}>
                    <h2 className={"uppercase"}><span className={"text-orange-500"}>Hint: </span>Completing
                        a Life Area Survey</h2>
                    <p className={"text-sm"}>Completing a Life Area Survey is easy! Simply choose a dream you would like
                        to survey and click the &quot;Life Area Survey&quot; button to continue to a new survey
                        page.</p>
                </div>
                <div className={"bg-gray-100 p-3 mb-3 dark:bg-opacity-0 dark:text-white"}>
                    My <select className={"text-xs border-gray-300 rounded dark:bg-black dark:border-0 "}
                               id={"currentTab"}
                               onChange={(e) => {
                                   setCurrentTab(e.target.value)
                               }}>
                    <option value="active">Active</option>
                    <option value="complete">Complete</option>
                    <option value="archived">Archived</option>
                </select> Dreams
                </div>
                <div className={`${currentTab === "active" ? "visible" : "hidden"}`}>
                    <SavedDreams savedDreams={savedDreams?.filter(dream => dream.status === "active")} setSavedDreams={setSavedDreams}/>
                </div>
                <div className={`${currentTab === "complete" ? "visible" : "hidden"}`}>
                    <SavedDreams savedDreams={savedDreams?.filter(dream => dream.status === "complete")} setSavedDreams={setSavedDreams}/>
                </div>
                <div className={`${currentTab === "archived" ? "visible" : "hidden"}`}>
                    <SavedDreams savedDreams={savedDreams?.filter(dream => dream.status === "archived")} setSavedDreams={setSavedDreams}/>
                </div>
            </div>
        </Layout>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession(context)

    if (!session) return {redirect: {destination: "/login", permanent: false}}
    const {req} = context;
    console.log("dreams ", session.user)
    // set up dynamic url
    const protocol = req.headers['x-forwarded-proto'] || 'http'
    const baseUrl = req ? `${protocol}://${req.headers.host}` : ''

    // page data
    const dataUrl = baseUrl + "/api/pages/dreamsPageData?userId=" + session.user._id
    const getData = await fetch(dataUrl)
    const {user, dreams} = await getData.json()

    // redirect to profile page if required fields are not complete
    // if(!user.county.length || !user.homeCounty  || !user.programs.length || !user.name) return  {redirect: {destination: "/profile", permanent: false}}

    return {
        props: {user, dreams}
    }

}

