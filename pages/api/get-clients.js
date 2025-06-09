import {connectToDatabase} from "../../lib/dbConnect";
import {ObjectId} from "mongodb";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
    const {coachId} = req.query;
    const {db} = await connectToDatabase()
    const coachObjectId = new ObjectId(coachId);
    const cursor = await db.collection("users").find({
        coach: {
            $elemMatch: {
                key: coachObjectId,
                $and: [
                    { $or: [{ terminationDate: { $exists: false } }, { terminationDate: null }] },
                    { $or: [{ removalDate: { $exists: false } }, { removalDate: null }] }
                ]
            }
        }
    });
    const records = await cursor.toArray()
    await cursor.close()

    res.json(records)

}
