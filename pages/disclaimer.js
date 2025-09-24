import React from 'react';
import Layout from "../components/layout";
import {getSession} from "next-auth/react";
import Head from "next/head";

function Disclaimer({pageDataJson}) {
    const {user} = pageDataJson

    return (
        <Layout title={"Data Usage Disclaimer"} session={user}>
            <Head>
                <title>TTS / Data Disclaimer</title>
            </Head>
            <div className={`p-4 my-8 dark:text-white`}>
                <p className={`text-xl uppercase`}>Disclaimer</p>
                <p className={`pb-4 dark:font-extralight`}>
                    You are logged into an application owned by Forward Service Corporation. The information
                    collected by this application is protected and will not be sold or shared with any third
                    parties. We will use the data collected to improve our services and understand how people are
                    utilizing our programs. By accessing this site, you consent to FSC using your data in this way.
                </p>
            </div>
        </Layout>
    );
}

export default Disclaimer;

export async function getServerSideProps(context) {
    const session = await getSession(context)
    if (!session) return {redirect: {destination: "/login", permanent: false}}
    const {req} = context;

    // set up dynamic url
    const protocol = req.headers['x-forwarded-proto'] || 'http'
    const baseUrl = req ? `${protocol}://${req.headers.host}` : ''

    // page data
    const pageDataUrl = baseUrl + "/api/pages/indexPageData?userId=" + session.user._id
    const getPageData = await fetch(pageDataUrl)
    const pageDataJson = await getPageData.json()

    return {
        props: {pageDataJson}
    }

}
