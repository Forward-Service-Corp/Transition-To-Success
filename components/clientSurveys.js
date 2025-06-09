import React, {useState} from 'react';
import LasCurrent from "./lasCurrent";
import {CaretDoubleDown, CaretDoubleUp} from "phosphor-react";
import LasHistory from "./lasHistory";

function ClientSurveys({viewingUser, viewingUserData}) {

    const [lasSectionOpen, setLasSectionOpen] = useState(false)
    const [surveys, setSurveys] = useState(viewingUserData.surveys)

    return (
        <div className={"mt-5 p-6 border rounded dark:border-none dark:bg-black dark:bg-opacity-70 dark:text-white dark:rounded-lg dark:shadow-xl"}>
            <h2 className={"uppercase text-gray-500 mb-6"}>Current Life Area Survey</h2>
            <LasCurrent user={viewingUser} surveys={surveys} isClientSurvey={true} clientId={viewingUser._id}/>

            <div className={"flex justify-between mt-6 mb-6"}>
                <div className={"uppercase text-gray-500 flex items-center"}>Life Area Survey History<span
                    className={"rounded-full text-xs bg-orange-600 text-white p-1 w-[24px] inline-block text-center ml-2"}>{surveys.length > 1 ? (surveys.length - 1) : 0}</span>
                </div>
                <div onClick={() => {
                    setLasSectionOpen(!lasSectionOpen)
                }}>{lasSectionOpen ? <CaretDoubleUp size={22}/> : <CaretDoubleDown size={22}/>}</div>
            </div>
            <div className={`${lasSectionOpen ? "visible" : "hidden"}`}>
                <LasHistory surveys={surveys} isClientView={true}/>
            </div>

        </div>
    );
}

export default ClientSurveys;
