import { connectToDatabase } from "../../lib/dbConnect";
import { ObjectId } from "mongodb";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  const { coachId } = req.query;
  const { db } = await connectToDatabase();
  const usersCollection = db.collection("users");
  const coachObjectId = new ObjectId(coachId); // Assuming coachId is an ObjectId

  // Update to set terminationDate in the matching coach array object
  const updateResult = await usersCollection.updateMany(
    {
      coach: {
        $elemMatch: {
          $or: [
            {
              _id: coachObjectId,
            },
            {
              key: coachObjectId,
            },
          ],
        },
      },
    },
    {
      $set: { "coach.$[elem].terminationDate": new Date() },
    },
    {
      arrayFilters: [
        {
          $or: [{ "elem._id": coachObjectId }, { "elem.key": coachObjectId }],
        },
      ],
    },
  );

  // Check if documents were modified
  if (updateResult.modifiedCount > 0) {
    // Retrieve the updated documents
    const updatedDocuments = await usersCollection
      .find({
        coach: {
          $elemMatch: {
            $and: [
              {
                $or: [
                  {
                    key: coachObjectId,
                  },
                  {
                    _id: coachObjectId,
                  },
                ],
              },
              { terminationDate: { $exists: true } },
            ],
          },
        },
      })
      .toArray();
    res.status(200).json({
      message: `Coach removed from ${updateResult.modifiedCount} clients.`,
      matchedCount: updateResult.matchedCount,
      modifiedCount: updateResult.modifiedCount,
      updatedDocuments,
    });
  } else {
    res.status(200).json({
      message: "Coach not removed from any clients.",
      matchedCount: updateResult.matchedCount,
      modifiedCount: updateResult.modifiedCount,
      updatedDocuments: [],
    });
  }
};
