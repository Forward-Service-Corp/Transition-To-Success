import React, {useState} from 'react';
import {ProgramsList, WICountiesList} from "../../lib/lists";
import Link from "next/link";

function NewPhoneAccount({loginValue, setStep}) {

    const [formValid, setFormValid] = useState(false);
    const [userData, setUserData] = useState({
        first_name: '',
        last_name: '',
        image: '',
        email: '',
        level: 'client',
        timestamp: new Date(),
        phone: loginValue,
        street: '',
        state: 'Wisconsin',
        zip: '',
        homeCounty: '',
        county: [],
        programs: [],
        lastLogin: new Date()
    });
    const [formValidationData, setFormValidationData] = useState({
        first_name: false,
        last_name: false,
        email: false,
        homeCounty: false,
        county: false,
        programs: false,
    });

    const [usedEmail, setUsedEmail] = useState(false);

    const inputJSX = (label, name, value, setValue, disabled, required) => {
        return (
            <div>
                <label htmlFor={name} className={`block mb-2 font-bold`}>{label}<span className={`text-red-600 ${required ? 'visible' : 'hidden'}`}>*</span></label>
                <input type={name === "email" ? "email" : "text"}
                       required={required}
                       defaultValue={value}
                       onChange={setValue}
                       id={name+"-for-phone"}
                       disabled={disabled}
                       name={name}
                       autoComplete="true"
                       className={`rounded mb-4 text-xs w-full ${formValidationData[name] === null ? '' : formValidationData[name] ? 'border-green-600' : 'border-gray-300'}`}
                       placeholder={`Your ${label}...`}/>
            </div>
        )
    }
    const selectJSX = (label, name, value, setValue, disabled, required, list) => {
        return (
            <div className={""}>
                <label htmlFor={name} className={"text-xs w-full block mb-2 font-bold"}>{label}<span
                    className={`text-red-600 ${required ? 'visible' : 'hidden'}`}>*</span></label>
                <select className={`rounded mb-4 text-xs w-full ${formValidationData[name] === null ? '' : formValidationData[name] ? 'border-2 border-green-600' : 'border-gray-300'}`}
                        defaultValue={value}
                        required={required}
                        onChange={setValue}
                        name={name}
                        id={name+"-for-phone"}
                        disabled={disabled}>
                    <option value="">{`Please select a ${label}...`}</option>
                    {list.map(currentCounty => {
                        return (
                            <option key={currentCounty} value={currentCounty}>{currentCounty}</option>
                        )
                    })}
                </select>
            </div>
        )
    }
    const multipleSelectJSX = (label, name, value, setValue, disabled, required, list) => {
        return (
            <div className={""}>
                <label htmlFor={name} className={"text-xs w-full block font-bold"}>{label}<span
                    className={`text-red-600 ${required ? 'visible' : 'hidden'}`}>*</span></label>
                <span className={`text-indigo-600 block mb-2`}>Control + Click to select multiple options</span>
                <select className={`rounded text-xs w-full border-2 ${getFieldClass(required, value)}`}
                        id={name}
                        name={name}
                        defaultValue={value}
                        required={required}
                        onChange={setValue}
                        multiple
                        disabled={disabled}>
                    {list.map(currentCounty => {
                        return (
                            <option key={currentCounty} value={currentCounty}>{currentCounty}</option>
                        )
                    })}
                </select>
            </div>
        )
    }

    const getFieldClass = (required, value) => {
        if(required){
            return value ? 'border-gray-300' : 'border-red-500';
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        updateFormData({ [name]: value })
        updateFormData({ ["phone"]: loginValue })
        updateFormValidationData(name, value)
    };

    const handleCountyChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value);
        setUserData((prevData) => ({
            ...prevData,
            county: selectedOptions
        }));
        updateFormValidationData("county", selectedOptions)
    };

    const handleProgramsChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value);
        setUserData((prevData) => ({
            ...prevData,
            programs: selectedOptions
        }));
        updateFormValidationData("programs", selectedOptions)
    };

    const updateFormValidationData = (name, value) => {
        setFormValidationData((prevData) => {
            let isValid;

            // Check if the input is county or programs (arrays)
            if (name === 'county' || name === 'programs') {
                isValid = Array.isArray(value) && value.length > 0;
            } else {
                // For string values, check if they are non-empty
                isValid = typeof value === 'string' && value.trim() !== '';
            }

            const updatedData = {
                ...prevData,
                [name]: isValid
            };

            let allValid;
            allValid = Object.keys(updatedData).every((key) => updatedData[key] === true);

            if (allValid) {
                setFormValid(true);
            } else {
                setFormValid(false);
            }

            return {
                ...prevData,
                [name]: isValid
            };
        });
    };

    const updateFormData = (newData) => {
        setUserData((prevData) => {
            let hasChanges = false;

            // Iterate over each key in the newData
            for (let key in newData) {
                if (Array.isArray(newData[key])) {
                    // Check if array has changed by comparing lengths and content
                    if (newData[key].length !== prevData[key].length ||
                        !newData[key].every((val, index) => val === prevData[key][index])) {
                        hasChanges = true;
                    }
                } else {
                    // Check if the string value has changed
                    if (newData[key] !== prevData[key]) {
                        hasChanges = true;
                    }
                }
            }

            // If there are changes, return the updated state, otherwise return the old state
            return hasChanges ? { ...prevData, ...newData } : prevData;
        });
    };

    const sendOTP = async () => {
        await fetch(`/api/send-OTP?phone=${loginValue}`)
            .then(res => res.json())
    }

    const checkUsedEmail = async (e) => {
        e.preventDefault()
        const loginCheck = await fetch("/api/check-new-account", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                loginType: "email", loginValue: userData.email
            })
        })
        const data = await loginCheck.json()
        if (data.code === 777) {
            setUsedEmail(false)
            sendAccount().then()
        } else {
            setUsedEmail(true)
        }
        await console.log(data)
    }

    const sendAccount = async () => {
        const createAccount = await fetch("/api/create-new-account", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userData: userData
            })
        })
        const account = await createAccount.json();
        await console.log(account)
        if (account) {
            sendOTP().then()
            setStep(4)
        }
    }

    return (
        <div className={`text-xs`}>
            <div className={``}>
                <h2 className={'pb-4 font-extralight text-2xl my-2 w-full text-center'}>Enter Required
                    Information</h2>
                <div className={`text-xl mt-3 mb-2`}>
                    Personal Details
                </div>
                <form className={``} onSubmit={checkUsedEmail}>
                    <div className={`grid grid-cols-2 gap-x-8`}>
                        {inputJSX('First Name', 'first_name', userData.first_name, handleFormChange, false, true)}
                        {inputJSX('Last Name', 'last_name', userData.last_name, handleFormChange, false, true)}
                        {inputJSX('Email', 'email', userData.email, handleFormChange, false, true)}
                        {inputJSX('Phone', 'phone', loginValue, handleFormChange, true, false)}
                        {selectJSX("County of Residence", 'homeCounty', userData.homeCounty, handleFormChange, false, true, WICountiesList)}
                        {selectJSX("Workbook Version", 'isYouth', userData.state, handleFormChange, false, true, ["Adult", "Youth"])}
                    </div>
                    <div className={``}>
                        <div className={`text-xl mt-3 mb-2`}>
                            Programs
                        </div>
                        <div className={`grid grid-cols-2 gap-x-8`}>
                            {multipleSelectJSX("Service Counties", 'county', userData.county, handleCountyChange, false, true, WICountiesList)}
                            {multipleSelectJSX("Programs", 'programs', userData.programs, handleProgramsChange, false, true, ProgramsList)}
                        </div>
                    </div>
                    <div className={`${usedEmail ? 'visible' : 'hidden'} bg-red-200 p-2 text-center mt-4 rounded`}>
                        There is already an account associated with <span
                        className={'font-bold'}>{userData.email}</span>.
                        Please use a different email address, or sign in with that email address.
                    </div>
                    <div className={`text-center`}>
                        <div className={'w-full p-8'}>
                            <button
                                className={"rounded bg-indigo-600 text-white font-extralight p-2 disabled:bg-gray-300 w-1/2 text-lg"}
                                disabled={!formValid}
                                type={`submit`}>Create Account
                            </button>
                            <Link href="/login" className={`text-red-600 underline mt-5 text-sm block m-auto`}>Go
                                Back</Link>
                        </div>
                    </div>
                </form>
                {/*<div className={`grid grid-cols-2 gap-x-8`}>*/}
                {/*    {inputJSX('First Name', 'first_name', userData.first_name, handleFormChange, false, true)}*/}
                {/*    {inputJSX('Last Name', 'last_name', userData.last_name, handleFormChange, false, true)}*/}
                {/*    {inputJSX('Email', 'email', userData.email, handleFormChange, false, true)}*/}
                {/*    {inputJSX('Phone', 'phone', loginValue, handleFormChange, true, false)}*/}
                {/*    {selectJSX("County of Residence", 'homeCounty', userData.homeCounty, handleFormChange, false, true, WICountiesList)}*/}
                {/*    {selectJSX("Workbook Version", 'isYouth', userData.state, handleFormChange, false, true, ["Adult", "Youth"])}*/}
                {/*</div>*/}
                {/*<div className={``}>*/}
                {/*    <div className={`text-xl mt-3 mb-2`}>*/}
                {/*        Programs*/}
                {/*    </div>*/}
                {/*    <div className={`grid grid-cols-2 gap-x-8`}>*/}
                {/*        {multipleSelectJSX("Service Counties", 'county', userData.county, handleCountyChange, false, true, WICountiesList)}*/}
                {/*        {multipleSelectJSX("Programs", 'programs', userData.programs, handleProgramsChange, false, true, ProgramsList)}*/}
                {/*    </div>*/}
                {/*</div>*/}
                {/*<div className={`${usedEmail ? 'visible' : 'hidden'} bg-red-200 p-2 text-center mt-4 rounded`}>*/}
                {/*    There is already an account associated with <span className={'font-bold'}>{userData.email}</span>. Please use a different email address, or sign in with that email address.*/}
                {/*</div>*/}
                {/*<div className={`text-center`}>*/}
                {/*    <div className={'w-full p-8'}>*/}
                {/*        <button*/}
                {/*            className={"rounded bg-indigo-600 text-white font-extralight p-2 disabled:bg-gray-300 w-1/2 text-lg"}*/}
                {/*            disabled={!formValid}*/}
                {/*            onClick={checkUsedEmail}>Create Account*/}
                {/*        </button>*/}
                {/*        <Link href="/login" className={`text-red-600 underline mt-5 text-sm block m-auto`}>Go*/}
                {/*            Back</Link>*/}
                {/*    </div>*/}
                {/*</div>*/}


            </div>
        </div>
    )
}

export default NewPhoneAccount;
