import {Fragment, useEffect, useState} from 'react'
import {signOut} from "next-auth/react"
import {Disclosure} from '@headlessui/react'
import {MenuIcon, XIcon} from '@heroicons/react/outline'
import {useRouter} from "next/router";
import {UserCircle} from "phosphor-react";
import styles from "../styles/layout.module.css"
import SimpleModal from "./simpleModal";
import Image from "next/image";
import SubNav from "./subNav";
import {getEnvironmentBgColor} from "../utils/environmentColors";

const navigation = [
    {name: 'Dashboard', view: '', current: true},
    {name: 'Dreams', view: 'dreams', current: false},
    {name: 'Life Area Surveys', view: 'life-area-surveys', current: false},
    {name: 'CARE Plans', view: 'care-plans', current: false},
    {name: 'The Journey', view: 'journey', current: false},
    {name: 'CARE Network', view: 'directory', current: false},
]
const userNavigation = [
    {name: 'Your Profile', view: 'Profile'},
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Layout({
                                   children,
                                   title,
                                   session,
                                   loadingState,
                                   version,
                                   simpleModalTitle,
                                   simpleModalMessage,
                                   simpleModalLabel,
                                   simpleModal,
                                   background,
                                   navigateToView
                               }) {
    const router = useRouter()
    const [environment, setEnvironment] = useState("production")
    const [darkMode] = useState(null)
    
    // Auto-logout functionality
    const { showWarning, timeRemaining, extendSession, handleLogout } = useAutoLogout(session)

    const handleManualLogout = async () => {
        // Properly handle logout with session validation
        if(session){
            await signOut({ redirect: false });
        }
        await router.push('/login');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    async function updateLastLogin() {
        try {
            const userId = session?.user?._id || session?._id;
            if (!userId) return;
            const res = await fetch(`/api/save-last-login?userId=${userId}`);
            if (!res.ok) return;
            await res.json().catch(() => {});
        } catch (e) {
            // swallow errors to avoid crashing layout
        }
    }

    useEffect(() => {
        const location = window.location.host
        if (location.indexOf("localhost") > -1 || location.indexOf("dev") > -1) {
            setEnvironment("development")
        } else if (location.indexOf("training") > -1) {
            setEnvironment("training")
        } else if (location.indexOf("test") > -1) {
            setEnvironment("staging")
        } else if (location.indexOf("production") > -1) {
            setEnvironment("production")
        }
    }, [])

    useEffect(() => {
        const now = new Date();
        const lastLoginTime = new Date(session?.lastLogin); // Convert lastLogin to a Date object

        // Calculate the time difference in milliseconds
        const timeDifference = now - lastLoginTime;

        // Convert milliseconds to hours
        const hoursDifference = timeDifference / (1000 * 60 * 60);

        // Check if the lastLogin is within 12 hours
        if (hoursDifference < 12) {
            return;
        }
        updateLastLogin().then()
    }, [session?.lastLogin, updateLastLogin])

    return (
        <>
            <div id="envBanner" className={`${getEnvironmentBgColor(environment)}`}>
                You are currently in the <strong className={`uppercase font-black`}>{environment}</strong> environment.
            </div>
            {simpleModal ? <SimpleModal title={simpleModalTitle} message={simpleModalMessage} label={simpleModalLabel}
                                        version={version}/> : null}
            <div
                className={`fixed w-full h-full bg-gray-600 bg-opacity-50 flex align-middle justify-center ${loadingState ? "visible" : "hidden"}`}>
                <div className={"uppercase text-white self-center rounded-full p-5 bg-orange-600 shadow"}>loading...
                </div>
            </div>

            <div id={`layoutBannerContainer`}
                 className={`min-h-full ${darkMode === 'darkTheme' ? styles["darkTheme"] : styles.lightTheme}`}>
                <div
                    className={`${session?.isYouth || version ? styles.youthVersion : styles.adultVersion} pb-32 print:hidden`}>
                    <Disclosure as="nav" className="bg-[#db5839] shadow-lg">
                        {({open}) => (
                            <>
                                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                                    <div className="flex items-center h-16 px-4 sm:px-0">
                                        <div className="flex items-center justify-between w-full">
                                            <div className={'flex'}>
                                                <div className="w-[80px] h-[50px] relative">
                                                    <Image
                                                        sizes="(max-width:70px) 30vw, (max-width: 70px) 20vw, 10vw"
                                                        fill
                                                        src="/img/tts-logo.png"
                                                        alt="Workflow"/>
                                                </div>
                                                <div className="w-[60px] h-[50px] relative ml-3">
                                                    <Image
                                                        sizes="(max-width:70px) 30vw, (max-width: 70px) 20vw, 10vw"
                                                        fill
                                                        src="/img/fsc-logo.png"
                                                        alt="Workflow" priority={true}/>
                                                </div>
                                            </div>
                                            {/*<div className="flex-shrink-0 ml-3 visible md:hidden">*/}
                                            {/*    <a onClick={() => signOut()}*/}
                                            {/*       className={"ml-16 px-3 py-2 text-white rounded border"}>Logout</a>*/}
                                            {/*</div>*/}
                                            <div className="hidden md:block">
                                                {session && <div className="flex items-right space-x-4">
                                                    {navigation.map((item) => (
                                                        <button
                                                            key={item.name}
                                                            onClick={() => router.push(`/${item.view}`)}
                                                            className={classNames(
                                                                'text-white hover:bg-orange-400 hover:text-white',
                                                                'px-3 py-2 rounded text-sm font-extralight cursor-pointer'
                                                            )}
                                                        >
                                                            {item.name}
                                                        </button>
                                                    ))}

                                                </div>}
                                            </div>
                                        </div>

                                        <div className="-mr-2 flex md:hidden">
                                            {/* Mobile menu button */}
                                            <Disclosure.Button
                                                className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                                <span className="sr-only">Open main menu</span>
                                                {open ? (
                                                    <XIcon className="block h-6 w-6" aria-hidden="true"/>
                                                ) : (
                                                    <MenuIcon className="block h-6 w-6" aria-hidden="true"/>
                                                )}
                                            </Disclosure.Button>
                                        </div>
                                    </div>
                                </div>

                                <Disclosure.Panel className="border-b border-gray-700 md:hidden">
                                    <div className="px-2 py-3 space-y-1 sm:px-3">
                                        {navigation.map((item) => (
                                            <Disclosure.Button
                                                key={item.name}
                                                onClick={() => navigateToView && navigateToView(item.view)}
                                                className={classNames(
                                                    'text-white hover:bg-gray-700 hover:text-white',
                                                    'block px-3 py-2 rounded-md text-base font-medium cursor-pointer'
                                                )}
                                            >
                                                {item.name}
                                            </Disclosure.Button>
                                        ))}
                                    </div>
                                    <div className="pt-4 pb-3 border-t border-gray-700">
                                        <div className="flex items-center px-5">
                                            <div className="flex-shrink-0 w-[45px] h-[45px] relative">
                                                {session?.image ?
                                                    <Image className="rounded-full" src={session.image}
                                                           sizes="(max-width:45px) 3vw, (max-width: 45px) 10vw, 5vw"
                                                           fill
                                                           alt="Mobile avatar"/> :
                                                    <UserCircle size={32} weight="thin" color={"white"}/>}
                                            </div>
                                            <div className="ml-3">
                                                <div
                                                    className="text-base font-medium leading-none text-white">{session?.name}</div>
                                                <div
                                                    className="text-sm font-medium leading-none text-white">{session?.email}</div>
                                            </div>
                                        </div>
                                        <div className="mt-3 px-2 space-y-1">
                                            {userNavigation.map((item) => (
                                                <Disclosure.Button
                                                    key={item.name}
                                                    onClick={() => navigateToView && navigateToView(item.view)}
                                                    className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-white hover:bg-gray-700 cursor-pointer"
                                                >
                                                    {item.name}
                                                </Disclosure.Button>
                                            ))}

                                            <Disclosure.Button
                                                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-white hover:bg-gray-700"
                                                onClick={() => {
                                                    signOut()
                                                        .then(() => {
                                                            router.reload()
                                                        })
                                                }}
                                            >
                                                Sign Out
                                            </Disclosure.Button>

                                        </div>
                                    </div>
                                </Disclosure.Panel>
                            </>
                        )}
                    </Disclosure>
                    <SubNav session={session} environment={environment} handleLogout={handleLogout}/>
                    <header className="py-10">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <span className="text-4xl font-extralight text-white dark:text-gray-400">{title}</span>
                            <p className={`mt-0 text-white font-extralight uppercase text-sm`}>{session?.isYouth || version ? "Youth Workbook" : "Adult Workbook"}</p>
                        </div>
                    </header>
                </div>

                <main className="-mt-32 print:mt-0">
                    <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
                        <div
                            className={`${background === false ? '' : 'bg-white shadow px-5 py-6 sm:px-6'} print:px-0 print:py-0 print:shadow-none`}>
                            {children}
                        </div>
                    </div>
                </main>
            </div>
            <div
                className={"p-4 bg-gray-600 dark:bg-gray-900 grid grid-cols-1 md:grid-cols-4 text-white text-sm  font-light print:hidden"}>
                <div className={"text-center"}>Map of My Dreams Web Application</div>
                <div className={"text-center"}>Forward Service Corporation &copy; 2024</div>
                <div className={"text-center"}>
                    <button
                       onClick={() => navigateToView && navigateToView('Disclaimer')}
                       className={"text-orange-300 underline cursor-pointer"}>
                        Data Usage Disclaimer
                    </button>
                </div>
                <div className={"text-center"}>
                    <a href={"https://fsc-support.zendesk.com/hc/en-us/requests/new?ticket_form_id=9189050108308"}
                       target={"_blank"}
                       rel={"noreferrer"}
                       className={"text-orange-300 underline"}>
                        Feedback: Let us know how we&apos;re doing!
                    </a>
                </div>
            </div>
        </>
    )
}
