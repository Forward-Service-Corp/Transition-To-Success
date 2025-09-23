import Layout from "../components/layout";
import {getServerSession} from "next-auth/next";
import {authOptions} from "./api/auth/[...nextauth]";
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
    const session = await getServerSession(context.req, context.res, authOptions)
    // console.log(session)
    //redirect
    if (!session) return {redirect: {destination: "/login", permanent: false}}

    return {
        props: {
            custom: session
        }
    }

}

