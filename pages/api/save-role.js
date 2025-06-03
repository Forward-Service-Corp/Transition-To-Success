import {connectToDatabase} from "../../lib/dbConnect";
import {ObjectId} from "mongodb";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
    const {db} = await connectToDatabase()
    const roleEntry = {
        role: req.query.role,
        date: new Date()
    };

    const record = await db
        .collection("users")
        .updateOne(
            { _id: ObjectId(req.query.userId) },
            {
                $set: {
                    level: req.query.role
                },
                $push: {
                    roles: roleEntry
                }
            }
        )
    const result = await db
        .collection("users")
        .findOne({ _id: ObjectId(req.query.userId)})
    res.json(result)
}
