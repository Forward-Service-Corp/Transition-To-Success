import { useState, useEffect } from "react";
import { useSession } from 'next-auth/react';
import useSpaData from "../hooks/useSpaData";
import LasHistory from "../components/lasHistory";
import LasCurrent from "../components/lasCurrent";

const LifeAreaSurveysView = ({ navigateToView }) => {
    const { data: session } = useSession();
    const [currentDream, setCurrentDream] = useState("");
    const [currentDreamId, setCurrentDreamId] = useState("");
    const [surveysList, setSurveysList] = useState([]);

    // Use the existing surveysPageData API endpoint
    const { data: pageData, loading, error } = useSpaData('/api/pages/surveysPageData');

    useEffect(() => {
        if (pageData?.surveys) {
            setSurveysList(pageData.surveys);
        }
    }, [pageData]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="uppercase text-gray-600 text-sm">loading life area surveys...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-red-600 text-sm">Error loading surveys: {error}</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="w-full border-b-[1px] pb-2 mb-5">
                <h2 className="uppercase text-orange-600">Active Life Area Survey</h2>
            </div>

            <LasCurrent
                user={pageData?.user || session?.user}
                surveys={surveysList}
                setSurveys={setSurveysList}
                dreamId={currentDreamId}
                dream={currentDream}
            />

            <div className="w-full border-b-[1px] pb-2 mb-5 mt-10">
                <h2 className="uppercase text-orange-600 mb-5">Life Area Survey History</h2>
            </div>

            <LasHistory
                user={pageData?.user || session?.user}
                surveys={surveysList}
                setSurveys={setSurveysList}
                dreamId={currentDreamId}
                dream={currentDream}
            />
        </div>
    );
};

export default LifeAreaSurveysView;