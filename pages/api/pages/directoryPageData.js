import {connectToDatabase} from "../../../lib/dbConnect";
import {ObjectId} from "mongodb";

// eslint-disable-next-line import/no-anonymous-default-export
export default async(req, res) => {

    const {db} = await connectToDatabase()
    const user = await db.collection("users").findOne({_id: ObjectId(req.query.userId)})

    console.log(user)

    // const directoryCursor = await db.collection("services").find().limit(60)
    const directoryCursor = await db.collection("services").find()
    const directory = await directoryCursor.toArray()
    await directoryCursor.close()

    res.json({user, directory})

}
