import Layout from "../components/layout";
import {getSession} from "next-auth/react";
import Head from "next/head";
import ClientsTable from "../components/clientsTable";

export default function Clients({userJson, usersJson}) {
    console.log(usersJson)
    return (
        <Layout title={"My Clients"} session={userJson}>
            <Head>
                <title>TTS / My Clients</title>
            </Head>
            <ClientsTable users={usersJson} coach={userJson._id}/> 
        </Layout>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession(context)
    if (!session) return {redirect: {destination: "/login", permanent: false}}
    
    if (!session.user?._id) {
        console.error("clients.js: Session missing user._id");
        return {redirect: {destination: "/login", permanent: false}}
    }
    
    const {req} = context;

    const protocol = req.headers['x-forwarded-proto'] || 'http'
    const baseUrl = req ? `${protocol}://${req.headers.host}` : ''

    try {
        // user data
        const url =  baseUrl + "/api/get-user?userId=" + session.user._id
        const getUser = await fetch(url)
        
        if (!getUser.ok) {
            console.error("clients.js: get-user fetch failed:", getUser.status);
            return {redirect: {destination: "/login", permanent: false}}
        }
        
        const userJson = await getUser.json()

        // clients data
        const getUsersUrl = baseUrl + "/api/get-clients?coachId=" + session.user._id
        const getUsers = await fetch(getUsersUrl)
        
        if (!getUsers.ok) {
            console.error("clients.js: get-clients fetch failed:", getUsers.status);
            return {redirect: {destination: "/login", permanent: false}}
        }
        
        const usersJson = await getUsers.json()

        // redirect to the profile page if required fields are not complete
        if(!userJson?.county.length || !userJson?.homeCounty  || !userJson?.programs.length || !userJson?.name) {
            return {redirect: {destination: "/profile", permanent: false}}
        }

        return {
            props: {userJson, usersJson}
        }
    } catch (error) {
        console.error("clients.js: Error in getServerSideProps:", error);
        return {redirect: {destination: "/login", permanent: false}}
    }

}

