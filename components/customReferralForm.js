import React, { useState } from "react";

function CustomReferralForm({
  domain,
  clientId,
  user,
  router,
  getUserReferrals,
  i,
}) {
  const [referralOpen, setReferralOpen] = useState(false);
  const [referralName, setReferralName] = useState("");
  const [referralPhone, setReferralPhone] = useState("");
  const [referralEmail, setReferralEmail] = useState("");
  const [referralContact, setReferralContact] = useState("");
  const [referralHours, setReferralHours] = useState("");
  const [referralRequirements, setReferralRequirements] = useState("");
  const [referralWebsite, setReferralWebsite] = useState("");
  const [referralNeeds, setReferralNeeds] = useState("");

  async function saveCustomReferral() {
    const id = clientId === undefined ? user._id : clientId;
    await fetch("/api/save-custom-referral", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        surveyId: router.query.surveyId,
        userId: id,
        dream: router.query.dream,
        domain: domain,
        name: referralName,
        email: referralEmail,
        phone: referralPhone,
        hours: referralHours,
        requirements: referralRequirements,
        url: referralWebsite,
        contact: referralContact,
        needs: referralNeeds,
      }),
    });
  }

  return (
    <div>
      <div
        className={`my-4 p-3 bg-gray-100 text-xs divide-y divide-gray-100 ${referralOpen ? "visible" : "hidden"} dark:divide-gray-800  dark:rounded-xl dark:bg-black dark:bg-opacity-30 dark:text-white dark:font-extralight dark:shadow-xl`}
      >
        <div className={"flex justify-between items-center py-3"}>
          <div>
            <h2 className={"uppercase text-gray-600 dark:text-white"}>
              Add custom referral to {domain}
            </h2>
          </div>
          <div>
            <button
              onClick={() => {
                setReferralOpen(false);
                setReferralName("");
                setReferralPhone("");
                setReferralEmail("");
                setReferralContact("");
                setReferralHours("");
                setReferralRequirements("");
                setReferralWebsite("");
                setReferralNeeds("");
              }}
              className={"text-red-600 underline"}
            >
              Cancel
            </button>
          </div>
        </div>

        <div className={"py-2"}>
          <div className={"py-1 text-gray-600 dark:text-gray-300 dark:mb-2"}>
            Name
          </div>
          <input
            className={
              " w-full text-xs  dark:bg-black dark:text-white dark:font-light dark:border-gray-700 dark:focus:bg-black dark:autofill:bg-black dark:rounded-md"
            }
            placeholder={"Name..."}
            type="text"
            value={referralName}
            id={"referralName" + i}
            onChange={(e) => {
              setReferralName(e.target.value);
            }}
          />
        </div>

        <div className={"py-2"}>
          <div className={"py-1 text-gray-600 dark:text-gray-300 dark:mb-2"}>
            Phone
          </div>
          <input
            className={
              "w-full text-xs  dark:bg-black dark:text-white dark:font-light dark:border-gray-700 dark:focus:bg-black dark:autofill:bg-black dark:rounded-md"
            }
            placeholder={"Phone..."}
            type="text"
            value={referralPhone}
            id={"referralPhone" + i}
            onChange={(e) => {
              setReferralPhone(e.target.value);
            }}
          />
        </div>

        <div className={"py-2"}>
          <div className={"py-1 text-gray-600 dark:text-gray-300 dark:mb-2"}>
            Email
          </div>
          <input
            className={
              "w-full text-xs dark:bg-black dark:text-white dark:font-light dark:border-gray-700 dark:focus:bg-black dark:autofill:bg-black dark:rounded-md"
            }
            placeholder={"Email..."}
            type="text"
            value={referralEmail}
            id={"referralEmail" + i}
            onChange={(e) => {
              setReferralEmail(e.target.value);
            }}
          />
        </div>

        <div className={"py-2"}>
          <div className={"py-1 text-gray-600 dark:text-gray-300 dark:mb-2"}>
            Contact person
          </div>
          <input
            className={
              "text-xs w-full dark:bg-black dark:text-white dark:font-light dark:border-gray-700 dark:focus:bg-black dark:autofill:bg-black dark:rounded-md"
            }
            placeholder={"Contact person..."}
            type="text"
            id={"referralContact" + i}
            value={referralContact}
            onChange={(e) => {
              setReferralContact(e.target.value);
            }}
          />
        </div>

        <div className={"py-2"}>
          <div className={"py-1 text-gray-600 dark:text-gray-300 dark:mb-2"}>
            Hours
          </div>
          <input
            className={
              "text-xs w-full  dark:bg-black dark:text-white dark:font-light dark:border-gray-700 dark:focus:bg-black dark:autofill:bg-black dark:rounded-md"
            }
            placeholder={"Hours..."}
            type="text"
            value={referralHours}
            id={"referralHours" + i}
            onChange={(e) => {
              setReferralHours(e.target.value);
            }}
          />
        </div>

        <div className={"py-2"}>
          <div className={"py-1 text-gray-600 dark:text-gray-300 dark:mb-2"}>
            Description / Requirements
          </div>
          <input
            className={
              "text-xs w-full dark:bg-black dark:text-white dark:font-light dark:border-gray-700 dark:focus:bg-black dark:autofill:bg-black dark:rounded-md"
            }
            placeholder={"Requirements..."}
            type="text"
            id={"referralRequirements" + i}
            value={referralRequirements}
            onChange={(e) => {
              setReferralRequirements(e.target.value);
            }}
          />
        </div>

        <div className={"py-2"}>
          <div className={"py-1 text-gray-600 dark:text-gray-300 dark:mb-2"}>
            Website
          </div>
          <input
            className={
              "text-xs w-full dark:bg-black dark:text-white dark:font-light dark:border-gray-700 dark:focus:bg-black dark:autofill:bg-black dark:rounded-md"
            }
            placeholder={"Website..."}
            type="text"
            value={referralWebsite}
            id={"referralWebsite" + i}
            onChange={(e) => {
              setReferralWebsite(e.target.value);
            }}
          />
        </div>

        <div className={"py-2"}>
          <div className={"py-1 text-gray-600 dark:text-gray-300 dark:mb-2"}>
            Need to bring
          </div>
          <input
            className={
              "text-xs w-full  dark:bg-black dark:text-white dark:font-light dark:border-gray-700 dark:focus:bg-black dark:autofill:bg-black dark:rounded-md"
            }
            placeholder={"Need to bring..."}
            type="text"
            id={"referralNeeds" + i}
            value={referralNeeds}
            onChange={(e) => {
              setReferralNeeds(e.target.value);
            }}
          />
        </div>

        <div className={"py-3 flex justify-end"}>
          <button
            onClick={() => {
              saveCustomReferral().then(() => {
                getUserReferrals();
              });
              setReferralOpen(false);
              setReferralName("");
              setReferralPhone("");
              setReferralEmail("");
              setReferralContact("");
              setReferralHours("");
              setReferralRequirements("");
              setReferralWebsite("");
              setReferralNeeds("");
            }}
            className={
              " my-3 py-2 px-6 text-white text-xs bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 dark:disabled:bg-gray-800 rounded-lg shadow-xl dark:font-extralight dark:text-white dark:hover:bg-indigo-600"
            }
          >
            + Save custom referral
          </button>
        </div>
      </div>
      <div className={"flex justify-end pt-4"}>
        <button
          onClick={() => {
            setReferralOpen(!referralOpen);
          }}
          className={"text-xs underline text-orange-500"}
        >
          Add custom referral
        </button>
      </div>
    </div>
  );
}

export default CustomReferralForm;
