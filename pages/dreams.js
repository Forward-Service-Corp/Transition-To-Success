import Layout from "../components/layout";
import { useEffect, useState, useCallback } from "react";
import SavedDreams from "../components/savedDreams";
import Head from "next/head";
import DreamIntro from "../components/pages/dreamIntro";
import DreamForm from "../components/dreamForm";
import { useSession } from "next-auth/react";
import useSpaData from "../hooks/useSpaData";

export default function Dreams() {
  const { data: session } = useSession();
  const [savedDreams, setSavedDreams] = useState([]);
  const [simpleModal, setSimpleModal] = useState(false);
  const [currentTab, setCurrentTab] = useState("active");

  // Use SPA data fetching for page data
  const {
    data: pageData,
    loading: pageLoading,
    error: pageError,
  } = useSpaData("/api/pages/dreamsPageData");

  // Use SPA data fetching for dreams
  const {
    data: dreamsData,
    loading: dreamsLoading,
    refetch: refetchDreams,
  } = useSpaData("/api/get-dreams");

  const getDreams = useCallback(async () => {
    if (session?.user?._id) {
      refetchDreams();
    }
  }, [session?.user?._id, refetchDreams]);

  useEffect(() => {
    if (dreamsData) {
      setSavedDreams(dreamsData);
    }
  }, [dreamsData]);

  // Show loading state while data is being fetched
  if (pageLoading || !pageData) {
    return (
      <Layout title={"Dreams"} session={session}>
        <Head>
          <title>TTS / Dreams</title>
        </Head>
        <div className="flex items-center justify-center h-64">
          <div className="uppercase text-gray-600 text-sm">
            loading dreams...
          </div>
        </div>
      </Layout>
    );
  }

  // Show error state if data fetching failed
  if (pageError) {
    return (
      <Layout title={"Dreams"} session={session}>
        <Head>
          <title>TTS / Dreams</title>
        </Head>
        <div className="flex items-center justify-center h-64">
          <div className="text-red-600 text-sm">
            Error loading dreams: {pageError}
          </div>
        </div>
      </Layout>
    );
  }

  const { user, dreams } = pageData;

  return (
    <Layout
      title={"Dreams"}
      session={user}
      simpleModal={simpleModal}
      simpleModalTitle={`Great Work!`}
      simpleModalMessage={`You just created a new dream.`}
      simpleModalLabel={`Awesome!`}
    >
      <Head>
        <title>TTS / Dreams</title>
      </Head>
      <div className={""}>
        <div className={"grid grid-cols-1 md:grid-cols-2 gap-4"}>
          <DreamIntro />
          <DreamForm
            setSavedDreams={setSavedDreams}
            user={user}
            setSimpleModal={setSimpleModal}
            getDreams={getDreams}
          />
        </div>
        <div
          className={
            "bg-gray-100 p-3 my-6 dark:p-8 dark:bg-[#111111] dark:text-white dark:text-center dark:rounded-2xl dark:bg-opacity-40 dark:shadow-2xl"
          }
        >
          <h2 className={"uppercase"}>
            <span className={"text-orange-500"}>Hint: </span>Completing a Life
            Area Survey
          </h2>
          <p className={"text-sm"}>
            Completing a Life Area Survey is easy! Simply choose a dream you
            would like to survey and click the &quot;Life Area Survey&quot;
            button to continue to a new survey page.
          </p>
        </div>
        <div
          className={"bg-gray-100 p-3 mb-3 dark:bg-opacity-0 dark:text-white"}
        >
          My{" "}
          <select
            className={
              "text-xs border-gray-300 rounded dark:bg-black dark:border-0 "
            }
            id={"currentTab"}
            onChange={(e) => {
              setCurrentTab(e.target.value);
            }}
          >
            <option value="active">Active</option>
            <option value="complete">Complete</option>
            <option value="archived">Archived</option>
          </select>{" "}
          Dreams
        </div>
        <div className={`${currentTab === "active" ? "visible" : "hidden"}`}>
          <SavedDreams
            savedDreams={savedDreams?.filter(
              (dream) => dream.status === "active",
            )}
            setSavedDreams={setSavedDreams}
          />
        </div>
        <div className={`${currentTab === "complete" ? "visible" : "hidden"}`}>
          <SavedDreams
            savedDreams={savedDreams?.filter(
              (dream) => dream.status === "complete",
            )}
            setSavedDreams={setSavedDreams}
          />
        </div>
        <div className={`${currentTab === "archived" ? "visible" : "hidden"}`}>
          <SavedDreams
            savedDreams={savedDreams?.filter(
              (dream) => dream.status === "archived",
            )}
            setSavedDreams={setSavedDreams}
          />
        </div>
        <div
          className={
            "bg-gray-100 p-3 my-6 dark:p-8 dark:bg-[#111111] dark:text-white dark:text-center dark:rounded-2xl dark:bg-opacity-40 dark:shadow-2xl"
          }
        >
          <h2 className={"uppercase"}>
            <span className={"text-orange-500"}>
              You've taken the first step on your Dream journey!
            </span>
          </h2>
          <p className={"text-sm"}>
            {" "}
            Now it's time to decide what you want to focus on next. Choose a
            Dream above and click on "Create Life Area Survey"
          </p>
        </div>
      </div>
    </Layout>
  );
}
