import React, {useState} from 'react';
import Link from "next/link";

function LoginTypeCheck({loginValue, setLoginValue, loginType, setLoginType, setStep}) {

    const [checking] = useState(false);
    const [loginTypeValid, setLoginTypeValid] = useState(false);
    const [error, setError] = useState({})

    const validateInput = (val) => {
        const phonePattern = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        setLoginValue(val.toLowerCase());
        if (phonePattern.test(val)) {
            setLoginTypeValid(true);
            setLoginType("phone");
        } else if (emailRegex.test(val)){
            setLoginTypeValid(true);
            setLoginType("email")
        } else {
            setLoginTypeValid(false);
            setLoginType("")
        }
    };

    const handleLoginValueChange = (e) => {
        const { value } = e.target;
        validateInput(value);
    }

    const checkNewAccount = async () => {
        const accountCheck = await fetch('/api/check-new-account', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                loginType, loginValue, loginFrom: "new-account"
            })
        })
        const data = await accountCheck.json()
        if (data.code === 666) {
            setError({code: 666, message: "There is already an account with that email address or phone number."})
        } else {
            if (loginType === "email") {
                setStep(2)
            } else {
                setStep(3)
            }
        }
        await console.log(data)
    }

    const loginCheckJSX = (label, name, value, setValue, disabled, required) => {
        return (
            <div>
                <input type={name === "email" ? "email" : "text"}
                       required={required}
                       defaultValue={value}
                       onChange={setValue}
                       id={name}
                       disabled={disabled}
                       name={name}
                       autoComplete="true"
                       className={`rounded mb-4 text-2xl text-center font-extralight w-full`}
                       placeholder={`${label}...`}/>
            </div>
        )
    }

    return (
        <div
            className={`text-xs`}
            name={'checkLoginType'}>
            <div className={`text-center`}>
                <h2 className={'pb-4 font-extralight text-2xl my-2 w-full text-center'}>Enter an Email or Phone
                    Number</h2>

                <div className={`px-10`}>
                    {loginCheckJSX('Email or Phone Number', 'loginValue', loginValue, handleLoginValueChange, false, true)}
                    <div
                        className={`bg-green-100 p-4 text-center rounded ${checking ? 'visible' : 'hidden'}`}>One
                        moment please...
                    </div>
                    <div
                        className={`bg-red-200 p-4 text-center rounded ${error.code === 666 ? 'visible' : 'hidden'}`}>{error.message}
                    </div>
                </div>

                <div className={`text-center`}>
                    <div className={'w-full p-8'}>
                        <button
                            className={"rounded bg-indigo-600 text-white font-extralight p-2 disabled:bg-gray-300 w-1/2 text-lg"}
                            disabled={!loginTypeValid}
                            onClick={checkNewAccount}>Next
                        </button>
                        <Link href="/login" className={`text-red-600 underline mt-5 text-sm block m-auto`}>Go
                            Back</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginTypeCheck;
