import {connectToDatabase} from "../../lib/dbConnect";
import {ObjectId} from "mongodb";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
    let q
    if (req.query.surveyId === undefined) {
        q = {
            userId: ObjectId(req.query.userId),
        }
    } else {
        q = {
            userId: ObjectId(req.query.userId),
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

}
