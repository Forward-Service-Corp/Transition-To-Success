import Layout from "../components/layout";
import {getSession} from "next-auth/react";
import SurveyDomainList from "../components/surveyDomainsList";
import NewLifeAreaSurveyForm from "../components/newLifeAreaSurveyForm";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import NewLifeAreaSurveyQuestions from "../components/newLifeAreaSurveyQuestions";
import Head from "next/head";

export default function NewLifeAreaSurvey({user}) {

    const router = useRouter()
    const [activeDomain, setActiveDomain] = useState("food")
    const [answered, setAnswered] = useState([] || null)
    const [domains, setDomains] = useState([])
    const [surprise, setSurprise] = useState("")
    const [concern, setConcern] = useState("")
    const [family, setFamily] = useState("")
    const [health, setHealth] = useState("")
    const [income, setIncome] = useState("")

    async function getSurvey() {
        const survey = await fetch("/api/get-survey?surveyId=" + router.query.surveyId)
            .then(res => res.json())
            .catch(err => console.warn(err))
        const isYouth = survey.isYouthSurvey
        await setDomains(survey.priority)
        if(isYouth){
            await setAnswered({
                myFamily: {selection: survey.myFamily[0] || 0, statement: survey.myFamily[1] || ""},
                school: {selection: survey.school[0] || 0, statement: survey.school[1] || ""},
                familyCare: {selection: survey.familyCare[0] || 0, statement: survey.familyCare[1] || ""},
                childrensEducation: {selection: survey.childrensEducation[0] || 0, statement: survey.childrensEducation[1] || ""},
                money: {selection: survey.money[0] || 0,statement: survey.money[1] || ""},
                disabilities: {selection: survey.disabilities[0] || 0, statement: survey.disabilities[1] || ""},
                work: {selection: survey.work[0] || 0, statement: survey.work[1] || ""},
                friends: {selection: survey.friends[0] || 0,statement: survey.friends[1] || ""},
                food: {selection: survey.food[0] || 0, statement: survey.food[1] || ""},
                healthCare: {selection: survey.healthCare[0] || 0, statement: survey.healthCare[1] || ""},
                housing: {selection: survey.housing[0] || 0, statement: survey.housing[1] || ""},
                internetAccess: {selection: survey.internetAccess[0] || 0, statement: survey.internetAccess[1] || ""},
                legal: {selection: survey.legal[0] || 0, statement: survey.legal[1] || ""},
                lifeSkills: {selection: survey.lifeSkills[0] || 0, statement: survey.lifeSkills[1] || ""},
                mentalHealth: {selection: survey.mentalHealth[0] || 0, statement: survey.mentalHealth[1] || ""},
                manageMoney: {selection: survey.manageMoney[0] || 0, statement: survey.manageMoney[1] || ""},
                parenting: {selection: survey.parenting[0] || 0, statement: survey.parenting[1] || ""},
                education: {selection: survey.education[0] || 0, statement: survey.education[1] || ""},
                safety: {selection: survey.safety[0] || 0, statement: survey.safety[1] || ""},
                substances: {selection: survey.substances[0] || 0, statement: survey.substances[1] || ""},
                transportation: {selection: survey.transportation[0] || 0, statement: survey.transportation[1] || ""}
            })
        }else{
            await setAnswered({
                adultEducation: {selection: survey.adultEducation[0] || 0, statement: survey.adultEducation[1] || ""},
                budgeting: {selection: survey.budgeting[0] || 0, statement: survey.budgeting[1] || ""},
                childcare: {selection: survey.childcare[0] || 0, statement: survey.childcare[1] || ""},
                childrensEducation: {selection: survey.childrensEducation[0] || 0, statement: survey.childrensEducation[1] || ""},
                communityInvolvement: {
                    selection: survey.communityInvolvement[0] || 0,
                    statement: survey.communityInvolvement[1] || ""
                },
                disabilities: {selection: survey.disabilities[0] || 0, statement: survey.disabilities[1] || ""},
                employment: {selection: survey.employment[0], statement: survey.employment[1] || ""},
                familyFriendsSupport: {
                    selection: survey.familyFriendsSupport[0] || 0,
                    statement: survey.familyFriendsSupport[1] || ""
                },
                food: {selection: survey.food[0] || 0, statement: survey.food[1] || ""},
                healthInsurance: {selection: survey.healthInsurance[0] || 0, statement: survey.healthInsurance[1] || ""},
                housing: {selection: survey.housing[0] || 0, statement: survey.housing[1] || ""},
                internetAccess: {selection: survey.internetAccess[0] || 0, statement: survey.internetAccess[1] || ""},
                legal: {selection: survey.legal[0] || 0, statement: survey.legal[1] || ""},
                lifeSkills: {selection: survey.lifeSkills[0] || 0, statement: survey.lifeSkills[1] || ""},
                mentalHealth: {selection: survey.mentalHealth[0] || 0, statement: survey.mentalHealth[1] || ""},
                money: {selection: survey.money[0] || 0, statement: survey.money[1] || ""},
                parentingSkills: {selection: survey.parentingSkills[0] || 0, statement: survey.parentingSkills[1] || ""},
                racismBigotry: {selection: survey.racismBigotry[0] || 0, statement: survey.racismBigotry[1] || ""},
                safety: {selection: survey.safety[0] || 0, statement: survey.safety[1] || ""},
                substances: {selection: survey.substances[0] || 0, statement: survey.substances[1] || ""},
                transportation: {selection: survey.transportation[0] || 0, statement: survey.transportation[1] || ""}
            })
        }

        setSurprise(survey.surprise)
        setConcern(survey.concern)
        setFamily(survey.family)
        setHealth(survey.health)
        setIncome(survey.income)
    }

    useEffect(() => {
        if (router.query.surveyId !== undefined) {
            getSurvey().then()
        }
    }, [])

    async function saveSurvey() {
        await fetch("/api/post-life-area-survey", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                dreamId: router.query.dreamId,
                dream: router.query.dreamName,
                county: user.county,
                coach: user.coach,
                priority: domains,
                food: [answered.food.selection, answered.food.statement],
                money: [answered.money.selection, answered.money.statement],
                substances: [answered.substances.selection, answered.substances.statement],
                mentalHealth: [answered.mentalHealth.selection, answered.mentalHealth.statement],
                safety: [answered.safety.selection, answered.safety.statement],
                healthInsurance: [answered.healthInsurance.selection, answered.healthInsurance.statement],
                transportation: [answered.transportation.selection, answered.transportation.statement],
                disabilities: [answered.disabilities.selection, answered.disabilities.statement],
                lifeSkills: [answered.lifeSkills.selection, answered.lifeSkills.statement],
                employment: [answered.employment.selection, answered.employment.statement],
                legal: [answered.legal.selection, answered.legal.statement],
                childcare: [answered.childcare.selection, answered.childcare.statement],
                adultEducation: [answered.adultEducation.selection, answered.adultEducation.statement],
                parentingSkills: [answered.parentingSkills.selection, answered.parentingSkills.statement],
                childrensEducation: [answered.childrensEducation.selection, answered.childrensEducation.statement],
                communityInvolvement: [answered.communityInvolvement.selection, answered.communityInvolvement.statement],
                familyFriendsSupport: [answered.familyFriendsSupport.selection, answered.familyFriendsSupport.statement],
                budgeting: [answered.budgeting.selection, answered.budgeting.statement],
                racismBigotry: [answered.racismBigotry.selection, answered.racismBigotry.statement],
                internetAccess: [answered.internetAccess.selection, answered.internetAccess.statement],
                housing: [answered.housing.selection, answered.housing.statement],
                userId: router.query.clientId === undefined ? user._id : router.query.clientId,
                surprise, concern, family, health, income
            })
        })
    }

    async function saveYouthSurvey() {
        console.log("ran function")
        await fetch("/api/post-youth-life-area-survey", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                dreamId: router.query.dreamId,
                dream: router.query.dreamName,
                county: user.county,
                coach: user.coach,
                priority: domains,
                food: [answered.food.selection, answered.food.statement],
                housing: [answered.housing.selection, answered.housing.statement],
                safety: [answered.safety.selection, answered.safety.statement],
                friends: [answered.friends.selection, answered.friends.statement],
                myFamily: [answered.myFamily.selection, answered.myFamily.statement],
                school: [answered.school.selection, answered.school.statement],
                work: [answered.work.selection, answered.work.statement],
                money: [answered.money.selection, answered.money.statement],
                transportation: [answered.transportation.selection, answered.transportation.statement],
                familyCare: [answered.familyCare.selection, answered.familyCare.statement],
                mentalHealth: [answered.mentalHealth.selection, answered.mentalHealth.statement],
                substances: [answered.substances.selection, answered.substances.statement],
                disabilities: [answered.disabilities.selection, answered.disabilities.statement],
                lifeSkills: [answered.lifeSkills.selection, answered.lifeSkills.statement],
                healthCare: [answered.healthCare.selection, answered.healthCare.statement],
                manageMoney: [answered.manageMoney.selection, answered.manageMoney.statement],
                legal: [answered.legal.selection, answered.legal.statement],
                internetAccess: [answered.internetAccess.selection, answered.internetAccess.statement],
                education: [answered.education.selection, answered.education.statement],
                parenting: [answered.parenting.selection, answered.parenting.statement],
                childrensEducation: [answered.childrensEducation.selection, answered.childrensEducation.statement],
                userId: router.query.clientId === undefined ? user._id : router.query.clientId,
                surprise, concern, family, health, income
            })
        })
    }

    async function updateSurvey() {
        await fetch("/api/update-life-area-survey", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                surveyId: router.query.surveyId,
                dreamId: router.query.dreamId,
                dream: router.query.dreamName,
                priority: domains,
                food: [answered.food.selection, answered.food.statement],
                money: [answered.money.selection, answered.money.statement],
                substances: [answered.substances.selection, answered.substances.statement],
                mentalHealth: [answered.mentalHealth.selection, answered.mentalHealth.statement],
                safety: [answered.safety.selection, answered.safety.statement],
                healthInsurance: [answered.healthInsurance.selection, answered.healthInsurance.statement],
                transportation: [answered.transportation.selection, answered.transportation.statement],
                disabilities: [answered.disabilities.selection, answered.disabilities.statement],
                lifeSkills: [answered.lifeSkills.selection, answered.lifeSkills.statement],
                employment: [answered.employment.selection, answered.employment.statement],
                legal: [answered.legal.selection, answered.legal.statement],
                childcare: [answered.childcare.selection, answered.childcare.statement],
                adultEducation: [answered.adultEducation.selection, answered.adultEducation.statement],
                parentingSkills: [answered.parentingSkills.selection, answered.parentingSkills.statement],
                childrensEducation: [answered.childrensEducation.selection, answered.childrensEducation.statement],
                communityInvolvement: [answered.communityInvolvement.selection, answered.communityInvolvement.statement],
                familyFriendsSupport: [answered.familyFriendsSupport.selection, answered.familyFriendsSupport.statement],
                budgeting: [answered.budgeting.selection, answered.budgeting.statement],
                racismBigotry: [answered.racismBigotry.selection, answered.racismBigotry.statement],
                internetAccess: [answered.internetAccess.selection, answered.internetAccess.statement],
                housing: [answered.housing.selection, answered.housing.statement],
                userId: router.query.clientId === undefined ? user._id : router.query.clientId,
                surprise, concern, family, health, income
            })
        })
    }

    const saveSurveyButton = () => {
        return (
            <button disabled={domains.length === 0 || Object.keys(answered).length !== 21}
                    className={`text-white text-sm rounded py-2 px-4 mt-5 bg-gradient-to-t from-orange-600 to-orange-400 disabled:bg-gradient-to-b disabled:from-gray-300 disabled:to-gray-400`}
                    onClick={async () => {
                        if(!user.isYouth || user.isYouth === false){
                            await saveSurvey().then()
                            if (router.query.clientId === undefined) {
                                router.push("/life-area-surveys").then()
                            } else {
                                router.back()
                            }
                        }else{
                            await saveYouthSurvey().then()
                            if (router.query.clientId === undefined) {
                                router.push("/life-area-surveys").then()
                            } else {
                                router.back()
                            }
                        }
                    }}>Save this
                survey
            </button>
        )
    }

    const updateSurveyButton = () => {
        return (
            <button disabled={domains.length === 0 || Object.keys(answered).length !== 21}
                    className={`text-white text-sm rounded py-2 px-4 mt-5 bg-gradient-to-t from-orange-600 to-orange-400 disabled:bg-gradient-to-b disabled:from-gray-300 disabled:to-gray-400`}
                    onClick={async () => {
                        await updateSurvey().then()
                        if (router.query.clientId === undefined) {
                            router.push("/life-area-surveys").then()
                        } else {
                            router.back()
                        }

                    }}>Update this
                survey
            </button>
        )
    }

    return (
        <Layout title={"Life Area Survey"} session={user}>
            <Head>
                <title>TTS / Life Area Survey</title>
            </Head>
            <div className={"text-xl text-center p-3 truncate dark:text-white"}>Dream: {router.query.dreamName}</div>
            <div className={"p-4 bg-gray-100 rounded text-sm mb-4 text-center dark:rounded-lg dark:shadow-xl dark:text-white dark:bg-black dark:bg-opacity-70"}>
                <p>Where am I today?</p>
                <p><strong>&quot;What I treasure most in life, is being able to dream. During my most difficult
                    moments and complex situations, I have been able to dream of a more beautiful life.&quot;</strong>
                 -- Rigoberta Mensh&ugrave;, Guatemalan human rights activist and Nobel Peace prize winner</p>
                <p>What does your life look like now? Knowing where you are is key to finding your path. How are
                    things going? What areas in your life are challenging? Where are you feeling confident?
                    Where could you use help?</p>
                <p>Using the Life Area Survey, you can see how things are going and the areas you want to work on now.</p>
            </div>
            <div
                className={"bg-gray-600 text-center p-2 text-white mb-3 rounded flex justify-around font-light text-sm grid-cols-1 md:grid-cols-2 dark:bg-black"}>
                <div>Priorities: <strong>{domains.length}</strong></div>
                <div>Answered: <strong>{Object.keys(answered).length}/21</strong></div>
            </div>
            <div
                className={`bg-red-600 p-2 rounded text-center text-white text-xs mb-2 ${Object.keys(answered).length === 21 ? "hidden" : null} dark:bg-indigo-800`}>
                You&apos;ve completed {Object.keys(answered).length} of 21 life areas. Keep going!
            </div>
            <div
                className={`bg-red-600 p-2 rounded text-center text-white text-xs mb-6 ${domains.length > 0 ? "hidden" : null} dark:bg-indigo-800`}>
                Please select at least one life area as a priority by using the toggle.
            </div>
            <div className={"flex"}>
                <div className={"flex-initial"}>
                    <SurveyDomainList setActiveDomain={setActiveDomain} activeDomain={activeDomain}
                                      answered={answered} domains={domains} user={user}/>
                </div>
                <div className={"flex-grow"}>
                    <div className={"p-4 bg-gray-100 m-0 md:m-4 my-2 md:my-0 dark:rounded-lg dark:shadow-xl dark:text-white dark:bg-black dark:bg-opacity-70"}>
                        <h2 className={"uppercase text-gray-600 dark:text-gray-300"}>Instructions</h2>
                        <p className={"text-xs"}>
                            Click or tap on each of the life areas to choose the option that best describes where you
                            are today.
                            You may need to scroll down to see all 21 life areas.
                            You must select an answer for each life area.
                            If one does not apply to you, then select &quot;This does not apply to me.&quot;
                            If the life area is something you want to work on, use the &quot;Set as
                            priority&quot; toggle button.
                            Life areas that you mark as a priority will have a red flag in the life areas list.
                        </p>
                        <p>MOST IMPORTANT TO YOU -- your priorities.</p>
                    </div>
                    <NewLifeAreaSurveyForm activeDomain={activeDomain} setAnswered={setAnswered} answered={answered}
                                           domains={domains} setDomains={setDomains} user={user}/>

                </div>
            </div>

            <NewLifeAreaSurveyQuestions surprise={surprise} setSurprise={setSurprise} concern={concern}
                                        setConcern={setConcern} family={family}
                                        setFamily={setFamily} health={health} setHealth={setHealth} income={income}
                                        setIncome={setIncome}/>

            <div className={"flex justify-end"}>
                {router.query.surveyId !== undefined ? updateSurveyButton() : saveSurveyButton()}

            </div>
        </Layout>
    )
}

export async function getServerSideProps(context) {

    let dream, dreamId
    if (context.query.dream !== undefined) {
        dream = context.query.dream
        dreamId = context.query.dreamId
    } else {
        dream = ""
        dreamId = ""
    }

    // session check and possible redirect
    const session = await getSession(context)
    if (!session) return {redirect: {destination: "/login", permanent: false}}

    // dynamic url setup
    const {req} = context;
    const protocol = req.headers['x-forwarded-proto'] || 'http'
    const baseUrl = req ? `${protocol}://${req.headers.host}` : ''

    // page data
    const dataUrl = baseUrl + "/api/pages/surveysPageData?userId=" + session.user._id
    const getData = await fetch(dataUrl)
    const {user} = await getData.json()

    return {
        props: {
            user,
            incomingDream: {
                hasDream: context.query.dream !== undefined,
                dream: dream,
                dreamId: dreamId
            }
        }
    }

}
