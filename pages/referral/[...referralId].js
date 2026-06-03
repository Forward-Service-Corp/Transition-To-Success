import Layout from "../../components/layout";
import { getSession } from "next-auth/react";
import { useState } from "react";
import Head from "next/head";
import { Printer, Pencil, Trash, Clock } from "phosphor-react";
import ServiceEditModal from "../../components/serviceEditModal";
import { canUserManageServices } from "../../lib/servicePermissions";
import { useRouter } from "next/router";

export default function ReferralId({ pageDataJson, referralDataJson }) {
  const router = useRouter();
  const { user, referrals } = pageDataJson;
  const [userReferrals, setUserReferrals] = useState(referrals);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const canManage = user ? canUserManageServices(user) : false;

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
        domain: referralDataJson.service,
        name: referralDataJson.name,
        email: referralDataJson.contactEmail,
        phone: referralDataJson.contactPhone,
        hours: referralDataJson.hours,
        requirements: referralDataJson.requirements,
        url: referralDataJson.url,
        contact: referralDataJson.contactName,
        needs: referralDataJson.needs,
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

  const handleSave = (updatedService) => {
    // Reload the page to show updated data
    router.reload();
  };

  const textInfoJSX = (data, label) => {
    return (
      <div>
        <p className={"text-xs text-gray-500 capitalize dark:text-gray-300"}>
          {label}:
        </p>
        <div className={`dark:text-white`}>
          {data || (
            <span
              className={"text-gray-500 dark:text-white"}
            >{`No ${label} listed`}</span>
          )}
        </div>
      </div>
    );
  };

  const textEmailJSX = (data, label) => {
    if (data) {
      return (
        <div>
          <p className={"text-xs text-gray-500 capitalize dark:text-gray-300"}>
            {label}:
          </p>
          <div>
            {(
              <a
                href={`mailto:${data}`}
                className={"underline text-orange-500"}
              >
                {data}
              </a>
            ) || (
              <span className={"text-gray-500 dark:text-white"}>
                No {label} listed
              </span>
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <p className={"text-xs text-gray-500 capitalize dark:text-gray-300"}>
            {label}
          </p>
          <div>
            <span className={"text-gray-500 dark:text-white"}>
              No {label} listed
            </span>
          </div>
        </div>
      );
    }
  };

  const textWebsiteJSX = (data, label) => {
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
      return (
        <div>
          <p className={"text-xs text-gray-500 dark:text-gray-300"}>Website</p>
          <div className={"truncate"}>
            {
              <span className={"text-gray-500 dark:text-white"}>
                No {label} listed
              </span>
            }
          </div>
        </div>
      );
    }
  };

  return (
    <Layout title={referralDataJson.name} session={user}>
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
              Add to my CARE Plan
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
        <div className={"text-xs text-red-600 dark:accent-red-500"}>
          {userReferrals?.filter(
            (referral) => referral.name === referralDataJson.name,
          ).length > 0
            ? "This referral has been added to your CARE Plan."
            : null}
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
      {canManage && (
        <ServiceEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          service={referralDataJson}
          onSave={handleSave}
        />
      )}
      <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}>
        {/*column 1*/}
        <div>
          {textInfoJSX(referralDataJson.phone, "phone")}
          {textInfoJSX(referralDataJson.hours, "hours")}
          {textWebsiteJSX(referralDataJson.url, "website")}
          {textInfoJSX(referralDataJson.requirements, "requirements")}
          {textInfoJSX(referralDataJson.needs, "need to bring")}
        </div>
        {/*column 2*/}
        <div>
          {textInfoJSX(referralDataJson.street, "street")}
          {textInfoJSX(referralDataJson.city, "city")}
          {textInfoJSX(referralDataJson.county, "county")}
          {textInfoJSX(referralDataJson.state, "state")}
          {textInfoJSX(referralDataJson.zip, "zip code")}
        </div>
        {/*column 3*/}
        <div>
          {textInfoJSX(referralDataJson.contactName, "contact person")}
          {textInfoJSX(referralDataJson.contactPhone, "contact person phone")}
          {textEmailJSX(referralDataJson.contactEmail, "contact person email")}
          {textInfoJSX(referralDataJson.lastModified, "last modified")}
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  // if (!session)
  //   return { redirect: { destination: "/login", permanent: false } };
  const { req } = context;

  const protocol = req.headers["x-forwarded-proto"] || "http";
  const baseUrl = req ? `${protocol}://${req.headers.host}` : "";

  //const tempID = session ? session.user._id : 'guest'

  // page data
  const pageDataUrl =
    baseUrl +
    "/api/pages/indexPageData" +
    (session ? "?userId=" + session.user._id : "");
  const getPageData = await fetch(pageDataUrl);
  const pageDataJson = await getPageData.json();

  // redirect to profile page if required fields are not complete
  //const {county, name, homeCounty, programs} = pageDataJson.user
  //if(!county.length || !homeCounty || !programs.length || !name) return  {redirect: {destination: "/profile", permanent: false}}

  // single referral
  const referralDataUrl =
    baseUrl + "/api/get-single-referral?referralId=" + context.query.referralId;
  const getReferralData = await fetch(referralDataUrl);
  const referralDataJson = await getReferralData.json();

  return {
    props: { pageDataJson, referralDataJson },
  };
}
