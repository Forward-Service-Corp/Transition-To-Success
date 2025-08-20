import {connectToDatabase} from "../../lib/dbConnect";
import {ObjectId} from "mongodb";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {

    const {db} = await connectToDatabase()
    const survey = await db.collection("lifeAreaSurveys").find({_id: ObjectId(req.query.surveyId)})

    let records;
    if (survey.name === undefined) {
        const client = await db.collection("users").findOne({ id: ObjectId(survey.userId)})

        records = {...survey, name: client.name}
    }

    res.json(records)

}
