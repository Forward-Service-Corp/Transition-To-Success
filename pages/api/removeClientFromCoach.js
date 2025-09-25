// pages/api/users/add-coach.js
import clientPromise from "../../lib/mongodb";
import {ObjectId} from "mongodb";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    try {
        const { clientId, userId } = req.body;

        if (!userId || !clientId) {
            return res.status(400).json({ message: 'User ID and Coach Object are required' });
        }

        const client = await clientPromise;
        const db = client.db(); // Replace with your DB name if necessary
        const collection = db.collection('users');

        const result = await collection.updateOne(
            { _id: ObjectId(clientId) },
            { $pull: { coach: { key: ObjectId(userId) } } }
        );

        const user = await collection.findOne({ _id: ObjectId(clientId) })


        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'User not found or coach not removed' });
        }

        res.status(200).json({ message: 'Coach removed successfully', result, user });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error });
    }
}
