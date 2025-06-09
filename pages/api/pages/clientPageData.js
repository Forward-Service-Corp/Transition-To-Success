import {connectToDatabase} from "../../../lib/dbConnect";
import {ObjectId} from "mongodb";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {

    const { clientId, clientEmail } = req.query;

    const clientQuery = {
        _id: new ObjectId(clientId)
    }
    const UID = {
        userId: new ObjectId(clientId)
    }

    const {db} = await connectToDatabase()

    const user = await db.collection("users").findOne(clientQuery)

    const dreamsCursor = await db.collection("dreams").find(UID)
    const dreams = await dreamsCursor.toArray()
    await dreamsCursor.close()

    const surveysCursor = await db.collection("lifeAreaSurveys").find(UID)
    const surveys = await surveysCursor.toArray()
    await surveysCursor.close()

    const referralsCursor = await db.collection("referrals").find(UID)
    const referrals = await referralsCursor.toArray()
    await referralsCursor.close()

    const tasksCursor = await db.collection("todos").find(UID)
    const tasks = await tasksCursor.toArray()
    await tasksCursor.close()

    const notesCursor = await db.collection("notes").find(UID)
    const notes = await notesCursor.toArray()
    await notesCursor.close()

    res.json({user, dreams, surveys, referrals, tasks, notes})

}
