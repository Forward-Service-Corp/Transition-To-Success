import { nl_to_br, prettyAddress } from "../lib/formatHelpers";
import { colorMap, labelMap } from "../lib/serviceLabelsMap";
import type { SingleServiceResponse } from "../types/service";
import type { ActionType } from "./markDuplicateModal";

const ServiceSummary = ({
  service,
  parentService,
  action,
}: {
  service: SingleServiceResponse;
  parentService: SingleServiceResponse;
  action: ActionType;
}) => {
  if (!service) return null;
  if (!parentService) return null;

  const textInfoJSX = (data: string | undefined, label: string) => {
    if (!data) return <></>;

    return (
      <div>
        <p className={"text-xs text-gray-500 dark:text-gray-300"}>{label}:</p>
        <div className={`dark:text-white`}>
          {nl_to_br(data) || (
            <span
              className={"text-gray-500 dark:text-white"}
            >{`No ${label} listed`}</span>
          )}
        </div>
      </div>
    );
  };

  const textEmailJSX = (data: string | undefined, label: string) => {
    if (data) {
      return (
        <div>
          <p className={"text-xs text-gray-500 capitalize dark:text-gray-300"}>
            {label}:
          </p>
          <div>
            <a href={`mailto:${data}`} className={"underline text-orange-500"}>
              {data}
            </a>
          </div>
        </div>
      );
    } else {
      return <></>;
    }
  };

  const textWebsiteJSX = (data: string | undefined, label: string) => {
    if (data) {
      let finalUrl = data;
      if (!data.startsWith("http")) {
        finalUrl = "http://" + data;
      }
      return (
        <div>
          <p className={"text-xs text-gray-500 dark:text-gray-300"}>Website</p>
          <div className={"truncate"}>
            {
              <a
                target={"_blank"}
                rel={"noreferrer"}
                className={"text-orange-500 underline"}
                href={finalUrl}
              >
                Visit website
              </a>
            }
          </div>
        </div>
      );
    } else {
      return <></>;
    }
  };

  const getDomainColor = (domain: string) => {
    const oldDomain = Object.keys(labelMap).find((key) => key === domain);
    const newDomain = Object.keys(labelMap).find(
      (key) => labelMap[key] == domain,
    );

    if (oldDomain) {
      const [backgroundColor, fontColor] = colorMap?.[oldDomain] || [
        "#CCCCCC",
        "#00000",
      ];
      return { backgroundColor, fontColor };
    }
    if (newDomain) {
      const [backgroundColor, fontColor] = colorMap?.[newDomain] || [
        "#CCCCCC",
        "#00000",
      ];
      return { backgroundColor, fontColor };
    }
    return { backgroundColor: "#CCCCCC", fontColor: "#000000" };
  };
  const domainListJSX = (list: string[]) => {
    return (
      <div>
        <p className={"text-xs text-gray-500 dark:text-gray-300"}>
          LAS Service Domains:
        </p>
        <div className="flex flex-wrap">
          {list.map((dom, index) => {
            const { backgroundColor, fontColor } = getDomainColor(dom);
            return (
              <span
                className="m-1 py-1 px-2 rounded-md text-xs"
                style={{ backgroundColor, color: fontColor }}
                key={index}
              >
                {dom}
              </span>
            );
          })}
        </div>
      </div>
    );
  };
  const countiesListJSX = (list: string[]) => {
    return (
      <div>
        <p className={"text-xs text-gray-500 dark:text-gray-300"}>
          Counties Served:
        </p>
        <div className="flex flex-wrap">
          {list.map((county, index) => (
            <span className="text-xs rounded-md py-0 px-2" key={index}>
              {county}
            </span>
          ))}
        </div>
      </div>
    );
  };

  let result: SingleServiceResponse | null = null;

  if (action == "delete") {
    return (
      <div className="text-center border-red-500 border-2 bg-red-200">
        This Service will be marked for Deletion.
      </div>
    );
  }

  if (action == "add") {
    result = {
      ...parentService,
      locations: [
        ...parentService.locations,
        ...service.locations.map((loc) => ({
          ...loc,
          primary_location: false,
        })),
      ],
      counties: [...new Set([...parentService.counties, ...service.counties])],
      domains: [...new Set([...parentService.domains, ...service.domains])],
    };
  }

  if (action == "promote") {
    result = {
      ...service,
      locations: [
        ...service.locations,
        { ...parentService.primary_location, primary_location: false },
      ],
      counties: [...new Set([...parentService.counties, ...service.counties])],
      domains: [...new Set([...parentService.domains, ...service.domains])],
    };
  }

  if (action == "merge") {
    result = {
      ...parentService,
      description: parentService.description + "; " + service.description,
      need_to_bring: parentService.need_to_bring + ": " + service.need_to_bring,
      counties: [...new Set([...parentService.counties, ...service.counties])],
      domains: [...new Set([...parentService.domains, ...service.domains])],
    };
  }

  if (!result) return null;

  return (
    <>
      <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}>
        {/*column 1*/}
        <div className="pr-2">
          {textWebsiteJSX(result.primary_location.url, "Website")}
          {textInfoJSX(result.description, "Description / Requirements")}
          {textInfoJSX(
            result.need_to_bring,
            "Things to bring with you when you visit:",
          )}
        </div>
        {/*column 2*/}
        <div className="px-2">
          <p>Details:</p>
          {textInfoJSX(result.primary_location.contactName, "Point of Contact")}
          {textInfoJSX(result.primary_location.contactPhone, "Phone")}
          {textInfoJSX(result.primary_location.hours, "Hours")}
          {textInfoJSX(prettyAddress(result.primary_location), "Address")}
        </div>
        {/*column 3*/}
        <div className="pl-2">
          <p>Other Locations:</p>
          {result.locations.map((loc, index) => (
            <div key={index}>
              {textInfoJSX(prettyAddress(loc), `Location ${index + 1}`)}
            </div>
          ))}
        </div>
      </div>
      <div>
        <div>{domainListJSX(result.domains)}</div>
        <div>{countiesListJSX(result.counties)}</div>
      </div>
    </>
  );
};

export default ServiceSummary;
