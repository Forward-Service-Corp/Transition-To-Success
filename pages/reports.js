import React from 'react';
import Layout from "../components/layout";
import {getSession} from "next-auth/react";

function Reports({pageDataJson}) {
    const {user} = pageDataJson

    async function getLasReports () {

    }

    return (
        <Layout title={"Reporting"} session={user}>
            <button className={"py-2 px-6 text-white text-sm rounded bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300"}>Download LAS Reports</button>
        </Layout>
    );
}

export default Reports;

export async function getServerSideProps(context) {
    const session = await getSession(context)
    if (!session) return {redirect: {destination: "/login", permanent: false}}
    const {req} = context;

    // set up dynamic url
    const protocol = req.headers['x-forwarded-proto'] || 'http'
    const baseUrl = req ? `${protocol}://${req.headers.host}` : ''

    // page data
    const pageDataUrl = baseUrl + "/api/pages/indexPageData?userId=" + session.user.email
    const getPageData = await fetch(pageDataUrl)
    const pageDataJson = await getPageData.json()

    return {
        props: {pageDataJson}
    }

}
