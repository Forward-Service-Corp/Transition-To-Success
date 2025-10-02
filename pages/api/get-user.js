import {connectToDatabase} from "../../lib/dbConnect";
import {ObjectId} from "mongodb";

// eslint-disable-next-line import/no-anonymous-default-export
export default async(req, res) => {
    try {
        if (!req.query.userId) {
            console.error("get-user: Missing userId parameter");
            return res.status(400).json({error: "Missing userId parameter"});
        }

        if (!ObjectId.isValid(req.query.userId)) {
            console.error("get-user: Invalid userId format:", req.query.userId);
            return res.status(400).json({error: "Invalid userId format"});
        }

        const {db} = await connectToDatabase()
        const user = await db.collection("users").findOne({_id: new ObjectId(req.query.userId)})
        
        if (!user) {
            console.error("get-user: User not found:", req.query.userId);
            return res.status(404).json({error: "User not found"});
        }
        
        res.json(user)
    } catch (error) {
        console.error("get-user: Error:", error);
        res.status(500).json({error: "Internal server error", message: error.message});
    }

}
