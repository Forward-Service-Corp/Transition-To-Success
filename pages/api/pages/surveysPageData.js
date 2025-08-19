import {connectToDatabase} from "../../../lib/dbConnect";
import {ObjectId} from "mongodb";

// eslint-disable-next-line import/no-anonymous-default-export
export default async(req, res) => {

    const {db} = await connectToDatabase()
    const user = await db.collection("users").findOne({_id: ObjectId(req.query.userId)})
    const client = (query.clientId ? await db.collection("users").findOne({_id: ObjectId(req.query.clientId)}) : undefined)
    const query = { userId: ObjectId(req.query.userId) }

    const surveysCursor = await db.collection("lifeAreaSurveys").find( query )
    const surveys = await surveysCursor.toArray()
    await surveysCursor.close()

    res.json({user, client, surveys})

}
