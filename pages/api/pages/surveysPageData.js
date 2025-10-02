import {connectToDatabase} from "../../../lib/dbConnect";
import {ObjectId} from "mongodb";

// eslint-disable-next-line import/no-anonymous-default-export
export default async(req, res) => {
    try {
        // Validate required parameters
        if (!req.query.userId) {
            console.error("surveysPageData: Missing userId parameter");
            return res.status(400).json({error: "Missing userId parameter"});
        }

        // Validate ObjectId format
        if (!ObjectId.isValid(req.query.userId)) {
            console.error("surveysPageData: Invalid userId format:", req.query.userId);
            return res.status(400).json({error: "Invalid userId format"});
        }

        if (req.query.clientId && !ObjectId.isValid(req.query.clientId)) {
            console.error("surveysPageData: Invalid clientId format:", req.query.clientId);
            return res.status(400).json({error: "Invalid clientId format"});
        }

        const {db} = await connectToDatabase()
        
        const user = await db.collection("users").findOne({_id: new ObjectId(req.query.userId)})
        
        if (!user) {
            console.error("surveysPageData: User not found:", req.query.userId);
            return res.status(404).json({error: "User not found"});
        }
        
        const client = req.query.clientId 
            ? await db.collection("users").findOne({_id: new ObjectId(req.query.clientId)}) 
            : null;
        
        const query = { userId: new ObjectId(req.query.userId) }

        const surveysCursor = await db.collection("lifeAreaSurveys").find(query)
        const surveys = await surveysCursor.toArray()
        await surveysCursor.close()

        res.json({user, client, surveys})
    } catch (error) {
        console.error("surveysPageData: Error:", error);
        res.status(500).json({error: "Internal server error", message: error.message});
    }

}
