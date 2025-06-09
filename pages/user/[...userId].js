import Layout from "../../components/layout";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import NewEmailAssignment from "../../components/newEmailAssignment";
import CoachAssignments from "../../components/coachAssignments";
import WorkbookToggle from "../../components/workbookToggle";
import UserPersonalDetails from "../../components/userPersonalDetails";
import UserRole from "../../components/userRole";

export default function User({viewingUser, pageDataJson, coachesJson, viewingUserClients}) {

    const {user} = pageDataJson
    const [viewingUserState, setViewingUserState] = useState(viewingUser)
    const [role, setRole] = useState(viewingUser.level)
    const [version, setVersion] = useState(viewingUser.isYouth)
    const [clients, setClients] = useState(viewingUserClients || [])
    const [simpleModal, setSimpleModal] = useState(false)

    async function saveRole(newRole) {
        await fetch("/api/save-role?userId=" + viewingUser._id + "&role=" + newRole)
            .then(res => res.json())
            .catch(err => console.warn(err))
    }

    async function getClients() {
        await fetch("/api/get-clients?userId=" + viewingUser._id)
            .then(res => res.json())
            .then(res => {setClients(res)})
            .catch(err => console.warn(err))
    }

    async function updateRoleInformation(role){
        await setRole(role)
        await saveRole(role)
    }

    async function terminationPattern(){
        await setRole("terminated coach")
        await saveRole("terminated coach")
        await terminateCoach(viewingUser._id)
        await getClients()
    }

    async function terminateCoach(coachId){
        await fetch("/api/terminate-coach?coachId=" + coachId)
            .then(res => res.json())
            .then((res) => {console.log(res)})
            .catch(err => console.warn(err))
    }

    const title = `TTS / User / ${viewingUser.name || viewingUser.email}`

    return (
        <Layout title={viewingUser.name || viewingUser.email} session={user} version={version} simpleModalTitle={`Workbook Version Update`}
                simpleModalMessage={`You have now updated this user to the ${version ? "youth" : "adult"} version of the workbook.`} simpleModalLabel={`I understand.`} simpleModal={simpleModal}>
            <Head>
                <title>{title}</title>
            </Head>

            <div className={`mt-8 mb-8`}>
                <WorkbookToggle user={viewingUser} version={version} setVersion={setVersion} setSimpleModal={setSimpleModal}/>
            </div>
            <UserPersonalDetails viewingUser={viewingUser} role={role}/>
            <UserRole
                clients={clients}
                setClients={setClients}
                terminationPattern={terminationPattern}
                updateRoleInformation={updateRoleInformation}
                role={role}
                setRole={setRole}
                viewingUser={viewingUser}
            />
            <CoachAssignments coachesJson={coachesJson} viewingUser={viewingUser}/>
            <NewEmailAssignment viewingUserState={viewingUserState} setViewingUserState={setViewingUserState}/>

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

    // viewing user data
    const userUrl = baseUrl + "/api/get-user?userId=" + context.query.userId
    const getViewingUser = await fetch(userUrl)
    const viewingUser = await getViewingUser.json()

    // viewing user clients data
    const clientsUrl = baseUrl + "/api/get-clients?coachId=" + context.query.userId
    const getViewingClients = await fetch(clientsUrl)
    const viewingUserClients = await getViewingClients.json()

    // all coaches data
    const coachesUrl = baseUrl + "/api/get-all-coaches"
    const getCoaches = await fetch(coachesUrl)
    const coachesJson = await getCoaches.json()

    return {
        props: {pageDataJson, coachesJson, viewingUser, session, viewingUserClients}
    }

}
