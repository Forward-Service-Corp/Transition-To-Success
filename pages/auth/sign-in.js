import {signIn} from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import {useState} from "react";
import Link from "next/link";


export default function SignIn() {
    const [email, setEmail] = useState("")
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [checking, setChecking] = useState(false);
    const [error, setError] = useState({});

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleEmailChange = (e) => {
        const newEmail = e.target.value.toLowerCase();
        setEmail(newEmail);
        setIsEmailValid(validateEmail(newEmail));
    };

    const handleEmailSubmit = async() => {
        await setChecking(true);
        const loginCheck = await fetch("/api/check-new-account", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                loginType: "email", loginValue: email, loginFrom: "existing-account"
            })
        })
        const data = await loginCheck.json()
        if (data.code === 666) {
            signIn('email', {email, callbackUrl: "/"}).then()
        } else {
            setError({code: 777, message: "No account found with this login.  Please try again or create a new account."})
            setChecking(false)
        }
    }

    return (
        <div
            className={"h-screen w-screen bg-[url('/img/YouthWorkbookArt.png')] bg-center bg-cover flex align-middle justify-center"}>
            <Head>
                <title>TTS / Login</title>
            </Head>
            <div className={`self-center max-w-[360px] flex flex-col`}>
                <div
                    className={`bg-orange-600 bg-opacity-80 rounded min-h-[150px] mb-8 flex shadow-2xl w-full items-center justify-around`}>
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
                    <div className={`self-center flex flex-col`}>
                        <h2 className={'pb-2 font-extralight text-2xl my-2'}>Enter Your Email</h2>
                        <input type="email" value={email}
                               className={`rounded ${isEmailValid ? 'border-2 border-green-600' : 'border-gray-300'}`}
                               onChange={handleEmailChange}
                               placeholder={"Your email address..."}/>
                        <div
                            className={`bg-green-100 p-4 text-center rounded ${checking ? 'visible' : 'hidden'}`}>One
                            moment please...
                        </div>
                        <div
                            className={`text-center text-red-600 mt-4 text-xs ${error.code === 777 ? 'visible' : 'hidden'}`}>
                            There is no account with the email address you provided. Please try again,
                            or <Link className={'underline'} href={'/create-new-account'}>Create a new account here.</Link>
                        </div>
                        <button className={`mt-4 p-2 bg-indigo-600 text-white rounded disabled:bg-gray-300`}
                                disabled={!isEmailValid || error.code === 777}
                                onClick={handleEmailSubmit}>
                            Get my magic link
                        </button>
                        <Link href="/login" className={`text-red-600 underline mt-5 block text-sm`}>Go Back</Link>
                    </div>
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
