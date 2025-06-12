import React from 'react';
import {Plus} from "phosphor-react";

function AddCoach({coach, searchTerm, addCoachFunc, setCoachObject}) {
    const [edit, setEdit] = React.useState(false);

    const handleChange = () => {
        setEdit(prevState => !prevState);
        if (!edit){
            setCoachObject(prevState => {
                return { ...prevState, email: coach.email, name: coach.name, _id: coach._id };
            })

        } else {
            setCoachObject({})
        }

    }

    const getHighlightedText = (text, highlight) => {
        if (!highlight.trim()) {
            return text; // No highlight if the search term is empty
        }

        // Split the text by the search term and preserve case sensitivity
        const parts = text.split(new RegExp(`(${highlight})`, 'gi'));

        return parts.map((part, index) =>
            part.toLowerCase() === highlight.toLowerCase() ? (
                <span key={index} style={{ fontWeight: 'bold' }}>{part}</span>
            ) : (
                part
            )
        );
    };

    return (
        <div className={`rounded-full text-xs font-extralight`} key={coach._id}>
            <div className={`${edit ? 'hidden' : 'visible'} flex justify-between rounded-full overflow-hidden`}>
                <div className={`bg-gray-200 flex-grow px-4 py-2 text-black truncate`}>{getHighlightedText(coach.email, searchTerm)}</div>
                <div className={`bg-green-500 px-4 py-2 flex items-center cursor-pointer`} onClick={handleChange}>
                    <Plus color={'white'} size={16}/>
                </div>
            </div>
            <div className={`${!edit ? 'hidden' : 'visible'} flex justify-between rounded-full overflow-hidden`}>
                <div className={`bg-gray-300 flex-1 px-4 py-2 text-gray-800 text-center cursor-pointer`} onClick={handleChange}>Cancel</div>
                <div className={`bg-green-500 flex-1 px-4 py-2 text-center text-white cursor-pointer`} onClick={addCoachFunc}>Confirm</div>
            </div>
        </div>
    );
}

export default AddCoach;
