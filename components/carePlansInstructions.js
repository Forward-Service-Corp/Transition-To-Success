import React from 'react';
import {CaretDoubleDown, FilePlus} from "phosphor-react";

function CarePlansInstructions() {
    return (
        <div className={"bg-gray-100 p-3 mb-2 text-xs dark:bg-opacity-0 print:hidden"}>

            <div className={"text-lg uppercase text-gray-500 mb-4 "}>Instructions</div>
            <div className={"grid grid-cols-1 md:grid-cols-3 gap-4"}>
                <div className={"p-2 bg-white shadow text-center relative dark:bg-opacity-80 rounded-xl"}>
                    <div
                        className={"absolute left-[-10px] top-[-10px] bg-gray-700 w-[40px] h-[40px] rounded-full flex items-center justify-center align-middle text-white text-xl shadow dark:bg-blue-700"}>1
                    </div>
                    to expand a referral
                    <span
                        className={"bg-gray-700 text-white w-[100px] p-3 flex items-center justify-between m-auto my-2"}>
                            <span className={"inline-block mr-2"}>Tasks: 0 </span>
                            <span className={"inline-block animate-bounce "}><CaretDoubleDown size={20}
                                                                                              color={"white"}/></span>
                        </span>
                </div>

                <div
                    className={"p-2 bg-white shadow flex flex-col items-center align-middle justify-center relative dark:bg-opacity-80 rounded-xl"}>
                    <div
                        className={"absolute left-[-10px] top-[-10px] bg-gray-700 w-[40px] h-[40px] rounded-full flex items-center justify-center align-middle text-white text-xl shadow dark:bg-blue-700"}>2
                    </div>
                    to save a task
                    <div className={"text-center mb-3"}>
                        <span className={"text-sm uppercase"}>Add a new task + </span>
                        <button className={"text-white px-4 py-2 text-xs mt-2 bg-blue-500"}>Save task</button>
                    </div>

                </div>
                <div className={"p-2 bg-white shadow text-center relative dark:bg-opacity-80 rounded-xl"}>
                    <div
                        className={"absolute left-[-10px] top-[-10px] bg-gray-700 w-[40px] h-[40px] rounded-full flex items-center justify-center align-middle text-white text-xl shadow dark:bg-blue-700"}>3
                    </div>
                    to add a note to a task
                    <span
                        className={"bg-gray-200 text-gray-600 w-[140px] p-3 flex items-center justify-between m-auto my-2"}>
                            <span className={"inline-block mr-2"}>Task title...  </span>
                            <span className={"inline-block animate-bounce "}><FilePlus size={20}/></span>
                        </span>
                </div>
            </div>
        </div>
    );
}

export default CarePlansInstructions;
