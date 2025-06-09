import {connectToDatabase} from "../../../lib/dbConnect";
import {ObjectId} from "mongodb";

// eslint-disable-next-line import/no-anonymous-default-export
export default async(req, res) => {

    const {db} = await connectToDatabase()
    const user = await db.collection("users").findOne({_id: new ObjectId(req.query.userId)})
    const query = { userId: req.query.userId }

    console.log(user)

    const dreamsCursor = await db.collection("dreams").find( query )
    const dreams = await dreamsCursor.toArray()
    await dreamsCursor.close()

    res.json({user, dreams})

}
