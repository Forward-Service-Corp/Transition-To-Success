import {WICountiesList} from "../lib/WI_Counties";
import ProfileSectionStyle from "./ProfileSectionStyle";

function ProfilePersonalDetails({name, setName, street, setStreet, city, setCity, state, setState, homeCounty, setHomeCounty, zip, setZip, email, phone, setPhone, setFormattedNumber}) {

    // Highlight empty fields
    const getFieldClass = (required, value) => {
        if(required){
            return value ? 'border-gray-300' : 'border-red-500';
        }
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;

        // Check if the input is numeric and 10 digits long
        if (/^\d{0,10}$/.test(value)) {
            setPhone(value);

            // If 10 digits long, add "+1" to the beginning
            if (value.length === 10) {
                setFormattedNumber(`${value}`);
            } else {
                setFormattedNumber('');
            }
        }
    };

    const inputJSX = (label, value, setValue, placeholder, disabled, autocomplete, required) => {
        return (
            <div className={"py-2"}>
                <p className={"text-sm w-full dark:text-white mb-2"}>{label}{required ? <span className={"text-red-600 text-lg ml-1"}>*</span> : <span className={"text-gray-400 text-xs ml-1"}>(Optional)</span>}</p>
                <input className={`rounded text-sm w-full border-2 ${getFieldClass(required, value)}`}
                       name={label}
                       placeholder={placeholder}
                       type="text"
                       value={value}
                       disabled={disabled}
                       autoComplete={autocomplete}
                       onChange={(e) => {
                           if(label === "Phone"){
                               setValue(e)
                           } else if (label === "Email"){
                                setValue(e.target.value.toLowerCase())
                           }
                           else {
                               setValue(e.target.value)
                           }

                       }}/>
            </div>
        )
    }
    const selectJSX = (label, value, setValue, disabled, required) => {
        return (
            <div className={"py-2"}>
                <p className={"text-sm text-gray-500 w-full dark:text-white"}>{label}{required ? <span className={"text-red-600"}>*</span> : ""}</p>
                <select className={`rounded text-sm w-full border-2 ${getFieldClass(required, value)}`}
                       name={label}
                       value={value}
                       disabled={disabled}
                       onChange={(e) => {
                           setValue(e.target.value)
                       }}>
                    <option key={"Select county of resident"} value={""}>Select county of residence</option>
                    {WICountiesList.map(currentCounty => {
                        return (
                            <option key={currentCounty} value={currentCounty}>{currentCounty}</option>
                        )
                    })}
                </select>
            </div>
        )
    }

    return (
        <ProfileSectionStyle title={`Personal Details`}>
            <p className={`text-gray-600 font-extralight`}>All fields marked with <span className={"text-red-600"}>*</span> are required.</p>
            <div className={"flex flex-col lg:flex-row"}>
                <div className={"lg:flex-1 lg:mr-10"}>
                    {inputJSX("First and Last Name", name, setName, "Enter your first and last name...", false, "false", true)}
                    {inputJSX("Street", street, setStreet, "", false, "false", false)}
                    {inputJSX("City", city, setCity,"",  false, "false", false)}
                    {inputJSX("State", state, setState, "", false, "false", false)}
                    {inputJSX("Zip", zip, setZip, "", false, "false", false)}
                    {selectJSX("County of Residence", homeCounty, setHomeCounty, false, true)}
                    {inputJSX("Email", email, null, "", true, "false", "false")}
                    {inputJSX("Phone", phone, handlePhoneChange, "Enter your 10 digit phone number...", false, "false", false)}
                    <div className={`text-sm`}>
                        <p className={`mt-0`}><strong>Example:</strong> 9206971143</p>
                        <p className={`mt-0`}><strong>NOTE:</strong> This field will only accept numbers. </p>
                    </div>
                </div>
            </div>
        </ProfileSectionStyle>
    );
}

export default ProfilePersonalDetails;
