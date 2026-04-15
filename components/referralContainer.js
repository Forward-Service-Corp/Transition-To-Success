import React, { useCallback, useEffect, useState } from "react";
import CarePlanDomain from "./carePlanDomain";
import {
  CaretDoubleDown,
  CaretDoubleUp,
  Trash,
  CheckCircle,
  Files,
} from "phosphor-react";
import TaskTodo from "./taskTodo";
import { labelMap } from "../lib/serviceLabelsMap";
import { useRouter } from "next/router";

function ReferralContainer({
  item,
  user,
  notes,
  setUserReferrals,
  updateTaskHandler,
  modifier,
  loggedInUser,
  tasks,
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [storedOpen, setStoredOpen] = useState(false);
  const [task, setTask] = useState("");
  const [taskArr, setTasks] = useState(tasks);
  const [allNotes, setAllNotes] = useState(notes);
  const [saving, setSaving] = useState("false");

  async function saveTask() {
    await setSaving("saving");

    //Create a new task object to immediately update the UI
    const newTask = {
      _id: Date.now().toString(), // Temporary ID until we get the real one from the server
      referralId: item._id,
      userId: user._id,
      task: task,
      surveyId: item.surveyId,
      timestamp: new Date(),
      modifiedBy: modifier,
      completed: "false",
    };

    // Immediately update the task state with the new task
    // setTasks(prevTasks => [...prevTasks, newTask]);

    const data = await fetch("/api/save-task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        referralId: item._id,
        userId: user._id,
        task: task,
        surveyId: item.surveyId,
        timestamp: new Date(),
        modifiedBy: modifier,
      }),
    });
    const res = await data.json();
    console.log(res);
    // After saving the task, get the updated tasks list to ensure we have the correct server-generated ID
    await getTasks();
    await setSaving("false");
  }

  const getTasks = useCallback(() => {
    fetch("/api/get-tasks?userId=" + user._id + "&referralId=" + item._id)
      .then((res) => res.json())
      .then((res) => setTasks(res))
      .then(() => setSaving("false"))
      .catch((e) => console.log(e));
  }, [item._id, setTasks, user._id]);

  async function deleteReferral(referralId) {
    await fetch("/api/delete-referral?referralId=" + referralId);
  }

  async function deleteCustomReferral(id) {
    await fetch("/api/delete-custom-referral?referralId=" + id);
  }

  async function setReferralStatus(referralId, status) {
    await fetch(
      "/api/set-referral-status?referralId=" + referralId + "&status=" + status,
    );
  }

  async function setCustomReferralStatus(referralId, status) {
    await fetch(
      "/api/set-custom-referral-status?referralId=" +
        referralId +
        "&status=" +
        status,
    );
  }

  async function getReferrals() {
    const data = await fetch("/api/get-referrals?userId=" + user._id);
    const res = await data.json();
    console.log(data.success);
    console.log(data.ok);
    console.log(res);
    if (data.ok) {
      await setUserReferrals(res);
      await setSaving("false");
      await updateTaskHandler(taskArr);
    } else {
      await setSaving("error");
    }
  }

  useEffect(() => {
    const handleBeforePrint = () => {
      setStoredOpen(open);
      setOpen(true);
    };
    const handleAfterPrint = () => setOpen(storedOpen);
    document
      .getElementById("careplanwidget")
      .addEventListener("beforeprint", handleBeforePrint);
    //document.getElementById("careplanwidget").addEventListener("afterprint", handleAfterPrint)

    return () => {
      if (document.getElementById("careplanwidget")) {
        document
          .getElementById("careplanwidget")
          .removeEventListener("beforeprint", handleBeforePrint);
        //document.getElementById("careplanwidget").removeEventListener("afterprint", handleAfterPrint)
      }
    };
  });

  return (
    <div
      id="careplanwidget"
      className={
        "my-3  dark:bg-black dark:text-white dark:overflow-hidden dark:bg-opacity-70 dark:rounded-lg dark:shadow-xl"
      }
      key={item._id}
      style={{ breakInside: "avoid" }}
    >
      <div
        className={`flex justify-start items-center text-sm font-light relative p-3 ${item.archived !== "true" ? "bg-orange-300 text-black" : "bg-gray-300 text-black print:hidden"}`}
      >
        <div
          className={"w-[160px] ml-4 whitespace-nowrap mr-3 truncate font-bold"}
        >
          {labelMap[item.domain]}
        </div>
        <div className={"truncate max-w-[200px]"}>{item.name}</div>
        <div
          className={
            "absolute right-[0px] min-w-[130px] flex items-center justify-between h-full  bg-gray-700"
          }
        >
          <div className={`ml-8 text-white`}>
            Tasks:{" "}
            {
              taskArr?.filter(
                (task) =>
                  task.referralId === item._id &&
                  eval(task.completed) === false,
              ).length
            }
          </div>
          <div
            className={"p-3 cursor-pointer text-xs"}
            onClick={() => {
              setOpen(!open);
            }}
          >
            {open ? (
              <CaretDoubleUp size={20} weight="thin" color={"white"} />
            ) : (
              <CaretDoubleDown size={20} weight="thin" color={"white"} />
            )}
          </div>
        </div>
      </div>
      <div
        className={`flex justify-between items-center bg-gray-100 p-2  ${open ? "visible" : "hidden print:flex"} dark:bg-black dark:bg-opacity-80`}
      >
        <div
          className={"flex items-center text-xs cursor-pointer print:hidden"}
          onClick={() => {
            router.push("/surveys/" + item.surveyId).then();
          }}
        >
          <div className={`${item.surveyId === null ? "hidden" : "visible"} `}>
            <Files
              size={20}
              weight="thin"
              color={"blue"}
              className={"inline"}
            />
            <span className={"text-blue-600 dark:text-orange-400 inline"}>
              View associated Life Area Survey
            </span>
          </div>
        </div>
        {item.hasOwnProperty("archived") && item.archived === "true" ? (
          <div
            className={"flex items-center cursor-pointer print:hidden"}
            onClick={() => {
              if (item.isCustom) {
                setCustomReferralStatus(item._id, false).then(getReferrals);
              } else {
                setReferralStatus(item._id, false).then(getReferrals);
              }
            }}
          >
            <div>
              <CheckCircle size={20} weight={"thin"} color={"blue"} />
            </div>
            <div
              className={
                "text-blue-600 text-xs cursor-pointer dark:text-orange-400"
              }
            >
              Make active again
            </div>
          </div>
        ) : (
          <div
            className={"flex items-center cursor-pointer print:hidden"}
            onClick={() => {
              if (item.isCustom) {
                setCustomReferralStatus(item._id, true).then(getReferrals);
              } else {
                setReferralStatus(item._id, true).then(getReferrals);
              }
            }}
          >
            <div>
              <CheckCircle size={20} weight={"thin"} color={"blue"} />
            </div>
            <div
              className={
                "text-blue-600 text-xs cursor-pointer dark:text-orange-400"
              }
            >
              Mark referral complete
            </div>
          </div>
        )}

        {item.hasOwnProperty("archived") && item.archived === "true" ? (
          <div
            className={"flex items-center cursor-pointer ml-5 print:hidden"}
            onClick={() => {
              if (
                confirm(
                  "You are about to delete this referral and all of its details. This cannot be undone.",
                )
              ) {
                if (item.isCustom) {
                  deleteCustomReferral(item._id).then(getReferrals);
                } else {
                  deleteReferral(item._id).then(getReferrals);
                }
              }
            }}
          >
            <div>
              <Trash size={20} weight={"thin"} color={"red"} />
            </div>
            <div className={"text-red-600 text-xs cursor-pointer"}>
              Delete this referral
            </div>
          </div>
        ) : null}
      </div>
      <div
        className={`flex ${open ? "" : "hidden"} ${item.hasOwnProperty("archived") && item.archived === "true" ? "print:!hidden" : ""} flex-col md:flex-row print:flex print:flex-col`}
      >
        <CarePlanDomain item={item} />
        <div className={"w-full p-5 inline"}>
          <h2 className={"uppercase text-orange-600 mb-2 print:hidden"}>
            Add a new task
          </h2>
          <input
            type={"text"}
            className={
              "w-full border-0 border-b-[1px] p-1 text-sm font-light print:hidden"
            }
            id={item._id}
            value={task}
            placeholder={"Enter new todo item..."}
            onChange={(e) => {
              setTask(e.target.value);
            }}
          />
          <div className={"flex justify-end"}>
            <button
              className={
                "mt-2 mb-4 text-white px-4 py-2 text-xs bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 print:hidden"
              }
              onClick={() => {
                saveTask().then(() => {
                  getTasks();
                });
                setTask("");
              }}
              disabled={task === ""}
            >
              Save task
            </button>
          </div>
          <div
            className={`${saving === "saving" || saving === "error" ? "visible" : "hidden"} p-2 rounded ${saving === "saving" ? "bg-green-100" : "bg-red-100"} text-xs mb-4`}
          >
            {saving === "saving" ? "Saving..." : "Save error. Refresh page."}
          </div>
          <div className={"uppercase text-orange-600 text-sm mb-1"}>Tasks</div>
          {taskArr &&
            taskArr
              .filter((item) => eval(item.completed) === false)
              .map((task, i) => {
                return (
                  <div className={"border-l-[1px]"} key={i}>
                    <TaskTodo
                      item={item}
                      task={task}
                      user={user}
                      setTasks={setTasks}
                      setSaving={setSaving}
                      allNotes={allNotes}
                      loggedInUser={loggedInUser}
                      setAllNotes={setAllNotes}
                      i={i}
                    />
                  </div>
                );
              })}

          {taskArr &&
          taskArr.filter((item) => eval(item.completed) === true).length > 0 ? (
            <div className={"uppercase text-orange-600 text-sm mt-4"}>
              Completed
            </div>
          ) : null}

          {taskArr &&
            taskArr
              .filter((item) => eval(item.completed) === true)
              .map((task, i) => {
                return (
                  <div className={"border-l-[1px]"} key={i}>
                    <TaskTodo
                      item={item}
                      task={task}
                      user={user}
                      setTasks={setTasks}
                      setSaving={setSaving}
                      allNotes={allNotes}
                      loggedInUser={loggedInUser}
                      setAllNotes={setAllNotes}
                    />
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
}

export default ReferralContainer;
