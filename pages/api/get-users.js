import {connectToDatabase} from "../../lib/dbConnect";

// eslint-disable-next-line import/no-anonymous-default-export
export default async(req, res) => {
    let q = {
            _id: {$exists: true}
        }

    const {db} = await connectToDatabase()
    const cursor = await db.collection("users").find(q).limit(100).sort({timestamp: -1})
    const records = await cursor.toArray()
    await cursor.close()

    res.json(records)
 
}
