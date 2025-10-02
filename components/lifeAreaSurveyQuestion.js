import {useEffect, useState} from 'react'
import {Switch} from '@headlessui/react'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function LifeAreaSurveyQuestion({question, value, setter}) {
    const [enabled, setEnabled] = useState(value !== "")

    useEffect(() => {
        setEnabled(value !== "")
    }, [value])

    return (
        <div className={"py-5"}>
            <div className={"flex items-center justify-between"}>
                <div>{question}</div>
                <div className={"flex items-center"}>
                    <span className={"pr-2 text-xs text-gray-500"}>No</span>
                    <Switch
                        checked={enabled}
                        onChange={() => {
                            setEnabled(!enabled)
                            if (enabled) {
                                setter("")
                            }
                        }}
                        className="flex-shrink-0 group relative rounded-full inline-flex items-center justify-center h-5 w-10 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <span className="sr-only">Use setting</span>
                        <span aria-hidden="true"
                              className="pointer-events-none absolute bg-white w-full h-full rounded-md"/>
                        <span
                            aria-hidden="true"
                            className={classNames(
                                enabled ? 'bg-indigo-600' : 'bg-gray-200',
                                'pointer-events-none absolute h-4 w-9 mx-auto rounded-full transition-colors ease-in-out duration-200'
                            )}
                        />
                        <span
                            aria-hidden="true"
                            className={classNames(
                                enabled ? 'translate-x-5' : 'translate-x-0',
                                'pointer-events-none absolute left-0 inline-block h-5 w-5 border border-gray-200 rounded-full bg-white shadow transform ring-0 transition-transform ease-in-out duration-200'
                            )}
                        />
                    </Switch><span className={"pl-2 text-xs text-gray-500"}>Yes</span>
                </div>
            </div>
            <div className={`${enabled ? "visible" : "hidden"} pt-2`}>
                <textarea value={value || ""} onChange={(e) => {
                    setter(e.target.value)
                }} className={"w-full border-gray-300"}/>
            </div>
        </div>
    );
}

export default LifeAreaSurveyQuestion;
