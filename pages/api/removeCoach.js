import { connectToDatabase } from "../../lib/dbConnect";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests are allowed" });
  }

  try {
    const { userId, coachObject } = req.body;
    const userSearchId = new ObjectId(userId);
    const coachObjectId = new ObjectId(coachObject._id);
    const coachObjectKey = new ObjectId(coachObject.key);

    console.log(userId, coachObject);

    if (!userId || !coachObject) {
      return res
        .status(400)
        .json({ message: "User ID and Coach Object are required" });
    }

    const {db} = await connectToDatabase()
    const collection = db.collection("users");

    const result = await collection.updateOne(
      {
        _id: userSearchId,
        coach: {
          $elemMatch: {
            $or: [
              {
                _id: coachObjectId,
              },
              {
                key: coachObjectKey,
              },
            ],
          },
        },
      },
      {
        $set: { "coach.$[elem].removalDate": new Date() },
      },
      {
        arrayFilters: [
          {
            $or: [
              { "elem._id": coachObjectId },
              { "elem.key": coachObjectKey },
            ],
          },
        ],
      }
    );
    console.log(result)
    const user = await collection.findOne({ $or: [{ _id: ObjectId(userSearchId) }, { key: ObjectId(userSearchId) }] });

    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "User not found or coach not removed" });
    }

    res
      .status(200)
      .json({ message: "Coach removed successfully", result, user });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
}
