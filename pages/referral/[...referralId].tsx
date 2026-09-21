import Layout from "../../components/layout";
import { getSession } from "next-auth/react";
import { useState } from "react";
import Head from "next/head";
import {
  Printer,
  Pencil,
  Trash,
  Clock,
  Copyright,
  Copyleft,
  Copy,
} from "phosphor-react";
import ServiceEditModal from "../../components/serviceEditModal";
import { canUserManageServices } from "../../lib/servicePermissions";
import { useRouter } from "next/router";
import ServiceDuplicateModal from "../../components/duplicateServiceModal";
import type { GetServerSidePropsContext, NextPageContext } from "next";
import type { SingleServiceResponse } from "../../types/service";
import type { IndexDataResponse } from "../../types";
import { blankLocation } from "../../lib/serverSideHelpers";
import { nl_to_br, prettyAddress } from "../../lib/formatHelpers";
import { colorMap, labelMap } from "../../lib/serviceLabelsMap";
import MarkDuplicateModal from "../../components/markDuplicateModal";

export default function ReferralId({
  pageDataJson,
  referralDataJson,
}: {
  pageDataJson: IndexDataResponse;
  referralDataJson: SingleServiceResponse;
}) {
  const router = useRouter();

  const { user, referrals } = pageDataJson;
  //console.log(pageDataJson);
  const [userReferrals, setUserReferrals] = useState(referrals);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDupeModalOpen, setIsDupeModalOpen] = useState(false);
  const [service, setService] = useState(referralDataJson);
  const [location, setLocation] = useState(
    service.primary_location || blankLocation(),
  );
  const [locationIndex, setLocationIndex] = useState<number | null>(null);

  const canManage = user ? canUserManageServices(user) : false;
  const hasLocations = service.locations.length > 1;

  async function saveReferral() {
    await fetch("/api/save-referral", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        surveyId: null,
        userId: user._id,
        dream: null,
        domains: service.domains,
        name: service.name,
        email: location.contactEmail,
        phone: location.contactPhone,
        hours: location.hours,
        requirements: service.description,
        url: location.url,
        contact: location.contactName,
        needs: service.need_to_bring,
      }),
    });
  }

  async function getReferrals() {
    await fetch("/api/get-referrals?userId=" + user._id)
      .then((res) => res.json())
      .then((res) => {
        setUserReferrals(res);
      })
      .catch((err) => console.warn(err.json()));
  }

  const handleDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete "${referralDataJson.name}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      const response = await fetch("/api/delete-service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId: referralDataJson._id,
        }),
      });

      if (response.ok) {
        // Redirect to directory page after successful deletion
        router.push("/directory");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete service");
      }
    } catch (err) {
      console.error("Error deleting service:", err);
      alert("Failed to delete service");
    }
  };

  const handleSave = () => {
    // Reload the page to show updated data
    router.reload();
  };

  const changeLocation = (index: number) => {
    setLocation(service.locations[index]);
  };

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
        <div className="flex flex-wrap justify-between">
          {list.map((county, index) => (
            <span className="text-xs rounded-md py-0 px-2" key={index}>
              {county}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Layout title={referralDataJson.name} user={user}>
      <Head>
        <title>{referralDataJson.name}</title>
      </Head>
      <div className={"flex justify-between items-center print:hidden"}>
        <div className="flex items-center gap-2">
          {user && (
            <button
              disabled={
                userReferrals?.filter(
                  (referral) => referral.name === referralDataJson.name,
                ).length > 0
              }
              onClick={() => {
                saveReferral().then(getReferrals);
              }}
              className={
                "flex items-center my-3 py-2 px-6 text-white text-xs bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 dark:disabled:bg-gray-800 rounded-lg shadow-xl dark:font-extralight dark:text-white dark:hover:bg-indigo-600"
              }
            >
              {userReferrals?.filter(
                (referral) => referral.name === referralDataJson.name,
              ).length > 0
                ? "Added to your CARE Plan."
                : "Add to my CARE Plan"}
            </button>
          )}
          {canManage && (
            <>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className={
                  "flex items-center my-3 py-2 px-6 text-white text-xs bg-green-500 hover:bg-green-600 rounded-lg shadow-xl dark:font-extralight dark:text-white dark:hover:bg-green-700"
                }
              >
                <span className={"inline-block mr-2"}>
                  <Pencil size={18} />
                </span>
                <span className={"inline-block"}>Edit Service</span>
              </button>
              <button
                onClick={() => setIsDupeModalOpen(true)}
                className={
                  "flex items-center my-3 py-2 px-6 text-white text-xs bg-orange-500 hover:bg-orange-600 rounded-lg shadow-xl dark:font-extralight dark:text-white dark:hover:bg-green-700"
                }
              >
                <span className={"inline-block mr-2"}>
                  <Copy size={18} />
                </span>
                <span className={"inline-block"}>Mark as Duplicate</span>
              </button>
              <a
                href={`/service/${referralDataJson._id}/history`}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  "flex items-center my-3 py-2 px-6 text-white text-xs bg-indigo-500 hover:bg-indigo-600 rounded-lg shadow-xl dark:font-extralight dark:text-white dark:hover:bg-indigo-700"
                }
              >
                <span className={"inline-block mr-2"}>
                  <Clock size={18} />
                </span>
                <span className={"inline-block"}>View History</span>
              </a>
              <button
                onClick={handleDelete}
                className={
                  "flex items-center my-3 py-2 px-6 text-white text-xs bg-red-500 hover:bg-red-600 rounded-lg shadow-xl dark:font-extralight dark:text-white dark:hover:bg-red-700"
                }
              >
                <span className={"inline-block mr-2"}>
                  <Trash size={18} />
                </span>
                <span className={"inline-block"}>Delete Service</span>
              </button>
            </>
          )}
        </div>

        <div>
          <button
            onClick={() => window.print()}
            className={
              "flex items-center my-3 py-2 px-6 text-white text-xs bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 dark:disabled:bg-gray-800 rounded-lg shadow-xl dark:font-extralight dark:text-white dark:hover:bg-indigo-600"
            }
          >
            <span className={"inline-block mr-2"}>
              <Printer size={22} />
            </span>
            <span className={"inline-block"}>Print</span>
          </button>
        </div>
      </div>
      {hasLocations && (
        <div className={"flex justify-start items-center print:hidden"}>
          {service.locations.map((loc, index) => (
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
      {canManage && (
        <ServiceEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          service={referralDataJson}
          onSave={handleSave}
        />
      )}
      {canManage && (
        <MarkDuplicateModal
          isOpen={isDupeModalOpen}
          onClose={() => setIsDupeModalOpen(false)}
          service={referralDataJson}
          onSave={handleSave}
        />
      )}
      <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}>
        {/*column 1*/}
        <div className="pr-2">
          {textWebsiteJSX(location.url, "Website")}
          {textInfoJSX(service.description, "Description / Requirements")}
          {textInfoJSX(
            service.need_to_bring,
            "Things to bring with you when you visit:",
          )}
        </div>
        {/*column 2*/}
        <div className="px-2">
          <p>Location Details:</p>
          {textInfoJSX(location.contactName, "Point of Contact")}
          {textInfoJSX(location.contactPhone, "Phone")}
          {textEmailJSX(location.contactEmail, "Email")}
          {textInfoJSX(location.hours, "Hours")}
          {textInfoJSX(prettyAddress(location), "Address")}
        </div>
        {/*column 3*/}
        <div className="pl-2">
          {textInfoJSX(location.notes, "Location-specific Notes")}
        </div>
      </div>
      <div>
        <div>{domainListJSX(service.domains)}</div>
        <div>{countiesListJSX(service.counties)}</div>
        <div>{textInfoJSX(service.lastModified, "Last Modified")}</div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  //console.log(session);
  // if (!session)
  //   return { redirect: { destination: "/login", permanent: false } };
  const { req } = context;

  const protocol = req?.headers["x-forwarded-proto"] || "http";
  const baseUrl = req ? `${protocol}://${req.headers.host}` : "";

  //const tempID = session ? session.user._id : 'guest'

  // page data
  const pageDataUrl =
    baseUrl +
    "/api/pages/indexPageData" +
    (session?.user ? "?userId=" + session?.user?._id : "");
  const getPageData = await fetch(pageDataUrl);
  const pageDataJson: IndexDataResponse = await getPageData.json();

  // redirect to profile page if required fields are not complete
  //const {county, name, homeCounty, programs} = pageDataJson.user
  //if(!county.length || !homeCounty || !programs.length || !name) return  {redirect: {destination: "/profile", permanent: false}}

  // single referral
  const referralDataUrl =
    baseUrl + "/api/get-single-referral?referralId=" + context.query.referralId;
  const getReferralData = await fetch(referralDataUrl);
  const referralDataJson: SingleServiceResponse = await getReferralData.json();

  return {
    props: { pageDataJson, referralDataJson },
  };
}
