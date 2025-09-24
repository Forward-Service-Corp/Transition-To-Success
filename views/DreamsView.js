import {useEffect, useState, useCallback} from "react";
import SavedDreams from "../components/savedDreams";
import DreamIntro from "../components/pages/dreamIntro";
import DreamForm from "../components/dreamForm";
import {useSession} from "next-auth/react";
import useSpaData from "../hooks/useSpaData";

const DreamsView = ({ navigateToView }) => {
    const { data: session } = useSession();
    const [savedDreams, setSavedDreams] = useState([])
    const [simpleModal, setSimpleModal] = useState(false)
    const [currentTab, setCurrentTab] = useState("active")

    // Use SPA data fetching for page data
    const { data: pageData, loading: pageLoading, error: pageError } = useSpaData('/api/pages/dreamsPageData');

    // Use SPA data fetching for dreams
    const { data: dreamsData, loading: dreamsLoading, refetch: refetchDreams } = useSpaData('/api/get-dreams');

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
            <div className="flex items-center justify-center h-64">
                <div className="uppercase text-gray-600 text-sm">loading dreams...</div>
            </div>
        );
    }

    // Show error state if data fetching failed
    if (pageError) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-red-600 text-sm">Error loading dreams: {pageError}</div>
            </div>
        );
    }

    const { user, dreams } = pageData;

    return (
        <>
            <div className={""}>
                <div className={"grid grid-cols-1 md:grid-cols-2 gap-4"}>
                    <div className={"bg-white p-3 rounded dark:bg-black dark:text-white"}>
                        <DreamIntro user={user}/>
                        <DreamForm
                            user={user}
                            setSimpleModal={setSimpleModal}
                            navigateToView={navigateToView}
                            getDreams={getDreams}
                        />
                    </div>
                    <div>
                        <div className={"bg-gray-100 p-3 mb-3 dark:bg-opacity-0 dark:text-white"}>
                            My <select className={"text-xs border-gray-300 rounded dark:bg-black dark:border-0 "}
                                       id={"currentTab"}
                                       onChange={(e) => {
                                           setCurrentTab(e.target.value)
                                       }}>
                            <option value="active">Active</option>
                            <option value="complete">Complete</option>
                            <option value="archived">Archived</option>
                        </select> Dreams
                        </div>
                        <div className={`${currentTab === "active" ? "visible" : "hidden"}`}>
                            <SavedDreams savedDreams={savedDreams?.filter(dream => dream.status === "active")} setSavedDreams={setSavedDreams}/>
                        </div>
                        <div className={`${currentTab === "complete" ? "visible" : "hidden"}`}>
                            <SavedDreams savedDreams={savedDreams?.filter(dream => dream.status === "complete")} setSavedDreams={setSavedDreams}/>
                        </div>
                        <div className={`${currentTab === "archived" ? "visible" : "hidden"}`}>
                            <SavedDreams savedDreams={savedDreams?.filter(dream => dream.status === "archived")} setSavedDreams={setSavedDreams}/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DreamsView;