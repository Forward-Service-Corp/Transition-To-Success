import React, {useEffect, useState} from 'react';
import {CaretDoubleDown, CaretDoubleUp} from "phosphor-react";
import DreamSingle from "./dreamSingle";

function ClientDreams({viewingUser}) {

    const [dreams, setDreams] = useState([])
    const [newDreamOpen, setNewDreamOpen] = useState(false)
    const [dream, setDream] = useState("")
    const [dreamNeed, setDreamNeed] = useState("")
    const [dreamHelp, setDreamHelp] = useState("")
    const [dreamSectionOpen, setDreamSectionOpen] = useState(true)

    async function deleteDream(dreamId) {
        await fetch("/api/delete-dream?dreamId=" + dreamId)
        getDreams().then(() => {
        })
    }

    async function saveDream() {
        await fetch("/api/post-dream", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                dream,
                dreamNeed,
                dreamHelp,
                userId: viewingUser._id,
                status: "active"
            })
        })
    }

    async function getDreams() {
        await fetch("/api/get-dreams?userId=" + viewingUser._id)
            .then(res => res.json())
            .then(res => { setDreams(res) })
            .catch(err => console.warn(err.json()))
    }

    useEffect(() => {
        getDreams().then()
    },[])


    return (
        <div className={`mt-5 p-6 border rounded ${dreamSectionOpen ? "h-auto" : "h-[80px] overflow-hidden"} dark:border-none dark:bg-black dark:bg-opacity-70 dark:text-white dark:rounded-lg dark:shadow-xl`}>
            <div className={"flex justify-between"}>
                <div className={"uppercase text-gray-500 flex items-center"}>Client Dreams<span
                    className={"rounded-full text-xs bg-orange-600 text-white p-1 w-[24px] inline-block text-center ml-2"}>{dreams.length}</span>
                </div>
                <div onClick={() => {
                    setDreamSectionOpen(!dreamSectionOpen)
                }}>{dreamSectionOpen ? <CaretDoubleUp size={22}/> : <CaretDoubleDown size={22}/>}</div>
            </div>
            <div
                className={`text-orange-600 underline text-xs cursor-pointer mt-2 ${dreamSectionOpen ? "visible" : "hidden"}`}
                onClick={() => {
                    setNewDreamOpen(!newDreamOpen)
                }}>{newDreamOpen ? "Close quick add panel" : "Quick add new client dream"}</div>
            <div
                className={`grid grid-cols-3 gap-4 text-xs rounded border mt-3 overflow-hidden p-3 shadow-xl ${newDreamOpen ? "h-auto" : "h-0 p-0 hidden"} dark:border-none dark:bg-black dark:bg-opacity-70 dark:text-white dark:rounded-lg dark:shadow-xl`}>
                <input className={"text-xs p-1 border-0 border-b-[1px] bg-transparent"}
                       type="text" id={"dream"}
                       value={dream}
                       placeholder={"Enter dream here..."}
                       onChange={(e) => {
                           setDream(e.target.value)
                       }}/>
                <input className={"text-xs p-1 border-0 border-b-[1px] bg-transparent"}
                       type="text" id={"dreamNeed"}
                       value={dreamNeed}
                       placeholder={"What do you need..."}
                       onChange={(e) => {
                           setDreamNeed(e.target.value)
                       }}/>
                <input className={"text-xs p-1 border-0 border-b-[1px] bg-transparent"}
                       type="text" id={"dreamHelp"}
                       value={dreamHelp}
                       placeholder={"Who do you need..."}
                       onChange={(e) => {
                           setDreamHelp(e.target.value)
                       }}/>
                <button
                    className={"py-2 px-6 text-white text-xs rounded bg-gradient-to-t from-orange-600 to-orange-400 disabled:bg-gradient-to-b disabled:from-gray-300 disabled:to-gray-400 w-[150px]"}
                    disabled={dream === ""}
                    onClick={() => {
                        saveDream().then(getDreams)
                        setDream("")
                        setDreamNeed("")
                        setDreamHelp("")
                    }}>Save dream
                </button>
            </div>
            <div className={"grid grid-cols-3 gap-4 mt-6"}>
                {dreams?.map(dream => (
                    <DreamSingle key={dream._id} dream={dream} deleteDream={deleteDream} isClientDream={true}
                                 getDreams={getDreams}
                                 clientId={viewingUser._id} setSavedDreams={setDreams}/>
                ))}
            </div>
        </div>
    );
}

export default ClientDreams;
