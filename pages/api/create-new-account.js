import {connectToDatabase} from "../../lib/dbConnect";

// eslint-disable-next-line import/no-anonymous-default-export
export default async(req, res) => {

    const {userData} = req.body;
    const {first_name, last_name, isYouth, email} = userData;
    const isFSC = email.indexOf("fsc") > -1
    if (isFSC) {
        userData.level = "coach"
    }
    userData.name = `${first_name} ${last_name}`;
    userData.isYouth = isYouth === "Youth";

    const {db} = await connectToDatabase();
    const user = await db.collection("users").insertOne(userData);

    res.json(user)

}
