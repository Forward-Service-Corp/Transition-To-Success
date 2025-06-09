import Layout from "../components/layout";
import {getSession} from "next-auth/react";
import {useEffect, useState} from "react";
import LasHistory from "../components/lasHistory";
import Head from "next/head";
import LasCurrent from "../components/lasCurrent";

export default function LifeAreaSurveys({user, surveys, incomingDream}) {

    const [currentDream, setCurrentDream] = useState("")
    const [currentDreamId, setCurrentDreamId] = useState("")
    const [surveysList, setSurveysList] = useState([])

    useEffect(() => {
        if (incomingDream.hasDream) {
            setCurrentDream(incomingDream.dream)
            setCurrentDreamId(incomingDream.dreamId)
        }
    }, [incomingDream.dream, incomingDream.dreamId, incomingDream.hasDream])

    useEffect(() => {
        setSurveysList(surveys)
    }, [surveys]);

    return (
        <Layout title={"Life Area Surveys"} session={user}>
            <Head>
                <title>TTS / Life Area Surveys</title>
            </Head>
            <div className={"w-full border-b-[1px] pb-2 mb-5"}>
                <h2 className={"uppercase text-orange-600 "}>Active Life Area Survey</h2>
                {/*<div className={"text-xs dark:text-gray-400"}>Note: You may edit your life area survey for up to 12 hours after it is initially completed.</div>*/}
            </div>
            <LasCurrent user={user} surveys={surveysList} setSurveys={setSurveysList}
                        dreamId={currentDreamId} dream={currentDream}/>
            <div className={"w-full border-b-[1px] pb-2 mb-5 mt-10"}>
                <h2 className={"uppercase text-orange-600 mb-5"}>Life Area Survey History</h2>
            </div>
            <LasHistory user={user} surveys={surveysList} setSurveys={setSurveysList}
                        dreamId={currentDreamId} dream={currentDream}/>
        </Layout>
    )
}

export async function getServerSideProps(context) {

    let dream, dreamId
    if (context.query.dream !== undefined) {
        dream = context.query.dream
        dreamId = context.query.dreamId
    } else {
        dream = ""
        dreamId = ""
    }

    // session check and possible redirect
    const session = await getSession(context)
    if (!session) return {redirect: {destination: "/login", permanent: false}}

    // dynamic url setup
    const {req} = context;
    const {sub} = session;

    const protocol = req.headers['x-forwarded-proto'] || 'http'
    const baseUrl = req ? `${protocol}://${req.headers.host}` : ''

    // page data
    const dataUrl = baseUrl + "/api/pages/surveysPageData?userId=" + session.user._id
    const getData = await fetch(dataUrl)
    const {user, surveys} = await getData.json()

    // redirect to profile page if required fields are not complete
    // if(!user.county.length || !user.homeCounty  || !user.programs.length || !user.name) return  {redirect: {destination: "/profile", permanent: false}}

    return {
        props: {
            user,
            surveys,
            incomingDream: {
                hasDream: context.query.dream !== undefined,
                dream: dream,
                dreamId: dreamId
            }
        }
    }

}

