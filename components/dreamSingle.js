import React, {useState} from 'react';
import {useRouter} from "next/router";
import {Brain, Trash, NotePencil, FloppyDisk} from "phosphor-react";
import moment from "moment";

function DreamSingle({dream, isClientDream, clientId, setSavedDreams}) {

    const [editMode, setEditMode] = useState(false)
    const [updateSuccess, setUpdateSuccess] = useState(false)
    const [newDream, setNewDream] = useState(dream.dream.toString())
    const [need, setNeed] = useState(dream.dreamNeed.toString())
    const [help, setHelp] = useState(dream.dreamHelp.toString())
    const [currentStatus, setCurrentStatus] = useState(dream.status || "active")

    async function updateDream(value, id) {
        await changeDreamStatus(value, id)
        await fetch("/api/update-dream", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                dreamId: id,
                dream: newDream,
                dreamNeed: need,
                dreamHelp: help,
                dreamStatus: value
            })
        })
            .then(r => r.json())
    }

    const changeDreamStatus = (value, id) => {
         setSavedDreams((prevDreams) =>
            prevDreams.map((dream) =>
                dream._id === id
                    ? { ...dream, status: value }
                    : dream
            )
        );
    };

    async function deleteDream(dreamId) {
       await fetch("/api/delete-dream?dreamId=" + dreamId)
           .then(r => r.json())
           .then(r => setSavedDreams(r) )
    }

    const router = useRouter()
    return (
        <div className={"mb-4 flex flex-col shadow-xl justify-between bg-white dark:bg-black dark:text-white dark:rounded-xl dark:overflow-hidden dark:bg-opacity-70"}>
            <div>
                <div className={"bg-gray-700 p-2 text-white text-sm font-light flex items-center"}>
                    <div><Brain size={26} weight="thin"/></div>
                    <div className={`ml-2 truncate ${editMode ? "hidden" : "visible"}`}>{newDream}</div>
                    <input
                        type={"text"} id={"new-dream"+dream._id}
                        className={`${editMode ? "visible" : "hidden"} p-0 ml-2 bg-gray-700 border-0 w-full border-b-[1px] text-sm font-light`}
                        placeholder={newDream}
                        value={newDream}
                        onChange={(e) => {
                            setNewDream(e.target.value)
                        }}/>
                </div>
                <div
                    className={"bg-gray-100 px-2 py-2 text-xs relative dark:bg-black dark:bg-opacity-80"}>
                    {moment(dream.timestamp).format("MMMM Do YYYY @ h:mm a")}
                    <div className={`absolute right-2 top-2 text-red-600 ${editMode ? "visible" : "hidden"}`}>Editing
                    </div>
                    <div
                        className={`absolute right-2 top-2 text-green-600 ${updateSuccess ? "visible" : "hidden"}`}>Update
                        successful
                    </div>
                </div>
                <div className={`p-2 text-xs border-b ${editMode === true ? "hidden" : "visible"} dark:border-gray-800`}>Status: {dream.status}</div>
                <div>
                    <select className={`text-xs w-full border-none ${editMode ? "visible" : "hidden"}`}
                            id={"statusSelect"+dream._id}
                            value={currentStatus}
                            onChange={(e) => {
                                setCurrentStatus(e.target.value)
                            }}>
                        <option value="active">Active</option>
                        <option value="complete">Complete</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>
                <div>
                    <div className={"px-5 py-2"}>
                        <p className={"text-xs text-gray-500 "}>What I need:</p>
                        <p className={`text-sm mt-0 ${editMode ? "hidden" : "visible"}`}>{need}</p>
                        <input type={"text"} id={"new-dreamNeed"+dream._id}
                               className={`${editMode ? "visible" : "hidden"} p-0  border-0 w-full border-b-[1px] text-sm font-light`}
                               placeholder={need} value={need}
                               onChange={(e) => {
                                   setNeed(e.target.value)
                               }}/>
                    </div>
                    <div className={"px-5 pb-5"}>
                        <p className={"text-xs text-gray-500  "}>Who I need to help me is: </p>
                        <p className={`text-sm mt-0  ${editMode ? "hidden" : "visible"}`}>{help}</p>
                        <input type={"text"} id={"new-dreamHelp"+dream._id}
                               className={`${editMode ? "visible" : "hidden"} p-0  border-0 w-full border-b-[1px] text-sm font-light`}
                               placeholder={help} value={help}
                               onChange={(e) => {
                                   setHelp(e.target.value)
                               }}/>
                    </div>
                </div>
            </div>

            <div className={"flex text-xs text-center"}>

                <div className={"bg-blue-500 hover:bg-blue-600 text-white p-2 flex-1 cursor-pointer dark:bg-indigo-800 dark:hover:bg-indigo-600"}

                     onClick={() => {
                         if (isClientDream) {
                             router.push("/new-life-area-survey?dreamName=" + dream.dream + "&dreamId=" + dream._id + "&clientId=" + clientId).then()
                         } else {
                             router.push("/new-life-area-survey?dreamName=" + dream.dream + "&dreamId=" + dream._id).then()
                         }

                     }}>Create life area survey
                </div>

                <div className={`${editMode ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 hover:bg-gray-600"} text-white p-2 flex-1 cursor-pointer max-w-[40px] flex justify-center`}
                     onClick={() => {
                         setEditMode(!editMode)
                         if (editMode) {
                             updateDream(currentStatus, dream._id).then(() => {
                                 setUpdateSuccess(true)
                                 setTimeout(() => {
                                     setUpdateSuccess(false)
                                 }, 3000)
                             })
                         }
                     }}>{editMode ? <div><FloppyDisk size={15}/></div> : <div><NotePencil size={15}/></div>}
                </div>

                <div className={"bg-red-500 hover:bg-red-600 text-white p-2 flex-1 cursor-pointer max-w-[40px] flex justify-center"}
                     alt={"Delete this dream"}
                     onClick={() => {
                         if (confirm("Are you sure you want to delete this dream?")) {
                             deleteDream(dream._id).then()
                         }
                     }}><div><Trash size={15}/></div>
                </div>

            </div>
        </div>
    );
}

export default DreamSingle;
