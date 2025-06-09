import {connectToDatabase} from "../../lib/dbConnect";
import {ObjectId} from 'mongodb'

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
    let q = {
        userId: ObjectId(req.query.userId),
        // referralId: req.query.referralId
    }

    const {db} = await connectToDatabase()
    const cursor = await db.collection("todos").find(q)
    const records = await cursor.toArray()
    await cursor.close()

    res.json(records)

}
