import React, {useState} from 'react';
import {WICountiesList} from "../lib/WI_Counties";
import {ProgramsList} from "../lib/lists";

function ClientDetails({viewingUser}) {

    const [client, setClient] = useState(viewingUser);

    const [dataChanged, setDataChanged] = useState(false)
    const [editMode, setEditMode] = useState(false)

    const handleChange = (e) => {
        const {name, value} = e.target;
        setClient((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setDataChanged(true)
    };

    const handleCountyChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setClient((prevData) => ({
            ...prevData,
            county: selectedOptions
        }));
        setDataChanged(true)
    };

    const handleProgramsChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setClient((prevData) => ({
            ...prevData,
            programs: selectedOptions
        }));
        setDataChanged(true)
    };

    async function saveClientDetails() {
        const {_id, name, street, city, homeCounty, state, zip, county, phone, programs} = client
        const user = await fetch("/api/save-client-details", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
               _id, name, street, city, homeCounty, state, zip, county, phone, programs
            })
        })

        const userJSON = await user.json();
        await setClient(userJSON.user);
        await setDataChanged(false)
        await setEditMode(false)
    }

    return (
        <div
            className={`mt-5 p-6 shadow-xl rounded`}>
            <div className={"flex justify-between"}>
                <h2 className={"uppercase text-gray-500 mb-3 "}>Personal Details</h2>
                <button className={`p-2 text-white text-xs min-w-[140px] ${!editMode ? "bg-indigo-600" : "bg-red-600"}`}
                        onClick={() => {
                            setEditMode(!editMode)
                        }}>{!editMode ? "Edit Client" : "Cancel Editing"}</button>
            </div>
            <div className={"grid grid-cols-3 gap-5"}>
                <div>
                    <label htmlFor="name" className={`text-xs text-gray-500 block`}>First and Last Name</label>
                    <input type={"text"} name={"name"}
                           id="name"
                           autoComplete="off"
                           disabled={!editMode}
                           className={"w-full text-sm block mt-2 disabled:border-gray-200 text-gray-400"}
                           placeholder={"Enter name here..."}
                           value={client.name}
                           onChange={handleChange}/>
                </div>

                <div>
                    <label htmlFor="email" className={`text-xs text-gray-500 block`}>Email </label>
                    <input disabled={true} type={"text"} name={"email"}
                           id="email"
                           autoComplete="off"
                           className={"w-full text-sm block mt-2 disabled:border-gray-200 text-gray-400"}
                           value={client.email}
                           onChange={handleChange}
                    />
                </div>

                <div>
                    <label htmlFor="phone" className={`text-xs text-gray-500 block`}>Phone Number</label>
                    <input type={"text"} name={"phone"}
                           id="phone"
                           autoComplete="off"
                           disabled={!editMode}
                           className={"w-full text-sm block mt-2 disabled:border-gray-200 text-gray-400"}
                           value={client.phone}
                           onChange={handleChange}
                    />
                </div>

                <div>
                    <label htmlFor="street" className={`text-xs text-gray-500`}>Street Address</label>
                    <input type={"text"} name={"street"}
                           id="street"
                           disabled={!editMode}
                           value={client.street}
                           className={"w-full text-sm block mt-2 disabled:border-gray-200 text-gray-400"}
                           placeholder={"Enter street address here..."}
                           onChange={handleChange}/>
                </div>

                <div>
                    <label htmlFor="city" className={`text-xs text-gray-500 block`}>City </label>
                    <input type={"text"} name={"city"}
                           id="city"
                           disabled={!editMode}
                           value={client.city}
                           className={"w-full text-sm block mt-2 disabled:border-gray-200 text-gray-400"}
                           placeholder={"Enter city here..."}
                           onChange={handleChange}/>
                </div>


                <div>
                    <label htmlFor="state" className={`text-xs text-gray-500 block`}>State</label>
                    <input type={"text"} name={"state"}
                           id="state"
                           className={"w-full text-sm block mt-2 disabled:border-gray-200 text-gray-400"}
                           disabled={!editMode}
                           value={client.state}
                           placeholder={"Enter state here..."}
                           onChange={handleChange}/>
                </div>

                <div>
                    <label htmlFor="zip" className={`text-xs text-gray-500 block`}>Zip</label>
                    <input type={"text"} name={"zip"}
                           id="zip"
                           className={"w-full text-sm block mt-2 disabled:border-gray-200 text-gray-400"}
                           disabled={!editMode}
                           value={client.zip}
                           placeholder={"Enter zip code here..."}
                           onChange={handleChange}/>
                </div>

            </div>
            <div className={`border border-b-gray-100 my-10`}></div>
            <div className={`flex gap-10 items-start align-top`}>

                <div>
                    <label htmlFor="county" className={`text-xs text-gray-500 block`}>Service Counties <span
                        className={`text-red-600 text-xs`}>CTRL + Click to select multiple counties</span></label>

                    <select multiple value={client.county}
                            className={"text-xs mt-2 min-h-[210px] disabled:border-gray-200 text-gray-400 w-full"}
                            name={"county"}
                            id="county"
                            onChange={handleCountyChange} disabled={!editMode}>
                        {WICountiesList.map(county => {
                            return <option key={county} value={county}>{county}</option>
                        })}
                    </select>
                </div>

                <div>
                    <label htmlFor="programs" className={`text-xs text-gray-500 block`}>Programs <span
                        className={`text-red-600 text-xs`}>CTRL + Click to select multiple programs</span></label>
                    <select multiple value={client.programs}
                            onChange={handleProgramsChange}  disabled={!editMode}
                            name={"programs"}
                            id={"programs"} className={"text-xs mt-2 min-h-[210px] disabled:border-gray-200 text-gray-400"}>
                        {ProgramsList.map(program => {
                            return <option key={program} value={program}>{program}</option>
                        })}
                    </select>

                    {/*<p className={"text-gray-500 text-xs mt-6 block"}>Programs</p>*/}
                    {/*{client.programs && client.programs.map((program, i) => (*/}
                    {/*    <div className={`text-sm bg-amber-300 text-black mt-2 p-2`} key={i}>{program}</div>*/}
                    {/*))}*/}
                </div>

                <div className={``}>
                    <span className={"text-gray-500 text-xs block"}>Coaches</span>
                    {client.coach && client.coach.filter(coach => !coach.removalDate && !coach.terminationDate).map((coach, i) => (
                        <div className={`text-sm bg-sky-600 text-black mt-2 p-2`} key={i}>
                            <a className={"underline text-white"}
                               href={`mailto:${coach.email}`}>{coach.email}</a>
                        </div>
                    ))}
                </div>

            </div>
            <div className={"text-right pt-8"}>
                <button
                    disabled={!dataChanged}
                    className={`p-2 text-white text-xs min-w-[140px] bg-green-600 disabled:bg-gray-300 ${editMode ? 'visible' : 'hidden'}`}
                    onClick={saveClientDetails}>
                    Save
                </button>
            </div>
        </div>
    );
}

export default ClientDetails;
