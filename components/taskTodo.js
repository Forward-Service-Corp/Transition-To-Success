import React, { useState } from "react";
import { FilePlus, Trash } from "phosphor-react";
import moment from "moment";
import NoteItem from "./noteItem";

function TaskTodo({
  task,
  setTasks,
  user,
  item,
  setAllNotes,
  loggedInUser,
  setSaving,
  allNotes,
  i,
}) {
  const [note, setNote] = useState("");
  const [noteOpen, setNoteOpen] = useState(false);

  async function setTaskStatus(taskId, setTo) {
    // Immediately update the task status in the UI
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t._id === taskId ? { ...t, completed: setTo.toString() } : t,
      ),
    );

    // Update the task status in the database
    const response = await fetch(
      "/api/update-task-status?taskId=" + taskId + "&setTo=" + setTo,
    );
    const data = await response.json();
    if (response.ok) {
      console.log(data);
      // After updating the task status, get the updated tasks list to ensure sync
      await getTasks();
    }
  }

  // This function is no longer needed as we're getting the updated tasks from the server
  // const toggleTaskCompletion = (taskId) => {
  //     setTasks((prevTasks) =>
  //         prevTasks.map((task) =>
  //             task.id === taskId
  //                 ? { ...task, completed: !task.completed }
  //                 : task
  //         )
  //     );
  // };

  async function deleteTask(taskId) {
    await setSaving(true);

    // Immediately update the tasks state by removing the deleted task
    await setTasks((prevTasks) => prevTasks.filter((t) => t._id !== taskId));
    const response = await fetch("/api/delete-task?taskId=" + taskId);
    if (response.ok) {
      // After deleting the task, get the updated tasks list from the server to ensure sync
      await getTasks();
    }
  }

  async function getTasks() {
    const data = await fetch(
      "/api/get-tasks?userId=" + user._id + "&referralId=" + item._id,
    );
    const res = await data.json();
    if (res.success) {
      console.log(res);
      await setTasks(res);
      await setSaving(false);
    }
  }

  async function getNotes() {
    const fetchedNotes = await fetch("/api/get-notes?userId=" + user._id).then(
      (res) => res.json(),
    );
    await setAllNotes(fetchedNotes);
    await setSaving(false);
  }

  async function saveNote() {
    await setSaving(true);
    const data = await fetch("/api/save-note", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        referralId: item._id,
        taskId: task._id,
        userId: user._id,
        note: note,
        surveyId: item.surveyId,
        timestamp: new Date(),
        modifiedBy: loggedInUser.email,
      }),
    });
    const res = await data.json();
    // After saving the note, get the updated notes list
    await getNotes();
    await setSaving(false);
    await setNote("");
  }

  function evaluateEmail(modifiedEmail) {
    return modifiedEmail === loggedInUser?.email ? "Me" : modifiedEmail;
  }

  return (
    <div className={"mt-3"}>
      <div
        className={`flex justify-between align-middle p-2 ${task.completed === "true" ? "bg-green-100" : "bg-gray-100"}`}
        key={task._id}
      >
        <div className={"flex"}>
          <input
            type={"checkbox"}
            id={task._id}
            checked={task.completed === "true"}
            className={"mr-2 rounded"}
            onChange={() => {
              setSaving(true);
              setTaskStatus(task._id, task.completed !== "true").then(() => {
                getTasks().then();
              });
            }}
          />
          <div className={"text-xs "}>
            <div>{task.task}</div>
            <div className={"text-gray-400 text-[11px]"}>
              {moment(task.timestamp).calendar()}
            </div>
            <div className={"text-gray-400 text-[11px]"}>
              Added by:{" "}
              {task.modifiedBy === undefined
                ? "unknown"
                : evaluateEmail(task.modifiedBy)}
            </div>
          </div>
        </div>
        <div className={"flex align-center"}>
          <div
            className={"cursor-pointer mr-3 ml-4"}
            onClick={() => {
              setNoteOpen(!noteOpen);
            }}
          >
            <FilePlus size={16} weight="thin" className="inline" />
            <span className="text-gray-600 text-[11px]">Notes</span>
          </div>
          <div
            className={"cursor-pointer"}
            onClick={() => {
              if (
                confirm(
                  "Do you want to delete this task? This action is permanent.",
                )
              ) {
                deleteTask(task._id).then(() => {
                  getTasks().then();
                });
              }
            }}
          >
            <Trash size={16} weight="thin" color={"red"} />
          </div>
        </div>
      </div>
      <div className={`mb-3 ${noteOpen ? "visible" : "hidden"}`}>
        <input
          type={"text"}
          value={note}
          placeholder={"Enter  note here..."}
          id={task._id + i}
          className={"p-1 border-0 border-b-[1px] text-sm font-light w-full"}
          onChange={(e) => {
            setNote(e.target.value);
          }}
        />
        <div className={"flex justify-end"}>
          <button
            disabled={note === ""}
            className={
              "text-white px-4 py-1 text-xs rounded mt-2 bg-gradient-to-t from-orange-600 to-orange-400 disabled:bg-gradient-to-b disabled:from-gray-300 disabled:to-gray-400"
            }
            onClick={() => {
              saveNote().then(getNotes);
              setNoteOpen(false);
            }}
          >
            Save note
          </button>
        </div>
      </div>
      {allNotes &&
        allNotes
          .filter((note) => note.taskId === task._id.toString())
          .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
          .map((noteItem) => {
            return (
              <NoteItem
                key={noteItem._id}
                noteItem={noteItem}
                loggedInUser={loggedInUser}
              />
            );
          })}
    </div>
  );
}

export default TaskTodo;
