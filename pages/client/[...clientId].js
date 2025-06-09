import Layout from "../../components/layout";
import {getSession} from "next-auth/react";
import Head from "next/head";
import ClientDetails from "../../components/clientDetails";
import ClientDreams from "../../components/clientDreams";
import ClientSurveys from "../../components/clientSurveys";
import ClientCarePlans from "../../components/clientCarePlans";
import WorkbookToggle from "../../components/workbookToggle";
import {useState} from "react";

export default function User({viewingUserData, pageDataJson}) {
    const {user} = pageDataJson
    const {dreams} = viewingUserData

    const viewingUser = viewingUserData.user
    const [version, setVersion] = useState(viewingUser.isYouth)
    const [simpleModal, setSimpleModal] = useState(false)


    return (
        <Layout title={viewingUser.name || viewingUser.email} session={user} version={version} simpleModalTitle={`Workbook Version Update`}
                simpleModalMessage={`You have now updated this user to the ${version ? "youth" : "adult"} version of the workbook.`} simpleModalLabel={`I understand.`} simpleModal={simpleModal}>

            <Head>
                <title>{viewingUser.name !== "" ? `TTS / Client / ${viewingUser.name}` : `TTS / User / ${viewingUser.email}`}</title>
            </Head>

            <div className={`mt-8`}>
                <WorkbookToggle user={viewingUser} version={version} setVersion={setVersion} setSimpleModal={setSimpleModal}/>
            </div>

            <ClientDetails viewingUser={viewingUser}/>

            <ClientDreams dreams={dreams} viewingUser={viewingUser}/>

            <ClientSurveys viewingUserData={viewingUserData} viewingUser={viewingUser}/>

            <ClientCarePlans user={user} viewingUser={viewingUser} viewingUserData={viewingUserData}/>

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
    const pageDataUrl = baseUrl + "/api/pages/indexPageData?userId=" + session.user._id
    const getPageData = await fetch(pageDataUrl)
    const pageDataJson = await getPageData.json()

    // redirect to profile page if required fields are not complete
    const {county, name, homeCounty, programs} = pageDataJson.user
    if(!county.length || !homeCounty || !programs.length || !name) return  {redirect: {destination: "/profile", permanent: false}}

    //get single client to access email
    const clientUserUrl = baseUrl + "/api/get-user?userId=" + context.query.clientId
    const getClientUser = await fetch(clientUserUrl)
    const clientUserJson = await getClientUser.json()

    // viewing user data
    const userUrl = baseUrl + "/api/pages/clientPageData?clientId=" + context.query.clientId + "&clientEmail=" + clientUserJson.email
    const getViewingUser = await fetch(userUrl)
    const viewingUserJson = await getViewingUser.json()

    return {
        props: {
            pageDataJson,
            viewingUserData: viewingUserJson,
        }
    }

}
