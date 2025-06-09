import Layout from "../components/layout";
import {getSession} from "next-auth/react";
import {useState} from "react";
import Head from "next/head";
import ServicesTable from "../components/servicesTable";
import {WICountiesList} from "../lib/WI_Counties";
import {labelMap} from "../lib/serviceLabelsMap";

export default function Directory({pageDataJson}) {

    const [loadedServices, setLoadedServices] = useState(pageDataJson.directory ? pageDataJson.directory :  [])
    const [searched, setSearched] = useState(false)
    const [keyword, setKeyword] = useState("")
    const [domain, setDomain] = useState("")
    const [county, setCounty] = useState("")
    const domains = Object.keys(labelMap)
    const [searching, setSearching] = useState(false)

    async function search() {
        setSearching(true)
        const fetchSearch = await fetch("/api/search-directory", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({keyword, domain, county})
        }).then(res => res.json())
        await setSearching(false)
        await setLoadedServices(fetchSearch)
    }

    return (
        <Layout title={"CARE Network"} session={pageDataJson.user}>
            <Head>
                <title>TTS / CARE Network</title>
            </Head>
            <div className={"w-full max-w-[95%] m-auto p-3 bg-gray-100 rounded shadow dark:bg-transparent"}>
                <form className={"grid grid-cols-1 md:grid-cols-4 gap-4 items-end"} onSubmit={(e) => {
                    e.preventDefault()
                    search().then()
                }}>
                    <div className={""}>
                        <p className={"text-xs text-gray-500 dark:text-white dark:pb-3"}>Search by keyword</p>
                        <input className={"w-full rounded border-gray-300 text-xs dark:bg-black dark:text-white dark:border-0 dark:placeholder:text-gray-500"} placeholder={`Enter a keyword...`} id={"searchField"} type={"text"}
                               value={keyword} onChange={(e) => {
                            setKeyword(e.target.value)
                        }}/>
                    </div>
                    <div className={""}>
                        <p className={"text-xs text-gray-500 dark:text-white dark:pb-3"}>Search by domain</p>
                        <select id={"domainSelect"} className={"w-full rounded border-gray-300 text-xs dark:bg-black dark:text-white dark:border-0 dark:placeholder:text-gray-500 focus:border-0 focus:border-transparent focus:ring-transparent outline-none focus:outline-none"}
                                onChange={(e) => {
                                    setDomain(e.target.value)
                                }}>
                            <option className={`dark:placeholder:text-gray-500`} value={""}>Select a domain...</option>
                            {domains.map(domain => <option key={domain} value={domain}>{labelMap[domain]}</option>)}
                        </select>
                    </div>
                    <div className={""}>
                        <p className={"text-xs text-gray-500 dark:text-white dark:pb-3"}>Search by county</p>
                        <select defaultValue={"none"} className={"w-full rounded border-gray-300 text-xs dark:bg-black dark:text-white dark:border-0 dark:placeholder:text-gray-500 focus:border-0 focus:border-transparent focus:ring-transparent outline-none focus:outline-none dark:default:text-gray-500"} id={"countySelect"}
                                onChange={(e) => {
                                    setCounty(e.target.value)
                                }}>
                            <option value={"none"}>Select a county...</option>
                            {WICountiesList.map(county => <option value={county} key={county}>{county}</option>)}
                        </select>
                    </div>
                    <div className={"flex items-center"}>
                        <button type={"submit"}
                                className={"py-[8px] px-6 mr-2 text-white  text-xs bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 dark:rounded-lg"}
                                onClick={() => {
                                    setSearched(true)
                                }}>Search
                        </button>
                        <button type={"reset"}
                                className={"py-[8px] px-6 text-white  text-xs bg-red-500 hover:bg-red-600 disabled:bg-gray-400 rounded-lg"}
                                disabled={keyword === "" && domain === "" && county === ""}
                                onClick={() => {
                                    setKeyword("")
                                    setDomain("")
                                    setCounty("")
                                    setLoadedServices([])
                                    setSearched(false)
                                }}>Reset
                        </button>
                    </div>
                </form>
            </div>
            <div className={`rounded bg-green-100 p-2 text-xs text-center mt-4 max-w-[95%] m-auto ${searching ? "visible" : "hidden"} dark:bg-purple-800 dark:text-white dark:font-extralight`}>
                Searching...
            </div>
            <div className={`text-center p-4 ${searched ? "visible" : "hidden"} dark:text-white dark:font-extralight`}>
                {loadedServices.length === 0 ? "There were no results" : "There were " + loadedServices.length + " results found."}
            </div>
            <div className={`text-center p-4 ${!searched ? "visible" : "hidden"} dark:text-white font-thin`}>
                Please enter your search criteria.
            </div>
            {loadedServices.length > 0 ? <ServicesTable services={loadedServices}/> : null}
        </Layout>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession(context)
    if (!session) return {redirect: {destination: "/login", permanent: false}}
    const {req} = context;
    const {sub} = session;

    const protocol = req.headers['x-forwarded-proto'] || 'http'
    const baseUrl = req ? `${protocol}://${req.headers.host}` : ''

    // page data
    const pageDataUrl = baseUrl + "/api/pages/directoryPageData?userId=" + session.user._id
    const getPageData = await fetch(pageDataUrl)
    const pageDataJson = await getPageData.json()

    // redirect to profile page if required fields are not complete
    // const {county, name, homeCounty, programs} = pageDataJson.user
    // if(!county.length || !homeCounty || !programs.length || !name) return  {redirect: {destination: "/profile", permanent: false}}

    return {
        props: {pageDataJson}
    }

}

