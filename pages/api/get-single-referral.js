import {connectToDatabase} from "../../lib/dbConnect";
import {ObjectId} from "mongodb";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {

    const {db} = await connectToDatabase()
    const referral = await db
        .collection("services")
        .findOne({_id: new ObjectId(req.query.referralId)})

    res.json(referral)

}
