import {connectToDatabase} from "../../lib/dbConnect";
import {ObjectId} from "mongodb";

// sets a referral as archived or active


// eslint-disable-next-line import/no-anonymous-default-export

export default async (req, res) => {
    const {db} = await connectToDatabase()
    const record = await db
        // looks in the collection "Referrals"
        .collection("referrals")
        // and updates One record
        .updateOne(
            // whose _id matches the request's referralID
            { _id: ObjectId(req.query.referralId) },
            {
                // by setting its archived property to the status sent in with the API call
                $set: {
                    archived: req.query.status
                }
            }
        )
    res.json(record)

}
