import React from "react";
import { labelMap } from "../lib/serviceLabelsMap";

function CarePlanDomain({ item }) {
  const websiteJSX = (url) => {
    return (
      <div className={"mb-3"}>
        <p className={"text-xs uppercase text-gray-500"}>Website: </p>
        <p>
          <a
            className={"text-blue-600 underline print:hidden"}
            target={"_blank"}
            rel={"noreferrer"}
            href={url}
          >
            Click to visit site
          </a>
          <a
            className={"text-blue-600 underline hidden print:inline"}
            target={"_blank"}
            rel={"noreferrer"}
            href={url}
          >
            {url}
          </a>
        </p>
      </div>
    );
  };

  return (
    <div
      className={
        "w-full md:w-1/2 text-sm p-5 inline bg-gray-100 bg-opacity-50 dark:bg-opacity-0 print:flex print:flex-wrap"
      }
    >
      {item.name ? (
        <div className={"mb-3 print:m-3"}>
          <p className={"text-xs uppercase text-gray-500"}>Name: </p>
          {item.name}
        </div>
      ) : null}

      {item.domain ? (
        <div className={"mb-3 print:m-3"}>
          <p className={"text-xs uppercase text-gray-500"}>Domain: </p>
          {labelMap[item.domain]}
        </div>
      ) : null}

      {item.phone ? (
        <div className={"mb-3 print:m-3"}>
          <p className={"text-xs uppercase text-gray-500"}>Phone: </p>
          {item.phone}
        </div>
      ) : null}

      {item.email ? (
        <div className={"mb-3 print:m-3"}>
          <p className={"text-xs uppercase text-gray-500"}>Email: </p>
          <a
            className={"text-blue-600 underline"}
            href={`mailto:${item.email}`}
          >
            {item.email}
          </a>
        </div>
      ) : null}

      {item.contact ? (
        <div className={"mb-3 print:m-3"}>
          <p className={"text-xs uppercase text-gray-500"}>Contact person: </p>
          {item.contact}
        </div>
      ) : null}

      {item.contactPhone ? (
        <div className={"mb-3 print:m-3"}>
          <p className={"text-xs uppercase text-gray-500"}>
            Contact person phone:{" "}
          </p>
          {item.contactPhone}
        </div>
      ) : null}

      {item.contactEmail ? (
        <div className={"mb-3 print:m-3"}>
          <p className={"text-xs uppercase text-gray-500"}>
            Contact person email:{" "}
          </p>
          {item.contactEmail}
        </div>
      ) : null}

      {item.url ? websiteJSX(item.url) : null}

      {item.requirements ? (
        <div className={"mb-3 print:m-3"}>
          <p className={"text-xs uppercase text-gray-500"}>
            Description / Requirements:{" "}
          </p>
          {item.requirements}
        </div>
      ) : null}

      {item.needs ? (
        <div className={"mb-3 print:m-3"}>
          <p className={"text-xs uppercase text-gray-500"}>Need to bring: </p>
          {item.needs}
        </div>
      ) : null}
    </div>
  );
}

export default CarePlanDomain;
