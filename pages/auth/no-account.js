import Head from "next/head";
import Image from "next/image";
import {useRouter} from "next/router";
export default function NoAccount() {
    const router = useRouter();
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
                    <h2 className={'font-extralight text-2xl my-2'}>Oops! We can&apos;t find that account.</h2>
                    <p className={'text-xs'}>
                        This usually happens when the wrong email or phone number is used. You can check your credentials and try again, or create an account.
                    </p>
                    <button className={"rounded bg-indigo-700 text-white font-extralight p-2 w-full mt-3 block m-auto"}
                            onClick={() => {
                                router.push('/login').then()
                            }}>Try Again
                    </button>
                    <div className={"flex items-center pt-2 mt-4"}>
                        <div className={"border-b border-gray-700 border-opacity-40 w-1/2 mr-4"}></div>
                        <div>OR</div>
                        <div className={"border-b border-gray-700 border-opacity-40 w-1/2 ml-4"}></div>
                    </div>
                    <div>
                        <h2 className={'font-extralight text-2xl my-2'}>Create a New Account</h2>
                        <p className={'text-xs'}>
                            If you don&apos;t already have an account you can create one now. Just click the button
                            below to get started.
                        </p>
                    </div>
                    <button className={"rounded bg-red-500 text-white font-extralight p-2 w-full mt-5 text-sm"}
                            onClick={() => {
                                router.push("/create-new-account").then()
                            }}>Create New Account
                    </button>
                </div>
                <div
                    className={`bg-gray-800 bg-opacity-90 text-white mt-8 rounded text-xs p-4 text-center font-light shadow-2xl`}>
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
