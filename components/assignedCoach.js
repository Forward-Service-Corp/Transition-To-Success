import React from 'react';
import {Trash} from "phosphor-react";

function AssignedCoach({coach, viewingUser, setNewCoaches, setUndo, setLastRemoved}) {
    const [edit, setEdit] = React.useState(false);
    const [coachObject, setCoachObject] = React.useState({});

    const handleChange = () => {
        setEdit(prevState => !prevState);
        if (!edit){
            setCoachObject(prevState => {
                return { ...prevState, email: coach.email, name: coach.name, key: coach.key };
            })

        } else {
            setCoachObject({})
            setLastRemoved({})
        }
    }

    const removeCoach = async () => {
        try {
            const response = await fetch('/api/removeCoach', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: viewingUser._id, coachObject }),
            });
            setUndo(true)
            setLastRemoved(coachObject);
            setTimeout(() => {
                setUndo(false)
            }, 8000)

            const data = await response.json();
            await setNewCoaches(data.user.coach);

            console.log('Coach removed:', data);
        } catch (error) {
            console.error('Error adding coach:', error);
        }
    };

    return (
        <div className={`rounded-full text-xs font-extralight shadow`}>
            <div className={`${edit ? 'hidden' : 'visible'} flex justify-between rounded-full overflow-hidden`}>
                <div className={`bg-green-100 flex-grow px-4 py-2 text-black truncate`}>{coach.email}</div>
                <div className={`bg-red-500 px-4 py-2 flex items-center cursor-pointer`} onClick={handleChange}>
                    <Trash color={'white'} size={16}/>
                </div>
            </div>
            <div className={`${!edit ? 'hidden' : 'visible'} flex justify-between rounded-full overflow-hidden`}>
                <div className={`bg-gray-300 flex-1 px-4 py-2 text-gray-800 text-center cursor-pointer`} onClick={handleChange}>Cancel</div>
                <div className={`bg-red-500 flex-1 px-4 py-2 text-center text-white cursor-pointer`} onClick={removeCoach}>Confirm</div>
            </div>
        </div>
    );
}

export default AssignedCoach;
