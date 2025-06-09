import Layout from "../components/layout";
import {getSession} from "next-auth/react";
import Head from "next/head";
import ClientsTable from "../components/clientsTable";

export default function Clients({userJson, usersJson}) {

    return (
        <Layout title={"My Clients"} session={userJson}>
            <Head>
                <title>TTS / My Clients</title>
            </Head>
            <ClientsTable users={usersJson}/>
        </Layout>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession(context)
    if (!session) return {redirect: {destination: "/login", permanent: false}}
    const {req} = context;

    const protocol = req.headers['x-forwarded-proto'] || 'http'
    const baseUrl = req ? `${protocol}://${req.headers.host}` : ''

    // user data
    const url =  baseUrl + "/api/get-user?userId=" + session.user._id
    const getUser = await fetch(url)
    const userJson = await getUser.json()

    console.log(userJson)

    // clients data
    const getUsersUrl = baseUrl + "/api/get-clients?coachId=" + session.user._id
    const getUsers = await fetch(getUsersUrl)
    const usersJson = await getUsers.json()
    console.log(usersJson)

    // redirect to profile page if required fields are not complete

    if(!userJson?.county.length || !userJson?.homeCounty  || !userJson?.programs.length || !userJson?.name) return  {redirect: {destination: "/profile", permanent: false}}

    return {
        props: {userJson, usersJson}
    }

}

