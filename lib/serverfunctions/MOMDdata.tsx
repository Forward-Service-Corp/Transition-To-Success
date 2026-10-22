import type { NextPageContext } from "next";
import type { Session } from "next-auth";
import { asArray } from "../../utils/AsArray";

export async function getMOMDPageData(
  context: NextPageContext,
  session: Session,
) {
  const { req } = context;
  //console.log(context.query.county);

  const protocol = req?.headers["x-forwarded-proto"] || "http";
  const baseUrl = req ? `${protocol}://${req.headers.host}` : "";

  try {
    // page data
    let pageDataUrl;
    if (context.query.clientId === undefined) {
      pageDataUrl =
        baseUrl + "/api/pages/indexPageData?userId=" + session.user._id;
    } else {
      pageDataUrl =
        baseUrl +
        "/api/pages/indexPageData?userId=" +
        session.user._id +
        "&clientId=" +
        context.query.clientId;
    }

    const getPageData = await fetch(pageDataUrl);
    if (!getPageData.ok) {
      console.error(
        "map-of-my-dreams.js: indexPageData fetch failed:",
        getPageData.status,
      );
      return { redirect: { destination: "/login", permanent: false } };
    }
    const pageDataJson = await getPageData.json();

    //referral options

    const refParams = new URLSearchParams();

    const counties = asArray(context.query.county);
    const domains = asArray(context.query.domain);

    counties.forEach((c) => refParams.append("county", c));
    domains.forEach((d) => refParams.append("domain", d));

    const referralOptionsUrl = `${baseUrl}/api/get-service-options?${refParams.toString()}`;

    const getReferralOptions = await fetch(referralOptionsUrl);
    if (!getReferralOptions.ok) {
      console.error(
        "map-of-my-dreams.js: referral options fetch failed beacause !getReferralOptions.ok:",
        getReferralOptions.status,
      );
      return { redirect: { destination: "/login", permanent: false } };
    }
    const referralJson = await getReferralOptions.json();

    // single survey data
    const surveyUrl =
      baseUrl + "/api/get-survey-by-id?surveyId=" + context.query.surveyId;
    const getSurvey = await fetch(surveyUrl);
    if (!getSurvey.ok) {
      console.error(
        "map-of-my-dreams.js: survey fetch failed:",
        getSurvey.status,
      );
      return { redirect: { destination: "/login", permanent: false } };
    }
    const surveyJson = await getSurvey.json();

    // const {user} = pageDataJson
    // if(!user.county.length || !user.homeCounty  || !user.programs.length || !user.name) return  {redirect: {destination: "/profile", permanent: false}};

    return {
      pageDataJson,
      referralJson,
      surveyJson,
    };
  } catch (error) {
    console.error("map-of-my-dreams.js: Error in getServerSideProps:", error);
    return { redirect: { destination: "/login", permanent: false } };
  }
}
