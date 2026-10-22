import { useState } from "react";
import { blankLocation } from "../lib/serverSideHelpers";
import { useMOMD } from "../lib/context/MOMDContext";

function CurrentReferral({}: {}) {
  const { updateRefData, currentService } = useMOMD();

  const [location, setLocation] = useState(
    currentService?.primary_location ||
      currentService?.locations?.[0] ||
      blankLocation(),
  );

  //console.log(currentService);

  if (!currentService) {
    return (
      <div
        className={
          "flex-1 mr-10 shadow rounded overflow-hidden dark:bg-black dark:text-white dark:rounded-xl dark:overflow-hidden dark:bg-opacity-70"
        }
      >
        <div className={"bg-gray-700 text-white p-3 text-xs"}>
          Selected referral details:
        </div>
        <div
          className={
            "flex flex-col align-middle items-center justify-around mt-3"
          }
        >
          <div className={"p-4 text-sm"}>
            Please make a selection from one of the drop down menus to see
            details.
          </div>
        </div>
      </div>
    );
  }

  const hasLocations = currentService?.locations?.length > 1;
  const changeLocation = (index: number) => {
    const loc = currentService.locations[index];

    setLocation(loc);

    updateRefData({
      contact: loc.contactName,
      contactEmail: loc.contactEmail,
      contactPhone: loc.contactPhone,
      email: loc.contactEmail,
      phone: loc.contactPhone,
      hours: loc.hours,
      needs: currentService.need_to_bring,
      isCustom: false,
      requirements: currentService.description,
      url: loc.url,
    });
  };

  return (
    <div
      className={
        "flex-1 mr-10 shadow rounded overflow-hidden dark:bg-black dark:text-white dark:rounded-xl dark:overflow-hidden dark:bg-opacity-70"
      }
    >
      <div
        className={"bg-gray-700 text-white p-3 text-sm dark:font-extralight"}
      >
        Selected referral details:
      </div>

      <div className={"p-8"}>
        {currentService.name !== undefined ? (
          <div>
            <p className={"text-xs text-gray-500 mt-3"}>Name</p>
            <p className={"text-sm"}>{currentService.name}</p>
          </div>
        ) : null}
        {currentService.description !== undefined ? (
          <div>
            <p className={"text-xs text-gray-500 mt-3"}>
              {" "}
              Description / Requirements
            </p>
            <p className={"text-sm"}>{currentService.description}</p>
          </div>
        ) : null}

        {currentService.need_to_bring !== undefined ? (
          <div>
            <p className={"text-xs text-gray-500 mt-3"}>Need to bring</p>
            <p className={"text-sm"}>{currentService.need_to_bring}</p>
          </div>
        ) : null}
        {hasLocations && (
          <div className={"flex justify-start items-center print:hidden"}>
            {currentService.locations.map((loc, index) => (
              <button
                key={index}
                onClick={() => {
                  changeLocation(index);
                }}
                className={
                  "flex items-center my-3 mx-1 py-2 px-6 text-white text-xs bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 dark:disabled:bg-gray-800 rounded-lg shadow-xl dark:font-extralight dark:text-white dark:hover:bg-indigo-600"
                }
              >
                Location {index + 1}
                {" - "}
                {loc.address.city}
              </button>
            ))}
          </div>
        )}

        {location.contactEmail !== undefined ? (
          <div>
            <p className={"text-xs text-gray-500 mt-3"}>Email</p>
            <p className={"text-sm"}>{location.contactEmail}</p>
          </div>
        ) : null}

        {location.hours !== undefined ? (
          <div>
            <p className={"text-xs text-gray-500 mt-3"}>Hours</p>
            <p className={"text-sm"}>{location.hours}</p>
          </div>
        ) : null}

        {location.url !== undefined ? (
          <div>
            <p className={"text-xs text-gray-500 mt-3"}>Website</p>
            <p className={"text-sm truncate text-blue-600 underline"}>
              <a href={location.url} target="_blank" rel={"noreferrer"}>
                {location.url}
              </a>
            </p>
          </div>
        ) : null}

        {location.contactName !== undefined ? (
          <div>
            <p className={"text-xs text-gray-500 mt-3"}>Contact person</p>
            <p className={"text-sm"}>{location.contactName}</p>
          </div>
        ) : null}

        {location.contactPhone !== undefined ? (
          <div>
            <p className={"text-xs text-gray-500 mt-3"}>Contact person phone</p>
            <p className={"text-sm"}>{location.contactPhone}</p>
          </div>
        ) : null}

        {location.contactEmail !== undefined ? (
          <div>
            <p className={"text-xs text-gray-500 mt-3"}>Contact person email</p>
            <p className={"text-sm"}>{location.contactEmail}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default CurrentReferral;
