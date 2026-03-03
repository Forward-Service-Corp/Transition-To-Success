import Layout from "../components/layout";
import { getSession } from "next-auth/react";
import SurveyDomainList from "../components/surveyDomainsList";
import NewLifeAreaSurveyForm from "../components/newLifeAreaSurveyForm";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import NewLifeAreaSurveyQuestions from "../components/newLifeAreaSurveyQuestions";
import Head from "next/head";

// Survey field definitions
const YOUTH_FIELDS = [
  "myFamily",
  "school",
  "familyCare",
  "childrensEducation",
  "money",
  "disabilities",
  "work",
  "friends",
  "food",
  "healthCare",
  "housing",
  "internetAccess",
  "legal",
  "lifeSkills",
  "mentalHealth",
  "manageMoney",
  "parenting",
  "education",
  "safety",
  "substances",
  "transportation",
];

const ADULT_FIELDS = [
  "adultEducation",
  "budgeting",
  "childcare",
  "childrensEducation",
  "communityInvolvement",
  "disabilities",
  "employment",
  "familyFriendsSupport",
  "food",
  "healthInsurance",
  "housing",
  "internetAccess",
  "legal",
  "lifeSkills",
  "mentalHealth",
  "money",
  "parentingSkills",
  "racismBigotry",
  "safety",
  "substances",
  "transportation",
];

export default function NewLifeAreaSurvey({ user, client }) {
  const router = useRouter();
  const [activeDomain, setActiveDomain] = useState("food");
  const [answered, setAnswered] = useState({});
  const [domains, setDomains] = useState([]);
  const [surprise, setSurprise] = useState("");
  const [concern, setConcern] = useState("");
  const [family, setFamily] = useState("");
  const [health, setHealth] = useState("");
  const [income, setIncome] = useState("");
  const [testingMode, setTestingMode] = useState(false);

  // Helper to initialize survey data from API response
  const initializeSurveyData = (survey, fields) => {
    return fields.reduce((acc, field) => {
      acc[field] = {
        selection: survey[field]?.[0] || 0,
        statement: survey[field]?.[1] || "",
      };
      return acc;
    }, {});
  };

  const getSurvey = useCallback(async () => {
    const survey = await fetch(
      "/api/get-survey?surveyId=" + router.query.surveyId,
    )
      .then((res) => res.json())
      .catch((err) => console.warn(err));

    const fields = survey.isYouthSurvey ? YOUTH_FIELDS : ADULT_FIELDS;
    setDomains(survey.priority);
    setAnswered(initializeSurveyData(survey, fields));
    setSurprise(survey.surprise);
    setConcern(survey.concern);
    setFamily(survey.family);
    setHealth(survey.health);
    setIncome(survey.income);
  }, [router.query.surveyId]);

  useEffect(() => {
    if (router.query.surveyId !== undefined) {
      getSurvey().then();
    }
  }, [getSurvey, router.query.surveyId]);

  // Helper to convert answered object to API payload format
  const buildSurveyPayload = () => {
    const payload = {
      priority: domains,
      userId: router.query.clientId || user._id,
      surprise,
      concern,
      family,
      health,
      income,
    };

    // Convert each answered field to [selection, statement] array
    Object.keys(answered).forEach((field) => {
      payload[field] = [answered[field].selection, answered[field].statement];
    });

    // Add metadata based on operation type
    if (router.query.surveyId) {
      // Update operation
      payload.surveyId = router.query.surveyId;
      payload.dreamId = router.query.dreamId;
      payload.dream = router.query.dreamName;
      payload.user = router.query.clientId ? client?.name : user.name;
    } else {
      // Create operation
      payload.dreamId = router.query.dreamId;
      payload.dream = router.query.dreamName;
      payload.county = user.county;
      payload.coach = user.coach;
      if (!user.isYouth) {
        payload.user = user.name;
      }
    }

    return payload;
  };

  async function handleSaveSurvey() {
    const isUpdate = router.query.surveyId !== undefined;
    const isYouth = user.isYouth === true;

    let endpoint;
    if (isUpdate) {
      endpoint = "/api/update-life-area-survey";
    } else if (isYouth) {
      endpoint = "/api/post-youth-life-area-survey";
    } else {
      endpoint = "/api/post-life-area-survey";
    }

    await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildSurveyPayload()),
    });

    // Navigate after save
    if (router.query.clientId) {
      router.back();
    } else {
      router.push("/life-area-surveys");
    }
  }

  // Testing mode: Generate random survey data
  const generateTestData = () => {
    const fields = user.isYouth ? YOUTH_FIELDS : ADULT_FIELDS;
    const testStatements = [
      "Test statement 1",
      "Test statement 2",
      "Test statement 3",
      "Test statement 4",
      "Test statement 5",
      "N/A",
    ];

    // Generate random answers for all fields
    const generatedAnswers = fields.reduce((acc, field) => {
      const randomSelection = Math.floor(Math.random() * 6); // 0-5
      acc[field] = {
        selection: randomSelection,
        statement: testStatements[randomSelection],
      };
      return acc;
    }, {});

    setAnswered(generatedAnswers);

    // Randomly select 2-4 priorities
    const numPriorities = Math.floor(Math.random() * 3) + 2; // 2-4
    const shuffled = [...fields].sort(() => 0.5 - Math.random());
    const selectedPriorities = shuffled.slice(0, numPriorities);
    setDomains(selectedPriorities);

    // Fill in additional questions
    setSurprise("Test surprise text");
    setConcern("Test concern text");
    setFamily("Test family text");
    setHealth("Test health text");
    setIncome("Test income text");
  };

  // Helper to get button text based on state
  const getButtonText = (isUpdate) => {
    const allAnswered = Object.keys(answered).length === 21;
    const hasPriorities = domains.length > 0;

    if (!hasPriorities && !allAnswered) {
      return "Score all life areas and select at least one Priority";
    }
    if (!hasPriorities) {
      return "Select at least one priority";
    }
    if (!allAnswered) {
      return "Please score all life areas";
    }
    return isUpdate ? "Update this Survey" : "Save this Survey";
  };

  const SurveyButton = () => {
    const isUpdate = router.query.surveyId !== undefined;
    const isDisabled =
      domains.length === 0 || Object.keys(answered).length !== 21;

    return (
      <button
        disabled={isDisabled}
        className="text-white text-sm rounded py-2 px-4 mt-5 bg-gradient-to-t from-orange-600 to-orange-400 disabled:bg-gradient-to-b disabled:from-gray-300 disabled:to-gray-400"
        onClick={handleSaveSurvey}
      >
        {getButtonText(isUpdate)}
      </button>
    );
  };

  return (
    <Layout
      title={"Life Area Survey"}
      session={user}
      version={router.query.clientId ? client.isYouth : user.isYouth}
    >
      <Head>
        <title>TTS / Life Area Survey</title>
      </Head>
      {router.query.clientId === undefined ? (
        ""
      ) : (
        <div className={"text-xl text-center p-3 truncate dark:text-white"}>
          Client: {client?.name}
        </div>
      )}
      <div className={"text-xl text-center p-3 truncate dark:text-white"}>
        Dream: {router.query.dreamName}
      </div>

      {/* Admin Testing Mode */}
      {user?.level === "admin" && (
        <div className="mb-4 p-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg dark:bg-yellow-900 dark:bg-opacity-20 dark:border-yellow-600">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-yellow-800 dark:text-yellow-400">
                ⚡ Testing Mode
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={testingMode}
                  onChange={(e) => setTestingMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-600"></div>
              </label>
            </div>
            {testingMode && (
              <button
                onClick={generateTestData}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-sm rounded hover:from-purple-700 hover:to-purple-600 transition-all shadow-md"
              >
                ✨ Generate Test Data
              </button>
            )}
          </div>
          {testingMode && (
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              Testing mode active - Generate button will auto-fill the survey
              without saving
            </p>
          )}
        </div>
      )}

      <div
        className={
          "p-4 bg-gray-100 rounded text-sm mb-4 text-center dark:rounded-lg dark:shadow-xl dark:text-white dark:bg-black dark:bg-opacity-70"
        }
      >
        <p>Where am I today?</p>
        <p>
          <strong>
            &quot;What I treasure most in life, is being able to dream. During
            my most difficult moments and complex situations, I have been able
            to dream of a more beautiful life.&quot;
          </strong>
          -- Rigoberta Mensh&ugrave;, Guatemalan human rights activist and Nobel
          Peace prize winner
        </p>
        <p>
          What does your life look like now? Knowing where you are is key to
          finding your path. How are things going? What areas in your life are
          challenging? Where are you feeling confident? Where could you use
          help?
        </p>
        <p>
          Using the Life Area Survey, you can see how things are going and the
          areas you want to work on now.
        </p>
      </div>
      <div
        className={
          "bg-gray-600 text-center p-2 text-white mb-3 rounded flex justify-around font-light text-sm grid-cols-1 md:grid-cols-2 dark:bg-black"
        }
      >
        <div>
          Priorities: <strong>{domains.length}</strong>
        </div>
        <div>
          Answered: <strong>{Object.keys(answered).length}/21</strong>
        </div>
      </div>
      <div
        className={`bg-red-600 p-2 rounded text-center text-white text-xs mb-2 ${Object.keys(answered).length === 21 ? "hidden" : null} dark:bg-indigo-800`}
      >
        You&apos;ve completed {Object.keys(answered).length} of 21 life areas.
        Keep going!
      </div>
      <div
        className={`bg-red-600 p-2 rounded text-center text-white text-xs mb-6 ${domains.length > 0 ? "hidden" : null} dark:bg-indigo-800`}
      >
        Please select at least one life area as a priority by using the toggle.
      </div>
      <div className={"flex"}>
        <div className={"flex-initial"}>
          <SurveyDomainList
            setActiveDomain={setActiveDomain}
            activeDomain={activeDomain}
            answered={answered}
            domains={domains}
            user={router.query.clientId ? client : user}
          />
        </div>
        <div className={"flex-grow"}>
          <div
            className={
              "p-4 bg-gray-100 m-0 md:m-4 my-2 md:my-0 dark:rounded-lg dark:shadow-xl dark:text-white dark:bg-black dark:bg-opacity-70"
            }
          >
            <h2 className={"uppercase text-gray-600 dark:text-gray-300"}>
              Instructions
            </h2>
            <p className={"text-xs"}>
              Click or tap on each of the life areas to choose the option that
              best describes where you are today. You may need to scroll down to
              see all 21 life areas. You must select an answer for each life
              area. If one does not apply to you, then select &quot;This does
              not apply to me.&quot; If the life area is something you want to
              work on, use the &quot;Set as priority&quot; toggle button. Life
              areas that you mark as a priority will have a red flag in the life
              areas list.
            </p>
            <p>MOST IMPORTANT TO YOU -- your priorities.</p>
          </div>
          <NewLifeAreaSurveyForm
            activeDomain={activeDomain}
            setAnswered={setAnswered}
            answered={answered}
            domains={domains}
            setDomains={setDomains}
            user={router.query.clientId ? client : user}
          />
        </div>
      </div>

      <NewLifeAreaSurveyQuestions
        surprise={surprise}
        setSurprise={setSurprise}
        concern={concern}
        setConcern={setConcern}
        family={family}
        setFamily={setFamily}
        health={health}
        setHealth={setHealth}
        income={income}
        setIncome={setIncome}
      />

      <div className={"flex justify-end"}>
        <SurveyButton />
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  let dream, dreamId;
  if (context.query.dream !== undefined) {
    dream = context.query.dream;
    dreamId = context.query.dreamId;
  } else {
    dream = "";
    dreamId = "";
  }

  // session check and possible redirect
  const session = await getSession(context);
  if (!session)
    return { redirect: { destination: "/login", permanent: false } };

  // dynamic url setup
  const { req } = context;
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const baseUrl = req ? `${protocol}://${req.headers.host}` : "";

  // page data
  let dataUrl;
  if (context.query.clientId) {
    dataUrl =
      baseUrl +
      "/api/pages/surveysPageData?userId=" +
      session.user._id +
      "&clientId=" +
      context.query.clientId;
  } else {
    dataUrl = baseUrl + "/api/pages/surveysPageData?userId=" + session.user._id;
  }
  const getData = await fetch(dataUrl);
  const { user, client } = await getData.json();

  return {
    props: {
      user,
      client: client || null, // Ensure client is null instead of undefined
      incomingDream: {
        hasDream: context.query.dream !== undefined,
        dream: dream,
        dreamId: dreamId,
      },
    },
  };
}
