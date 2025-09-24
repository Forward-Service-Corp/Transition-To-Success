import React, {useState} from 'react';
import Link from "next/link";
import {signIn} from "next-auth/react";
import OTPInput from "../OTPInput";

function CheckOtp({loginValue, onResend}) {
    const [error, setError] = useState(false);
    const [code, setCode] = useState("");
    const [formattedCode, setFormattedCode] = useState("")

    const formatCode = (number) => {
        return number;
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
    const checkCode = async () => {
        const check = await fetch(`/api/check-OTP?phone=${loginValue}&code=${code}`)
            .then(res => res.json())
        if (check === "approved") {
            const result = await signIn('credentials', {
                phone: loginValue, 
                response: check, 
                redirect: false // Handle redirect manually
            })
            
            if (result?.ok) {
                // Successful authentication - redirect to home
                window.location.href = '/'
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
    return (
        <div className={`self-center flex flex-col`}>
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
                    if (onResend) onResend();
                }}
            />
            <button className={`mt-6 p-3 bg-green-600 hover:bg-green-700 text-white font-medium text-sm rounded-lg disabled:bg-gray-300 disabled:text-gray-500 transition-colors duration-200 shadow-lg`}
                    disabled={code.length !== 6} onClick={checkCode}>
                Verify Code
            </button>
            <div>
                <Link href="/login" className={`text-red-600 hover:text-red-800 underline mt-5 text-sm block m-auto transition-colors duration-200`}>Go Back</Link>
            </div>
        </div>
    );
}

export default CheckOtp;
