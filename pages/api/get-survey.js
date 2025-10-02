import {connectToDatabase} from "../../lib/dbConnect";
import {ObjectId} from "mongodb";

// eslint-disable-next-line import/no-anonymous-default-export
export default async(req, res) => {
    try {
        if (!req.query.surveyId) {
            console.error("get-survey: Missing surveyId parameter");
            return res.status(400).json({error: "Missing surveyId parameter"});
        }

        if (!ObjectId.isValid(req.query.surveyId)) {
            console.error("get-survey: Invalid surveyId format:", req.query.surveyId);
            return res.status(400).json({error: "Invalid surveyId format"});
        }

        const {db} = await connectToDatabase()
        const survey = await db
            .collection("lifeAreaSurveys")
            .findOne({_id: new ObjectId(req.query.surveyId)})
        
        if (!survey) {
            console.error("get-survey: Survey not found:", req.query.surveyId);
            return res.status(404).json({error: "Survey not found"});
        }
        
        res.json(survey)
    } catch (error) {
        console.error("get-survey: Error:", error);
        res.status(500).json({error: "Internal server error", message: error.message});
    }

}
