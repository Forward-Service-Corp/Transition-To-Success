import {useRouter} from "next/router";
import Head from "next/head";
import Image from "next/image";
import {EnvelopeOpen} from "phosphor-react";


export default function Login() {
    const router = useRouter()

    return (
        <div
            className={"h-screen w-screen bg-[url('/img/YouthWorkbookArt.png')] bg-center bg-cover flex align-middle justify-center"}>
            <Head>
                <title>TTS / Login</title>
            </Head>
            <div className={`self-center max-w-xl flex flex-col`}>
                <div className={`bg-orange-600 bg-opacity-80 rounded min-h-[150px] mb-8 flex shadow-2xl w-full items-center justify-around`}>
                    <div className={`w-[150px] h-[110px] relative p-2`}>
                        <Image src={"/img/fsc-logo.png"} alt={`Forward Service Corporation logo`} fill={true}
                              sizes="(max-width: 320px) 20vw, (max-width: 150px) 20vw, 15vw"/>
                    </div>
                    <div className={`w-[170px] h-[100px] relative`}>
                        <Image src={"/img/tts-logo.png"} alt={`Transition to Success logo`} fill={true}
                               sizes="(max-width: 320px) 20vw, (max-width: 150px) 20vw, 15vw"/>
                    </div>
                </div>
                <div className={"bg-white p-4 text-center rounded shadow-2xl"}>
                    <EnvelopeOpen size={60} color={"orange"} className={'m-auto'}/>
                    <h2 className={'text-2xl'}>Check your email.</h2>
                    <p className={'text-lg'}>Your login link has been sent.</p>
                    <p>If you don&apos;t see the link in your inbox, please check your spam folder.</p>
                </div>
                <div className={`bg-gray-800 bg-opacity-90 text-white mt-8 rounded text-xs p-4 text-center font-light shadow-2xl`}>
                    <p className={`text-lg uppercase`}>Disclaimer</p>
                    <p className={`pb-4`}>
                        You are logging into an application owned by Forward Service Corporation. The information
                        collected by this application is protected and will not be sold or shared with any third
                        parties. We will use the data collected to improve our services and understand how people are
                        utilizing our programs. By accessing this site, you consent to FSC using your data in this way.
                    </p>
                </div>
            </div>
        </div>
    )
}
