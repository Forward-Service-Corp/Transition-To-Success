import {connectToDatabase} from "../../lib/dbConnect";
import {ObjectId} from "mongodb";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
    const record = {
        referralId: req.body.referralId,
        userId: ObjectId(req.body.userId),
        task: req.body.task,
        timestamp: req.body.timestamp,
        surveyId: req.body.surveyId,
        completed: false,
        modifiedBy: req.body.modifiedBy
    }

    const {db} = await connectToDatabase()
    const user = await db
        .collection("todos")
        .insertOne(record)

    res.json(user)

}
