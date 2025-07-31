import {connectToDatabase} from "../../../lib/dbConnect";
import {ObjectId} from "mongodb";

// eslint-disable-next-line import/no-anonymous-default-export
export default async(req, res) => {

    const {db} = await connectToDatabase()
    const user = await db.collection("users").findOne({_id: ObjectId(req.query.userId)})
    const query = { userId: ObjectId(req.query.userId) }

    const carePlansCursor = await db.collection("referrals").find( query )
    const refs = await carePlansCursor.toArray()
    await carePlansCursor.close()

    const customCursor = await db.collection("customReferrals").find( query )
    const customrefs = await customCursor.toArray()
    await customCursor.close()

    const referrals = await refs.concat(customrefs)

    const notesCursor = await db.collection("notes").find( query )
    const notes = await notesCursor.toArray()
    await notesCursor.close()

    const todosCursor = await db.collection("todos").find( query )
    const todos = await todosCursor.toArray()
    await todosCursor.close();

    res.json({user, referrals, notes, todos})

}
