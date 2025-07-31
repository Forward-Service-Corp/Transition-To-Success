import {connectToDatabase} from "../../../lib/dbConnect";
import {ObjectId} from "mongodb";

// eslint-disable-next-line import/no-anonymous-default-export
export default async(req, res) => {

    const {db} = await connectToDatabase()
    
    const query = req.query.userID == 'guest' ? {name: 'Guest'} : {_id: ObjectId(req.query.userId)}


    const user = await db.collection("users").findOne(query)

    // const directoryCursor = await db.collection("services").find().limit(60)
    const directoryCursor = await db.collection("services").find().limit(100).sort({name: 1})
    const directory = await directoryCursor.toArray()
    await directoryCursor.close()

    res.json({user, directory})

}
