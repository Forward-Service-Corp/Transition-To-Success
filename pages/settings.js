import Layout from "../components/layout";
import {getSession} from "next-auth/react";
import Head from "next/head";

export default function Dreams({custom}) {
    return (
        <Layout title={"Settings"} session={custom}>
            <Head>
                <title>TTS / Settings</title>
            </Head>
        </Layout>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession(context)
    // console.log(session)
    //redirect
    if (!session) return {redirect: {destination: "/login", permanent: false}}

    return {
        props: {
            custom: session
        }
    }

}

