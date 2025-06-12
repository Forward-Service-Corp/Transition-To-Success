import React, {useState} from 'react';
import AssignedCoach from "./assignedCoach";
import AddCoach from "./addCoach";
import {ArrowCounterClockwise} from "phosphor-react";

function CoachAssignments({coachesJson, viewingUser}) {

    const [newCoaches, setNewCoaches] = useState(viewingUser.coach || [])
    const [searchTerm, setSearchTerm] = useState("")
    const [addCoach, setAddCoach] = useState(false)
    const [undo, setUndo] = useState(false)
    const [lastRemoved, setLastRemoved] = useState({})
    const [coachObject, setCoachObject] = React.useState({});
    const [fullHistory, setFullHistory] = React.useState(false);

    // At component level, derive active coaches
    const activeCoaches = newCoaches.filter(c =>
        !c.terminationDate && !c.removalDate
    );

    console.log('Active coaches:', activeCoaches);

    const addCoachFunc = async () => {
        try {
            const response = await fetch('/api/addCoach', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({userId: viewingUser._id, coachObject}),
            });

            const data = await response.json();
            await setNewCoaches(data.user.coach);
            setSearchTerm("")
            setAddCoach(false)


            console.log('Coach added:', data);
        } catch (error) {
            console.error('Error adding coach:', error);
        }
    };

    const undoCoachFunc = async () => {
        try {
            const response = await fetch('/api/addCoach', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({userId: viewingUser._id, coachObject: lastRemoved}),
            });

            const data = await response.json();
            await setNewCoaches(data.user.coach);
            setUndo(false)

            console.log('Coach added:', data);
        } catch (error) {
            console.error('Error adding coach:', error);
        }
    };


    const handleAddCoach = () => {
        setAddCoach(prevState => !prevState)
        setSearchTerm("")
    }

    return (
        <div className={"bg-gray-100 p-6 mb-5 rounded"}>
            <div className={"flex justify-between items-center border-0 border-b py-2 mb-4"}>
                <div>
                    <h2 className={"uppercase text-gray-500"}>Assigned Coaches</h2>
                </div>
                <div className={`${undo ? 'visible' : 'hidden'} flex text-sm text-gray-400 items-center`}
                     onClick={undoCoachFunc}>
                    <ArrowCounterClockwise size={20} color={'red'}/><span className={`mx-2`}>Undo remove coach:</span>
                    <span className={`text-black`}> {lastRemoved.email}</span>.
                </div>
                <button
                    className={`${addCoach ? 'bg-red-500' : 'bg-indigo-500'} text-xs rounded-full text-white px-4 py-2`}
                    onClick={handleAddCoach}>{addCoach ? '- Cancel add coach' : '+ Add coach'}</button>
            </div>
            <div id={`current-coaches-div`} className={"grid grid-cols-4 gap-4"}>
                {newCoaches?.filter(c => c.terminationDate === undefined && c.removalDate === undefined).map((coach, i) => (
                    <AssignedCoach key={i} coach={coach} viewingUser={viewingUser}
                                   setUndo={setUndo} setLastRemoved={setLastRemoved} setNewCoaches={setNewCoaches}/>
                ))}
            </div>
            <div className={`mt-8 ${addCoach ? "visible" : "hidden"}`}>
                <div className={"flex justify-between items-center border-0 border-y py-2 mb-4"}>
                    <div>
                        <span className={"uppercase text-gray-500"}>Add New Coach</span>
                        <span id={`add-coaches-span`}
                              className={`${searchTerm === "" ? 'hidden' : 'visible'} text-xs text-gray-800`}>
                            - {coachesJson.filter(coach =>
                            coach.email.includes(searchTerm) && !newCoaches.coach?.some(userCoach => userCoach.email === coach.email)).length} {coachesJson.filter(coach =>
                            coach.email.includes(searchTerm) && !newCoaches.coach?.some(userCoach => userCoach.email === coach.email)).length === 1 ? 'result' : 'results'}</span>
                    </div>
                    <div className={`flex items-center`}>
                        <input id={"filter-coaches"} type="text" className={`border-gray-300 text-xs rounded`}
                               value={searchTerm}
                               placeholder={"Search coaches..."} onChange={e => setSearchTerm(e.target.value)}/>
                        <button
                            className={`px-6 py-2 ml-3 text-xs bg-red-500 text-white disabled:bg-gray-300 disabled:text-gray-500 rounded-full`}
                            disabled={searchTerm === ""}
                            onClick={() => {
                                setSearchTerm("")
                            }}>Clear
                        </button>
                    </div>
                </div>
                <div className={"grid grid-cols-4 gap-4"}>
                    {
                        searchTerm !== "" && coachesJson.filter(coach =>
                            coach.email.includes(searchTerm) &&
                            !activeCoaches.some(userCoach => userCoach.email === coach.email)
                        ).map(coach => (
                                <AddCoach coach={coach} key={coach._id} viewingUser={viewingUser}
                                          setNewCoaches={setNewCoaches}
                                          searchTerm={searchTerm} addCoachFunc={addCoachFunc}
                                          setCoachObject={setCoachObject}/>
                            ))
                    }
                </div>
            </div>
            <div className={`flex justify-end mt-6`}>
                <div>
                    <button onClick={() => {
                        setFullHistory(prevState => !prevState)
                    }}
                            className={`${fullHistory ? "text-red-600" : "text-indigo-600"} text-xs font-extralight`}>{fullHistory ? "- Hide full coach history" : "+ View full coach history"}</button>
                </div>
            </div>
            <div className={`${!fullHistory ? 'hidden' : 'visible'}`}>
                <div className={"inline-block min-w-full py-2 align-middle"}>
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                        <tr>
                            <th scope="col"
                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                Name
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Email
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Phone
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Add Date
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Removal Date
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Termination Date
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {newCoaches?.map((coach, i) => (
                            <tr key={i}>
                                <td className="whitespace-nowrap py-4 pl-4 text-xs pr-3 font-medium text-gray-900 sm:pl-0">{coach?.name}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{coach?.email}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{coach?.phone}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{coach?.timestamp}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{coach?.removalDate}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{coach?.terminationDate}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default CoachAssignments;
