import {connectToDatabase} from "../../lib/dbConnect";
import {ObjectId} from "mongodb";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
    const {db} = await connectToDatabase()
    console.log(req.query)
    const UID = req.query.userId
    const userId = new ObjectId(UID)
    const record = await db
        .collection("users")
        .updateOne(
            { _id: userId },
            {
                $set: {
                    lastLogin: new Date()
                }
            }
        )
    res.json(record)

}
