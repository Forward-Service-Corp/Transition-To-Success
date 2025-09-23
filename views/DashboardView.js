import {useState} from "react"
import DashboardMetric from "../components/dashboardMetric";
import WelcomeGroupAdult from "../components/pages/welcomeGroupAdult";
import WelcomeGroupYouth from "../components/pages/welcomeGroupYouth";
import useSpaData from "../hooks/useSpaData";

const DashboardView = ({ navigateToView }) => {
    const [currentTab, setCurrentTab] = useState(1)

    // Use SPA data fetching for dashboard data
    const { data: dashboardData, loading: dashboardLoading, error: dashboardError } = useSpaData('/api/pages/indexPageData');

    // Show loading state while data is being fetched
    if (dashboardLoading || !dashboardData) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="uppercase text-gray-600 text-sm">loading dashboard...</div>
            </div>
        );
    }

    // Show error state if data fetching failed
    if (dashboardError) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-red-600 text-sm">Error loading dashboard: {dashboardError}</div>
            </div>
        );
    }

    const { user, dreams, surveys, referrals, tasks } = dashboardData;
    const completedTasks = tasks ? tasks.filter(task => {
        // Safely check if task is completed - handle various data types
        if (typeof task.completed === 'boolean') {
            return task.completed;
        }
        if (typeof task.completed === 'string') {
            return task.completed.toLowerCase() === 'true';
        }
        return Boolean(task.completed);
    }).length : 0;

    function prevPage() {
        setCurrentTab(prevState => prevState - 1)
    }

    function nextPage() {
        setCurrentTab(prevState => prevState + 1)
    }

    return (
        <>
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 mb-8`}>
                <DashboardMetric metric={dreams?.length || 0} label={"Active Dreams"} />
                <DashboardMetric metric={surveys?.length || 0} label={"Life Area Surveys"} />
                <DashboardMetric metric={referrals?.length || 0} label={"Referrals"} />
                <DashboardMetric metric={completedTasks} label={"Tasks Completed"} />
            </div>
            <div className={`grid grid-cols-1 gap-3`}>
                <div className={`${currentTab === 1 ? "visible" : "hidden"}`}>
                    <WelcomeGroupAdult
                        user={user}
                        currentTab={currentTab}
                        nextPage={nextPage}
                        dreams={dreams}
                        navigateToView={navigateToView}
                    />
                </div>
                <div className={`${currentTab === 2 ? "visible" : "hidden"}`}>
                    <WelcomeGroupYouth
                        user={user}
                        currentTab={currentTab}
                        prevPage={prevPage}
                        nextPage={nextPage}
                        navigateToView={navigateToView}
                    />
                </div>
            </div>
        </>
    );
};

export default DashboardView;