import clientPromise from "../../lib/mongodb";
import {ObjectId} from "mongodb";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    try {
        const { userId, coachObject } = req.body;
        const userSearchId = new ObjectId(userId);
        const coachObjectId = new ObjectId(coachObject.key);
        console.log(userId, coachObject)

        if (!userId || !coachObject) {
            return res.status(400).json({ message: 'User ID and Coach Object are required' });
        }

        const client = await clientPromise;
        const db = client.db(); // Replace with your DB name if necessary
        const collection = db.collection('users');

        const result = await collection.updateOne(
            {
                _id: userSearchId,
                coach: {$elemMatch: {key: coachObjectId}},
            },
            {
                $set: { 'coach.$[elem].removalDate': new Date() }
            },
            {
                arrayFilters: [{ 'elem.key': coachObjectId }]
            }
        );

        const user = await collection.findOne({ _id: userSearchId })

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'User not found or coach not removed' });
        }

        res.status(200).json({ message: 'Coach removed successfully', result, user });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error });
    }
}
