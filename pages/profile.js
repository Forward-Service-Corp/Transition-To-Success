import Layout from "../components/layout";
import {getSession} from "next-auth/react";
import {useEffect, useState} from "react";
import ProfilePrograms from "../components/profilePrograms";
import ProfilePersonalDetails from "../components/profilePersonalDetails";
import Head from "next/head";
import ProfileResourceCounties from "../components/profileResourceCounties";
import ProfileCoaches from "../components/profileCoaches";
import ProfileWorkbook from "../components/profileWorkbook";
import ProfileFieldsWarning from "../components/profileFieldsWarning";
import ProfilePhoneMessage from "../components/profilePhoneMessage";

export default function Profile({user}) {

    const [version, setVersion] = useState(user?.isYouth)
    const [name, setName] = useState(user?.name ? user?.name : "")
    const [street, setStreet] = useState(user?.street ? user?.street : "")
    const [city, setCity] = useState(user?.city ? user?.city : "")
    const [state, setState] = useState(user?.state ? user?.state : "")
    const [homeCounty, setHomeCounty] = useState(user?.homeCounty ? user?.homeCounty : "")
    const [zip, setZip] = useState(user?.zip ? user?.zip : "")
    const [programs, setPrograms] = useState(user?.programs ? user?.programs : [])
    const [counties, setCounties] = useState(user?.county ? user?.county : [])
    const [email] = useState(user?.email)
    const [phone, setPhone] = useState(user?.phone ? user?.phone : "")
    const [formattedNumber, setFormattedNumber] = useState("");
    const [simpleModal, setSimpleModal] = useState(false)
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);
    const [fieldsWarning, setFieldsWarning] = useState(false);
    const [changeConfirm, setChangeConfirm] = useState(false)
    const isBrowser = () => typeof window !== 'undefined'; //The approach recommended by Next.js

    function scrollToTop() {
        if (!isBrowser()) return;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Check if all required fields are filled
    useEffect(() => {
        if (name && homeCounty && counties.length && programs.length) {
            setIsButtonEnabled(true);
            setFieldsWarning(false);
        } else {
            setIsButtonEnabled(false);
            setFieldsWarning(true);
        }
    }, [name, homeCounty, counties, programs, phone]);

    async function savePersonalDetails() {
        await fetch("/api/save-personal-details", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name, street, city, state, zip, homeCounty, counties, formattedNumber, programs, version,
                userId: user._id
            })
        })
        await setChangeConfirm(true)
        setTimeout(() => {
            setChangeConfirm(false)
            scrollToTop()
        }, 3000)
    }

    return (
        <Layout title={"Profile"} session={user} version={version} simpleModalTitle={`Workbook Version Update`}
                background={false}
                simpleModalMessage={`You are now using the ${version ? "youth" : "adult"} version of the workbook.`}
                simpleModalLabel={`I understand.`} simpleModal={simpleModal}>
            <Head>
                <title>TTS / My Profile</title>
            </Head>
            <ProfileFieldsWarning name={name}
                                  homeCounty={homeCounty}
                                  counties={counties}
                                  programs={programs}
                                  fieldsWarning={fieldsWarning}/>
            <ProfilePhoneMessage phone={phone}/>
            <ProfilePersonalDetails user={user}
                                    name={name}
                                    setName={setName}
                                    street={street}
                                    setStreet={setStreet}
                                    city={city}
                                    setCity={setCity}
                                    state={state}
                                    setState={setState}
                                    homeCounty={homeCounty}
                                    setHomeCounty={setHomeCounty}
                                    zip={zip}
                                    setZip={setZip}
                                    email={email}
                                    phone={phone}
                                    setPhone={setPhone}
                                    setFormattedNumber={setFormattedNumber}/>
            <ProfilePrograms programs={programs} setPrograms={setPrograms}/>
            <ProfileResourceCounties counties={counties} setCounties={setCounties}/>
            <ProfileCoaches user={user}/>
            <ProfileWorkbook user={user} version={version} setVersion={setVersion} setSimpleModal={setSimpleModal}/>

            <div className={`bg-indigo-400 p-3 text-white rounded mb-4 text-center ${changeConfirm ? "visible" : "hidden"}`}>Details successfully saved.</div>

            <div>
                <button
                    type="submit"
                    className={`w-full p-2 text-white rounded ${
                        isButtonEnabled ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                    disabled={!isButtonEnabled}
                    onClick={savePersonalDetails}
                >
                    {isButtonEnabled ? 'Save Profile' : 'Complete Required Fields'}
                </button>
            </div>
        </Layout>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession(context)
    if (!session) return {redirect: {destination: "/login", permanent: false}}
    const {req} = context;
    // const {sub} = session;

    const protocol = req.headers['x-forwarded-proto'] || 'http'
    const baseUrl = req ? `${protocol}://${req.headers.host}` : ''
    console.log("130: ", context)
    // set up variables
    const url = baseUrl + "/api/get-user?userId=" + session.user._id

    // fetch data
    const getUser = await fetch(url)

    // cast data to json
    const userJson = await getUser.json()

    return {
        props: {
            user: userJson
        }
    }
}

