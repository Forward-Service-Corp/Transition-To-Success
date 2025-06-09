import {signIn} from "next-auth/react";
import {useRouter} from "next/router";
import Head from "next/head";
import Image from "next/image";
import {useState} from "react";

export default function Login() {
    const router = useRouter();
    const [disclosure, setDisclosure] = useState(false);
    const handleClose = () => {
        setDisclosure(false);
    }
    return (
        <div
            className={"h-screen w-screen bg-[url('/img/YouthWorkbookArt.png')] bg-center bg-cover flex align-middle justify-center"}>
            <Head>
                <title>TTS / Login</title>
            </Head>
            <div className={`max-w-full  lg:max-w-screen-md flex flex-col`}>
                <div className={`bg-gradient-to-r from-orange-600 to-orange-500 bg-opacity-40 px-4 py-4 lg:mb-10 shadow-md w-full justify-center lg:justify-around fixed top-0 left-0 right-0 z-50 flex items-center lg:relative`}>
                    <Image className={`w-[48px] h-auto backdrop-hue-rotate-270`} width={158} height={140} src={"/img/fsc-logo-white.png"} alt={`Forward Service Corporation logo`}/>
                    <span className={`text-2xl uppercase font-extralight text-white `}>Forward Service Corporation</span>
                    <span className={`text-2xl uppercase font-extralight text-white `}>(608) 665-9362</span>
                </div>
                <div className={"bg-white bg-opacity-80 p-8 h-full w-full  lg:h-auto flex flex-col justify-start gap-8 text-center"}>
                    <div className={"pt-3 flex flex-col justify-start mt-[80px] lg:mt-0"}>
                        <Image className={`w-auto h-[100px] self-center mb-4 opacity-70`} width={158} height={140} alt={`Transition to Success logo`} src={"/img/tts-logo-black.png"}/>

                        <h2 className={'pb-2 font-extralight text-2xl mt-2'}>Sign in to Your Account</h2>
                        <button className={"rounded bg-gray-700 text-white font-extralight p-2 w-full mt-3"}
                                onClick={() => signIn("email", {callbackUrl: '/'})}>Sign in with Email
                        </button>
                        <button
                            className={"rounded bg-indigo-700 text-white font-extralight p-2 w-full mt-3 block m-auto"}
                            onClick={() => {
                                router.push('/login-sms').then()
                            }}>Sign in by Text
                        </button>
                        <div className={"flex items-center pt-6"}>
                            <div className={"border-b border-gray-700 border-opacity-40 w-1/2 mr-4"}></div>
                            <div>OR</div>
                            <div className={"border-b border-gray-700 border-opacity-40 w-1/2 ml-4"}></div>
                        </div>
                        <h2 className={'font-extralight text-2xl my-2'}>Create a New Account</h2>
                        <div>
                            <p className={'text-xs'}>
                                If you don&apos;t already have an account you can create one now. Just click the button
                                below to get started.
                            </p>
                        </div>
                        <button className={"rounded bg-red-500 text-white font-extralight p-2 w-full mt-5"}
                                onClick={() => {
                                    router.push("/create-new-account").then()
                                }}>Create New Account
                        </button>
                    </div>
                    <div
                        className={`bg-black lg:bg-gray-800 lg:text-white bg-opacity-40 ${disclosure ? 'invisible' : ''} border-t border-gray-400 px-4 py-4 mb-0 shadow-md justify-center lg:justify-start `}>
                        <div className={`absolute right-4 top-4 text-lg font-bold invisible lg:visible`} onClick={() => {setDisclosure(true)}}>X</div>
                        <p className={`text-lg uppercase font-medium`}>Disclaimer</p>
                        <p className={`px-4 pb-6`}>
                            You are logging into an application owned by Forward Service Corporation. The information
                            collected by this application is protected and will not be sold or shared with any third
                            parties. We will use the data collected to improve our services and understand how people are
                            utilizing our programs. By accessing this site, you consent to FSC using your data in this way.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
