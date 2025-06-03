import React from 'react';

function RoleUpdateButton({title, id, role, setRole}) {

    async function saveRole(newRole) {
        await fetch("/api/save-role?userId=" + id + "&role=" + newRole)
            .then(res => res.json())
            .catch(err => console.warn(err))
    }

    async function updateRoleInformation(role){
        await setRole(role)
        await saveRole(role)
    }

    const styleCheck = (title) => {
        switch (title) {
            case 'client':
                return 'bg-indigo-100 shadow cursor-pointer'
            case 'coach':
                return 'bg-green-100 shadow cursor-pointer'
            case 'admin':
                return 'bg-amber-100 shadow cursor-pointer'
            case 'inactive client':
                return 'bg-purple-100 shadow cursor-pointer'
            case 'terminated coach':
                return 'bg-red-100 shadow cursor-pointer'
        }
    }

    const styleCheckActive = (title) => {
        switch (title) {
            case 'client':
                return 'bg-indigo-300 border border-indigo-700 font-bold'
            case 'coach':
                return ' bg-green-300 border border-green-700 font-bold'
            case 'admin':
                return ' bg-amber-300 border border-amber-700 font-bold'
            case 'inactive client':
                return ' bg-purple-300 border border-purple-700 font-bold'
            case 'terminated coach':
                return ' bg-red-300 border border-red-700 font-bold'
        }
    }

    return (
        <div
            className={`${role === title ? styleCheckActive(title) : styleCheck(title)} text-xs px-4 py-2 text-center rounded-full capitalize`}
            onClick={() => updateRoleInformation(title)}>{title}</div>
    );
}

export default RoleUpdateButton;
