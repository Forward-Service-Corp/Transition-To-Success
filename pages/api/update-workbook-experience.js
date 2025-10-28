import {connectToDatabase} from "../../lib/dbConnect";
import {ObjectId} from "mongodb";

// eslint-disable-next-line import/no-anonymous-default-export
export default async(req, res) => {
    const {db} = await connectToDatabase()
    const UID = req.query.userId
    //console.log(req.query.setTo === "true")
    // const userId = new ObjectId(UID)
    const user = await db
        .collection("users")
        .updateOne(
            { _id: new ObjectId(UID) },
            {
                $set: {
                    isYouth: req.query.setTo === "true"
                }
            }
        )
        //console.log(user)

    res.json(user)
}
