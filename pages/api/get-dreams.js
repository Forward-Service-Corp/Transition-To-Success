import {connectToDatabase} from "../../lib/dbConnect";
import {ObjectId} from "mongodb";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
    try {
        if (!req.query.userId) {
            console.error("get-dreams: Missing userId");
            return res.status(400).json({error: "Missing userId"});
        }

        if (!ObjectId.isValid(req.query.userId)) {
            console.error("get-dreams: Invalid userId:", req.query.userId);
            return res.status(400).json({error: "Invalid userId"});
        }

        const {db} = await connectToDatabase()
        const cursor = await db.collection("dreams")
            .find({
                userId: new ObjectId(req.query.userId),
                status: req.query.status === undefined ? {$exists: true} : req.query.status
            })
        const records = await cursor.toArray()
        await cursor.close()

        res.json(records)
    } catch (error) {
        console.error("get-dreams: Error:", error);
        res.status(500).json({error: "Internal server error", message: error.message});
    }

}
