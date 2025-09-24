import React, {useState} from 'react';
import Layout from "../components/layout";
import {getSession} from "next-auth/react";
import Journey1 from "../components/pages/journey1";
import Journey2 from "../components/pages/journey2";
import JourneyYouth1 from "../components/pages/journeyYouth1";
import JourneyYouth2 from "../components/pages/journeyYouth2";
import Head from "next/head";

function Journey({pageDataJson}) {

    const {user} = pageDataJson
    const [currentTab, setCurrentTab] = useState(1)

    return (
        <Layout title={"The Journey"} session={user}>
            <Head>
                <title>TTS / The Journey</title>
            </Head>
            <div className={"flex justify-between mb-4"}>
                <div>
                    <button disabled={currentTab === 1}
                            className={`py-2 px-6 text-white text-xs bg-blue-500 hover:bg-blue-600 ${currentTab === 1 ? "hidden" : "visible"}`}
                            onClick={() => {
                                setCurrentTab(1)
                            }}>Previous
                    </button>
                </div>
                <div>
                    <button disabled={currentTab === 2}
                            className={`py-2 px-6 text-white text-xs bg-blue-500 hover:bg-blue-600 ${currentTab === 2 ? "hidden" : "visible"}`}
                            onClick={() => {
                                setCurrentTab(2)
                            }}>Next
                    </button>
                </div>
            </div>
            <div className={currentTab === 1 ? "visible" : "hidden"}>
                { !user?.isYouth || user?.isYouth === false  ? <Journey1/> : <JourneyYouth1/>}
            </div>
            <div className={currentTab === 2 ? "visible" : "hidden"}>
                { !user?.isYouth || user?.isYouth === false  ? <Journey2/> : <JourneyYouth2/>}
            </div>
        </Layout>
    );
}

export default Journey;

export async function getServerSideProps(context) {
    const session = await getSession(context)
    if (!session) return {redirect: {destination: "/login", permanent: false}}
    const {req} = context;
    const {sub} = session;
    const protocol = req.headers['x-forwarded-proto'] || 'http'
    const baseUrl = req ? `${protocol}://${req.headers.host}` : ''

    // page data
    const pageDataUrl = baseUrl + "/api/pages/indexPageData?userId=" + session.user._id
    const getPageData = await fetch(pageDataUrl)
    const pageDataJson = await getPageData.json()

    // redirect to profile page if required fields are not complete
    // const {county, name, homeCounty, programs} = pageDataJson.user
    // if(!county.length || !homeCounty || !programs.length || !name) return  {redirect: {destination: "/profile", permanent: false}}

    return {
        props: {pageDataJson}
    }

}
