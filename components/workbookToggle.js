import {useEffect, useState} from 'react'
import {Switch} from '@headlessui/react'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function WorkbookToggle({user, setVersion, setSimpleModal}) {

    const [checked, setChecked] = useState(user?.isYouth)
    async function handleToggle(){
       await setChecked((current) => !current)
       await setSimpleModal(true)
    }

    async function updateWorkbookExperience (){
        await fetch(`/api/update-workbook-experience?userId=${user?._id}&setTo=${checked}`)
        await setVersion(checked)
    }

    useEffect(()=> {
        updateWorkbookExperience().then(()=>{
        })
    }, [checked])

    return (
        <div className={``}>
        <Switch
            checked={checked}
            onChange={() => {
                handleToggle().then()
            }}
            className="flex-shrink-0 group relative rounded-full inline-flex items-center justify-center h-5 w-10 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-orange-300"
        >
            <span className="sr-only">Use setting</span>
            <span aria-hidden="true" className="pointer-events-none absolute bg-white dark:bg-gray-800 w-full h-full rounded-md"/>
            <span
                aria-hidden="true"
                className={classNames(
                    checked ? 'bg-indigo-600 dark:bg-orange-200' : 'bg-gray-200',
                    'pointer-events-none absolute h-4 w-9 mx-auto rounded-full transition-colors ease-in-out duration-200'
                )}
            />
            <span
                aria-hidden="true"
                className={classNames(
                    checked ? 'translate-x-5' : 'translate-x-0',
                    'pointer-events-none absolute left-0 inline-block h-5 w-5 border border-gray-200 rounded-full bg-white dark:bg-orange-600 shadow transform ring-0 transition-transform ease-in-out duration-200'
                )}
            />
        </Switch>
            <span className={`pl-4 dark:text-white`}>{checked ? 'Youth Workbook Active' : 'Adult Workbook Active'}</span>
        </div>
    )
}
