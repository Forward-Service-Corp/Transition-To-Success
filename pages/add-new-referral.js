import React, {useState} from 'react';
import Layout from "../components/layout";
import {getSession} from "next-auth/react";
import {WICountiesList} from "../lib/WI_Counties";
import {labelMap} from "../lib/serviceLabelsMap";
import Head from "next/head";

export default function AddNewReferral({pageDataJson}) {

    const {user} = pageDataJson
    const serviceLabels = Object.keys(labelMap)
    const [referral, setReferral] = useState({
        name: null,
        city: null,
        state: "WI",
        street: null,
        zip: null,
        county: null,
        service: null,
        url: null,
        requirements: null,
        contactName: null,
        hours: null,
        phone: null,
        contactEmail: null,
        contactPhone: null,
        needs: null
    })

    const handleInputChange = e => {
        const {name, value} = e.target
        setReferral(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    const saveReferral = async () => {
        await fetch("/api/save-new-referral", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(referral)
        })
    }

    return (
        <Layout title={"Add New Referral to CARE Network"} session={user}>
            <Head>
                <title>TTS / Add New Referral</title>
            </Head>
            <div className={"text-xl uppercase text-gray-600 mb-6"}>
                New referral details
            </div>
            <div className={"mb-5"}>
                <div className={"text-xs mb-2"}>Name:</div>
                <input className={"w-1/2 text-xs"} type="text"
                       placeholder={`Please enter name...`}
                       value={referral.name}
                       onChange={handleInputChange}
                       name={"name"}/>
            </div>

            <div className={"mb-5"}>
                <div className={"text-xs mb-2"}>City:</div>
                <input className={"w-1/2 text-xs"} type="text"
                       placeholder={`Please enter city...`}
                       value={referral.city}
                       onChange={handleInputChange}
                       name={"city"}/>
            </div>

            <div className={"mb-5"}>
                <div className={"text-xs mb-2"}>State:</div>
                <input className={"w-1/2 text-xs"} type="text"
                       placeholder={`Please enter state...`}
                       value={referral.state}
                       onChange={handleInputChange}
                       name={"state"}/>
            </div>

            <div className={"mb-5"}>
                <div className={"text-xs mb-2"}>Street Address:</div>
                <input className={"w-1/2 text-xs"} type="text"
                       placeholder={`Please enter street address...`}
                       value={referral.street}
                       onChange={handleInputChange}
                       name={"street"}/>
            </div>

            <div className={"mb-5"}>
                <div className={"text-xs mb-2"}>Zip:</div>
                <input className={"w-1/2 text-xs"} type="text"
                       placeholder={`Please enter zip code...`}
                       value={referral.zip}
                       onChange={handleInputChange}
                       name={"zip"}/>
            </div>

            <div className={"mb-5"}>
                <div className={"text-xs mb-2"}>County:</div>
                <select className={"text-xs w-1/2"} name="county" id="county" onChange={handleInputChange}>
                    <option value="">Please select a county...</option>
                    {WICountiesList.map(county => (
                        <option key={county} value={county}>{county}</option>
                    ))}
                </select>
            </div>

            <div className={"mb-5"}>
                <div className={"text-xs mb-2"}>Domain:</div>
                <select className={"text-xs w-1/2"} name="service" id="service" onChange={handleInputChange}>
                    <option value="">Please select a domain...</option>
                    {serviceLabels.map(service => (
                        <option key={service} value={service}>{labelMap[service]}</option>
                    ))}
                </select>
            </div>

            <div className={"mb-5"}>
                <div className={"text-xs mb-2"}>URL:</div>
                <input className={"w-1/2 text-xs"} type="text"
                       placeholder={`Please enter website URL...`}
                       value={referral.url}
                       onChange={handleInputChange}
                       name={"url"}/>
            </div>

            <div className={"mb-5"}>
                <div className={"text-xs mb-2"}>Requirements (separate by comma):</div>
                <input className={"w-1/2 text-xs"} type="text"
                       placeholder={`Please enter requirements...`}
                       value={referral.requirements}
                       onChange={handleInputChange}
                       name={"requirements"}/>
            </div>

            <div className={"mb-5"}>
                <div className={"text-xs mb-2"}>Contact Name:</div>
                <input className={"w-1/2 text-xs"} type="text"
                       placeholder={`Please enter contact name...`}
                       value={referral.contactName}
                       onChange={handleInputChange}
                       name={"contactName"}/>
            </div>

            <div className={"mb-5"}>
                <div className={"text-xs mb-2"}>Hours:</div>
                <input className={"w-1/2 text-xs"} type="text"
                       placeholder={`Please enter hours...`}
                       value={referral.hours}
                       onChange={handleInputChange}
                       name={"hours"}/>
            </div>

            <div className={"mb-5"}>
                <div className={"text-xs mb-2"}>Phone:</div>
                <input className={"w-1/2 text-xs"} type="text"
                       placeholder={`Please enter phone number...`}
                       value={referral.phone}
                       onChange={handleInputChange}
                       name={"phone"}/>
            </div>

            <div className={"mb-5"}>
                <div className={"text-xs mb-2"}>Contact Email:</div>
                <input className={"w-1/2 text-xs"} type="text"
                       placeholder={`Please enter contact email...`}
                       value={referral.contactEmail}
                       onChange={handleInputChange}
                       name={"contactEmail"}/>
            </div>

            <div className={"mb-5"}>
                <div className={"text-xs mb-2"}>Contact Phone:</div>
                <input className={"w-1/2 text-xs"} type="text"
                       placeholder={`Please enter contact phone...`}
                       value={referral.contactPhone}
                       onChange={handleInputChange}
                       name={"contactPhone"}/>
            </div>

            <div className={"mb-5"}>
                <div className={"text-xs mb-2"}>Needs to bring (separate by comma):</div>
                <input className={"w-1/2 text-xs"} type="text"
                       placeholder={`Please enter what the person needs to bring...`}
                       value={referral.needs}
                       onChange={handleInputChange}
                       name={"needs"}/>
            </div>

            <div>
                <button className={"py-[6px] px-6 mr-2 text-white  text-xs bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400"}
                onClick={() => {
                    saveReferral().then()
                }}>Save new referral</button>
            </div>
        </Layout>
    );
}

export async function getServerSideProps(context) {
    const session = await getSession(context)
    if (!session) return {redirect: {destination: "/login", permanent: false}}
    const {req} = context;

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

