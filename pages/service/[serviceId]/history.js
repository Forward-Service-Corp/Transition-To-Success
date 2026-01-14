import Layout from "../../../components/layout";
import { getSession } from "next-auth/react";
import Head from "next/head";
import moment from "moment";

export default function ServiceHistory({ pageDataJson, serviceId, serviceName, modifications }) {
  const { user } = pageDataJson;
  const loading = false;

  const getActionColor = (action) => {
    switch (action) {
      case 'created':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'updated':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'deleted':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  return (
    <Layout title="Service Modification History" session={user}>
      <Head>
        <title>TTS / Service History - {serviceName}</title>
      </Head>
      <div className="w-full max-w-4xl m-auto p-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Modification History
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {serviceName}
        </p>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading history...</p>
          </div>
        ) : modifications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500 dark:text-gray-400">No modification history found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {modifications.map((mod, index) => (
              <div
                key={mod._id || index}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-black dark:bg-opacity-10"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded ${getActionColor(mod.action)}`}
                    >
                      {mod.action.charAt(0).toUpperCase() + mod.action.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {moment(mod.timestamp).format('MMM D, YYYY [at] h:mm A')}
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <strong>Modified by:</strong> {mod.modifiedBy?.name || 'Unknown'} (
                    <a
                      href={`mailto:${mod.modifiedBy?.email || ''}`}
                      className="text-orange-600 hover:text-orange-800 dark:text-orange-400 underline"
                    >
                      {mod.modifiedBy?.email || 'unknown@email.com'}
                    </a>
                    )
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    <strong>Summary:</strong> {mod.summary}
                  </p>

                  {mod.changes && mod.changes.length > 0 && (
                    <div className="mt-3 pl-4 border-l-2 border-gray-300 dark:border-gray-600">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Changes:
                      </p>
                      <ul className="space-y-2">
                        {mod.changes.map((change, idx) => (
                          <li key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                            <strong className="capitalize">{change.field}:</strong> "
                            <span className="line-through text-red-600 dark:text-red-400">
                              {change.oldValue || '(empty)'}
                            </span>
                            " → "
                            <span className="text-green-600 dark:text-green-400">
                              {change.newValue || '(empty)'}
                            </span>
                            "
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const { req } = context;

  const protocol = req.headers["x-forwarded-proto"] || "http";
  const baseUrl = req ? `${protocol}://${req.headers.host}` : "";

  // Page data
  const pageDataUrl =
    baseUrl + "/api/pages/indexPageData" + (session ? "?userId=" + session.user._id : "");
  const getPageData = await fetch(pageDataUrl);
  const pageDataJson = await getPageData.json();

  const { serviceId } = context.query;

  if (!serviceId) {
    return {
      notFound: true,
    };
  }

  // Get service name for display
  let serviceName = "Service";
  let modifications = [];
  
  try {
    const serviceUrl = baseUrl + "/api/get-single-referral?referralId=" + serviceId;
    const getServiceData = await fetch(serviceUrl);
    const serviceData = await getServiceData.json();
    if (serviceData && serviceData.name) {
      serviceName = serviceData.name;
    }

    // Fetch modifications
    const modificationsUrl = baseUrl + "/api/get-service-modifications?serviceId=" + serviceId;
    const getModifications = await fetch(modificationsUrl);
    const modificationsData = await getModifications.json();
    if (modificationsData && modificationsData.modifications) {
      modifications = modificationsData.modifications;
    }
  } catch (err) {
    console.error("Error fetching service data:", err);
  }

  return {
    props: {
      pageDataJson,
      serviceId,
      serviceName,
      modifications,
    },
  };
}
