import {connectToDatabase} from "../../../lib/dbConnect";
import {ObjectId} from "mongodb";

// eslint-disable-next-line import/no-anonymous-default-export
export default async(req, res) => {
    try {
        // Validate required parameters
        if (!req.query.userId) {
            console.error("carePlansPageData: Missing userId parameter");
            return res.status(400).json({error: "Missing userId parameter"});
        }

        if (!ObjectId.isValid(req.query.userId)) {
            console.error("carePlansPageData: Invalid userId format:", req.query.userId);
            return res.status(400).json({error: "Invalid userId format"});
        }

        const {db} = await connectToDatabase()
        const user = await db.collection("users").findOne({_id: new ObjectId(req.query.userId)})
        
        if (!user) {
            console.error("carePlansPageData: User not found:", req.query.userId);
            return res.status(404).json({error: "User not found"});
        }
        
        const query = { userId: new ObjectId(req.query.userId) }

        const carePlansCursor = await db.collection("referrals").find( query )
        const refs = await carePlansCursor.toArray()
        await carePlansCursor.close()

        const customCursor = await db.collection("customReferrals").find( query )
        const customrefs = await customCursor.toArray()
        await customCursor.close()

        const referrals = await refs.concat(customrefs)

        const notesCursor = await db.collection("notes").find( query )
        const notes = await notesCursor.toArray()
        await notesCursor.close()

        const todosCursor = await db.collection("todos").find( query )
        const todos = await todosCursor.toArray()
        await todosCursor.close();

        res.json({user, referrals, notes, todos})
    } catch (error) {
        console.error("carePlansPageData: Error:", error);
        res.status(500).json({error: "Internal server error", message: error.message});
    }

}
