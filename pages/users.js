import Layout from "../components/layout";
import {getSession} from "next-auth/react";
import {useState} from "react";
import UsersTable from "../components/usersTable";
import Head from "next/head";

export default function Users({user, users}) {
    const [modalState, setModalState] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")

    return (
        <Layout title={"Users"} session={user} modalState={modalState} setModalState={setModalState}>
            <Head>
                <title>TTS Users</title>
            </Head>
            <UsersTable users={users} setModalState={setModalState} searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </Layout>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession(context)
    if (!session) return {redirect: {destination: "/login", permanent: false}}
    
    if (!session.user?._id) {
        console.error("users.js: Session missing user._id");
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
            console.error("users.js: get-user fetch failed:", getUser.status);
            return {redirect: {destination: "/login", permanent: false}}
        }
        
        const userJson = await getUser.json()

        // tasks data
        const getUsersUrl = baseUrl + "/api/get-users"
        const getUsers = await fetch(getUsersUrl)
        
        if (!getUsers.ok) {
            console.error("users.js: get-users fetch failed:", getUsers.status);
            return {redirect: {destination: "/login", permanent: false}}
        }
        
        const usersJson = await getUsers.json()

        return {
            props: {
                user: userJson,
                users: usersJson
            }
        }
    } catch (error) {
        console.error("users.js: Error in getServerSideProps:", error);
        return {redirect: {destination: "/login", permanent: false}}
    }

}

