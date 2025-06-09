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
    const {req} = context;

    const protocol = req.headers['x-forwarded-proto'] || 'http'
    const baseUrl = req ? `${protocol}://${req.headers.host}` : ''

    // user data
    const url =  baseUrl + "/api/get-user?userId=" + session.user._id
    const getUser = await fetch(url)
    const userJson = await getUser.json()

    // redirect to profile page if required fields are not complete
    // const {county, name, homeCounty, programs} = userJson
    // if(!county.length || !homeCounty || !programs.length || !name) return  {redirect: {destination: "/profile", permanent: false}}

    // tasks data
    const getUsersUrl = baseUrl + "/api/get-users"
    const getUsers = await fetch(getUsersUrl)
    const usersJson = await getUsers.json()

    return {
        props: {
            user: userJson,
            users: usersJson
        }
    }

}

