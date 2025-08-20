import {connectToDatabase} from "../../lib/dbConnect";
import {ObjectId} from "mongodb";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {

    //console.warn(req.query.surveyId)

    const {db} = await connectToDatabase()
    const cursor = await db.collection("lifeAreaSurveys").find({_id: ObjectId(req.query.surveyId)})
    let records = await cursor.toArray()
    await cursor.close()

    const user = await db.collection("users").findOne({_id: records[0].userId})

    records[0] = {...records[0], name:user.name}
    //console.log(records)

    res.json(records)

}
