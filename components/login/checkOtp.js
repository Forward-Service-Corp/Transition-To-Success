import React, {useState} from 'react';
import Link from "next/link";
import {signIn} from "next-auth/react";

function CheckOtp({loginValue}) {
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
        <div className={`${error ? 'visible' : 'hidden'} text-red-600 text-sm mb-4`}>
            The code that was entered is incorrect. Please try again.
        </div>
        <input type="text" value={code} onChange={handleCodeChange}
               id={'code'}
               className={`rounded ${formattedCode.length === 6 ? 'border-2 border-green-600' : 'border-gray-300'}`}
               placeholder={"6 digit code..."}/>
        <button className={`mt-4 p-2 bg-green-600 text-white rounded disabled:bg-gray-300`}
                disabled={formattedCode.length !== 6} onClick={checkCode}>
            Submit Code
        </button>
        <div>
            <Link href="/login" className={`text-red-600 underline mt-5 text-sm block m-auto`}>Go
                Back</Link>
        </div>
    </div>
    );
}

export default CheckOtp;
