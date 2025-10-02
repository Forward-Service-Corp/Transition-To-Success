import {connectToDatabase} from "../../../lib/dbConnect";
import {ObjectId} from "mongodb";

// eslint-disable-next-line import/no-anonymous-default-export
export default async(req, res) => {
    try {
        const {db} = await connectToDatabase()
        
        // userId is optional for directory page (can be accessed without login)
        let user = null;
        if (req.query.userId) {
            if (!ObjectId.isValid(req.query.userId)) {
                console.error("directoryPageData: Invalid userId format:", req.query.userId);
                return res.status(400).json({error: "Invalid userId format"});
            }
            
            const query = {_id: new ObjectId(req.query.userId)}
            user = await db.collection("users").findOne(query)
        }

        const directoryCursor = await db.collection("services").find().limit(100).sort({name: 1})
        const directory = await directoryCursor.toArray()
        await directoryCursor.close()

        res.json({user, directory})
    } catch (error) {
        console.error("directoryPageData: Error:", error);
        res.status(500).json({error: "Internal server error", message: error.message});
    }

}
