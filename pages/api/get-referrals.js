import {connectToDatabase} from "../../lib/dbConnect";
import {ObjectId} from "mongodb";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
    try {
        // Validate required parameters
        if (!req.query.userId) {
            console.error("get-referrals: Missing userId parameter");
            return res.status(400).json({error: "Missing userId parameter"});
        }

        if (!ObjectId.isValid(req.query.userId)) {
            console.error("get-referrals: Invalid userId format:", req.query.userId);
            return res.status(400).json({error: "Invalid userId format"});
        }

        let q
        if (req.query.surveyId === undefined) {
            q = {
                userId: new ObjectId(req.query.userId),
            }
        } else {
            q = {
                userId: new ObjectId(req.query.userId),
                surveyId: req.query.surveyId
            }
        }

        const {db} = await connectToDatabase()

        const cursor = await db.collection("referrals").find(q)
        const records = await cursor.toArray()
        await cursor.close()

        const customCursor = await db.collection("customReferrals").find(q)
        const customRecords = await customCursor.toArray()
        await customCursor.close()

        const allRecords = await records.concat(customRecords)

        res.json(allRecords)
    } catch (error) {
        console.error("get-referrals: Error:", error);
        res.status(500).json({error: "Internal server error", message: error.message});
    }

}
