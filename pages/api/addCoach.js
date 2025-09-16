// pages/api/users/add-coach.js
import { connectToDatabase } from "../../lib/dbConnect";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests are allowed" });
  }

  try {
    const { userId, coachObject } = req.body;

    if (!userId || !coachObject) {
      return res
        .status(400)
        .json({ message: "User ID and Coach Object are required" });
    }

    const { db } = await connectToDatabase();
    const collection = db.collection("users");

    const result = await collection.updateOne(
      { $or: [{ _id: ObjectId(userId) }, { key: ObjectId(userId) }] },
      {
        $push: {
          coach: {
            _id: new ObjectId(coachObject._id),
            email: coachObject.email,
            name: coachObject.name,
            timestamp: new Date(),
          },
        },
      }
    );

    const user = await collection.findOne({
      $or: [{ _id: new ObjectId(userId) }, { key: new ObjectId(userId) }],
    });

    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "User not found or coach not added" });
    }

    res.status(200).json({ message: "Coach added successfully", result, user });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
}
