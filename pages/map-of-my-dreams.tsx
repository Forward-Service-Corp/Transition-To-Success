import Layout from "../components/layout";
import { getSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";
import CurrentReferral from "../components/currentReferral";
import Head from "next/head";
import moment from "moment";
import ReferralSelects from "../components/referralSelects";
import { WarningCircle } from "phosphor-react";
import type { NextPageContext } from "next";
import { asArray } from "../utils/AsArray";
import { SingleServiceResponse } from "../types/service";
import { getMOMDPageData } from "../lib/serverfunctions/MOMDdata";
import { MOMDProvider } from "../lib/context/MOMDContext";
import type { IndexDataResponse } from "../types";
import type { ReferralResponse } from "../types/referral";
import type { SurveyResponse } from "../types/survey";
import ServiceSelectors from "../components/referralSelects";

type MOMDProps = {
  pageDataJson: IndexDataResponse;
  referralJson: { referrals: SingleServiceResponse[]; domains: string[] };
  surveyJson: SurveyResponse;
};

export default function MapOfMyDreams({
  pageDataJson,
  referralJson,
  surveyJson,
}: MOMDProps) {
  const { user, client } = pageDataJson;
  const { referrals, domains } = referralJson;
  const router = useRouter();
  const [currentReferral, setCurrentReferral] =
    useState<SingleServiceResponse | null>(null);
  const [userReferrals, setUserReferrals] = useState(
    router.query.clientId
      ? pageDataJson.clientReferrals
      : pageDataJson.referrals,
  );
  return (
    <Layout title={"Map of My Dreams"} user={user}>
      <MOMDProvider
        initialReferrals={userReferrals}
        user={user}
        survey={surveyJson}
      >
        <Head>
          <title>TTS / Map of My Dreams</title>
        </Head>
        <div
          className={
            "p-8 mb-4 bg-gray-100 text-sm  dark:rounded-xl dark:bg-black dark:bg-opacity-30 dark:text-white dark:font-extralight dark:shadow-xl"
          }
        >
          {router.query.clientId === undefined ? (
            ""
          ) : (
            <div className={"text-xl text-center p-3 truncate dark:text-white"}>
              Client: {client?.name}
            </div>
          )}

          <p
            className={
              "text-2xl text-orange-400 uppercase dark:font-extralight"
            }
          >
            4 Keys to Your Success
          </p>
          <p>Science tells us there are 4 steps to success.</p>
          <ol className={""}>
            <li>
              <strong className={"font-extrabold"}>1. CARE: </strong>
              Coordinating All Resources Effectively. Learn to identify and make
              the most of community services available to you.
            </li>
            <li>
              <strong className={"font-extrabold"}>
                2. Understand Money.{" "}
              </strong>
              Learn about predatory scams, lending, and the pitfalls of credit.
            </li>
            <li>
              <strong className={"font-extrabold"}>3. Find a mentor, </strong>
              someone you can relate to that is achieving similar goals. Ask for
              support and advice.
            </li>
            <li>
              <strong className={"font-extrabold"}>4. Volunteer: </strong>The
              research is clear, volunteers are healthier, happier, earn more
              money, and do better in school. Volunteerism is also a path to
              your career.
            </li>
          </ol>
          <p>
            You now know your dreams, goals, and challenges. You&apos;ve picked
            your priorities. Now let&apos;s make your Map of Your Dreams.
          </p>
          <p>
            On your Map, use the key steps to fuel your success (CARE,
            Understanding Money, Asking for Help, and Helping Others.)
          </p>
        </div>
        <div
          className={
            "p-8 mb-4 bg-gray-100 dark:rounded-xl dark:bg-black dark:bg-opacity-30 dark:text-white dark:font-extralight dark:shadow-xl"
          }
        >
          <h2 className={"uppercase text-gray-500 dark:text-gray-400 mb-0"}>
            Instructions
          </h2>
          <p className={"text-sm mt-0"}>
            Please select a referral from the dropdown menu. Once you have
            selected a referral, you must click or tap{" "}
            <button
              className={
                " my-3 py-2 px-3 mx-2 text-white text-xs bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 rounded-lg shadow-xl dark:font-extralight dark:text-white dark:hover:bg-indigo-600"
              }
            >
              + Save
            </button>{" "}
            to save your choice and move on.
          </p>
        </div>
        <div
          className={`p-4 text-sm text-white bg-red-600 rounded flex justify-start items-center ${userReferrals.length > 0 ? "hidden" : "visible"}`}
        >
          <span className={"mr-2"}>
            <WarningCircle size={32} weight="thin" color={"white"} />
          </span>
          <span className={""}>
            Please select a referral for at least one priority.
          </span>
        </div>
        <div className={""}>
          <div
            className={`${router.query.clientId ? "visible uppercase" : "hidden"} text-red-600`}
          >
            MAPPING FOR CLIENT {client?.name}
          </div>

          <div className={"flex py-4 w-full dark:text-white"}>
            <div className={"flex-1"}>
              <p className={"text-sm text-gray-600 dark:text-gray-400"}>
                Dream:
              </p>
              <p className={"uppercase"}>{surveyJson.dream}</p>
            </div>
            <div className={"flex-1"}>
              <p className={"text-sm text-gray-600 dark:text-gray-400"}>
                Survey Completed:
              </p>
              <p className={"uppercase"}>
                {moment(surveyJson.datestamp).format("MMMM Do YYYY, h:mm:ss a")}
              </p>
            </div>
          </div>

          <div className={"flex flex-col md:flex-row"}>
            <CurrentReferral />
            <ServiceSelectors domains={domains} services={referrals} />
          </div>
          <div className={"flex justify-end"}>
            <button
              disabled={userReferrals.length === 0}
              className={
                " my-3 py-2 px-6 text-white text-xs bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 rounded-lg shadow-xl dark:font-extralight dark:text-white dark:hover:bg-indigo-600"
              }
              onClick={() => {
                if (router.query.clientId) {
                  router.back();
                } else {
                  router.push("/care-plans").then();
                }
              }}
            >
              Go to Care Plans
            </button>
          </div>
        </div>
      </MOMDProvider>
    </Layout>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);
  if (!session)
    return { redirect: { destination: "/login", permanent: false } };

  if (!session.user?._id) {
    console.error("map-of-my-dreams.js: Session missing user._id");
    return { redirect: { destination: "/login", permanent: false } };
  }

  const data = await getMOMDPageData(context, session);

  return {
    props: data,
  };
}
