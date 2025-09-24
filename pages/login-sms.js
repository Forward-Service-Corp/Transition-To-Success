import {signIn} from "next-auth/react";
import {useRouter} from "next/router";
import Head from "next/head";
import Image from "next/image";
import {useState} from "react";
import Link from "next/link";
import PhoneNumberInput from "../components/PhoneNumberInput";
import OTPInput from "../components/OTPInput";

export default function Login() {
    const router = useRouter()
    const [phone, setPhone] = useState("")
    const [formattedNumber, setFormattedNumber] = useState('')
    const [code, setCode] = useState("")
    const [formattedCode, setFormattedCode] = useState("")
    const [error, setError] = useState(false)
    const [sendingState, setSendingState] = useState(1)

    const sendOTP = async () => {
        await fetch(`/api/send-OTP?phone=${phone}`)
            .then(res => res.json())
            .then(() => setSendingState(3))
    }

    const checkCode = async () => {
        const check = await fetch(`/api/check-OTP?phone=${phone}&code=${code}`)
            .then(res => res.json())
        if (check === "approved") {
            const result = await signIn('credentials', {
                phone: phone, 
                response: check, 
                redirect: false // Handle redirect manually
            })
            
            if (result?.ok) {
                // Successful authentication - redirect to home
                router.push('/')
            } else {
                // Authentication failed
                setError(true)
                setCode("")
                setFormattedCode("")
            }
        } else {
            setError(true)
            setCode("")
            setFormattedCode("")
        }
    }

    const formatPhoneNumber = (number) => {
        return number;
    }

    const formatCode = (number) => {
        return number;
    }

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, '')
        // Check if the input is numeric and 10 digits long
        if (/^\d{0,10}$/.test(value)) {
            setPhone(value);

            // Format the number and set the formatted state
            const formatted = formatPhoneNumber(value);
            setFormattedNumber(formatted);

            // If 10 digits long, add "+1" to the beginning
            if (value.length === 10) {
                setFormattedNumber(formatted);
            }
        }
    }

    const handleCodeChange = (e) => {
        const value = e.target.value.replace(/\D/g, '')

        if (/^\d{0,6}$/.test(value)) {
            setCode(value);

            // Format the number and set the formatted state
            const formatted = formatCode(value);
            setFormattedCode(formatted);

            // If 10 digits long, add "+1" to the beginning
            if (value.length === 6) {
                setFormattedCode(formatted);
            }
        }
    }

    const handleCancel = () => {
        router.back()
    }

    const checkPhoneNumber = async () => {
        const user = await fetch(`/api/findUserByPhone?phone=${phone}`)
            .then(res => res.json())
        if(!user){
            setError(true)
            setPhone("")
            setFormattedNumber("")
        }else{
            setError(false)
            setSendingState(2)
            await sendOTP()
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
                <div className={"bg-white p-6 text-center rounded shadow-2xl"}>

                    {/* Phone number entry */}
                    <div className={`${sendingState === 1 ? 'visible' : 'hidden'} self-center flex flex-col`}>
                        <PhoneNumberInput
                            value={phone}
                            onChange={(newPhone) => {
                                setPhone(newPhone);
                                setFormattedNumber(newPhone);
                            }}
                            error={error}
                            disabled={false}
                        />
                        <button className={`mt-6 p-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg disabled:bg-gray-300 disabled:text-gray-500 transition-colors duration-200 shadow-lg`} disabled={!phone.startsWith('+1-') || phone.replace(/\D/g, '').length !== 11} onClick={checkPhoneNumber}>
                            Request One-Time Code
                        </button>
                        <Link href="/login" className={`text-red-600 hover:text-red-800 underline mt-5 block text-sm text-center transition-colors duration-200`}>Go Back</Link>
                    </div>

                    {/* Sending message */}
                    <div className={`${sendingState === 2 ? 'visible' : 'hidden'} self-center flex flex-col items-center py-8`}>
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
                        <p className="text-gray-600 text-sm">Sending verification code...</p>
                        <p className="text-xs text-gray-500 mt-2">Please wait a moment</p>
                    </div>

                    {/* Code entry */}
                    <div className={`${sendingState === 3 ? 'visible' : 'hidden'} self-center flex flex-col`}>
                        <OTPInput
                            value={code}
                            onChange={(newCode) => {
                                setCode(newCode);
                                setFormattedCode(newCode);
                            }}
                            error={error}
                            disabled={false}
                            onResend={() => {
                                setCode("");
                                setFormattedCode("");
                                setError(false);
                                sendOTP();
                            }}
                        />
                        <button className={`mt-6 p-3 bg-green-600 hover:bg-green-700 text-white font-medium text-sm rounded-lg disabled:bg-gray-300 disabled:text-gray-500 transition-colors duration-200 shadow-lg`} disabled={code.length !== 6} onClick={checkCode}>
                            Verify Code
                        </button>
                        <button className={`mt-4 text-red-600 hover:text-red-800 underline transition-colors duration-200`} onClick={handleCancel}>
                            Go Back
                        </button>
                    </div>
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
