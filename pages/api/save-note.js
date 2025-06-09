import {connectToDatabase} from "../../lib/dbConnect";
import {ObjectId} from "mongodb";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
    const record = {
        referralId: req.body.referralId,
        taskId: req.body.taskId,
        userId: ObjectId(req.body.userId),
        note: req.body.note,
        timestamp: req.body.timestamp,
        surveyId: req.body.surveyId,
        modifiedBy: req.body.modifiedBy
    }

    const {db} = await connectToDatabase()
    const user = await db
        .collection("notes")
        .insertOne(record)

    res.json(user)

}
