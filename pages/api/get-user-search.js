// import {connectToDatabase} from "../../lib/dbConnect";
// import {ObjectId} from "mongodb";
import {MongoClient} from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            // Connect to the database
            const client = new MongoClient(uri);
            await client.connect();
            const db = client.db(dbName);

            // Retrieve the search term from the request body
            const { searchTerm } = req.body;

            // Ensure searchTerm is provided
            if (!searchTerm) {
                res.status(400).json({ error: 'Search term is required' });
                return;
            }

            // Perform the search query
            const usersCollection = db.collection('users');
            const searchResult = await usersCollection.find({
                $or: [
                    { email: new RegExp(searchTerm, 'i') }, // Case-insensitive regex for email
                    { phone: new RegExp(searchTerm, 'i') }, // Case-insensitive regex for phone
                    { name: new RegExp(searchTerm, 'i') } // Case-insensitive regex for phone
                ]
            }).toArray();

            // Close the database connection
            await client.close();

            // Send the search results back to the client
            res.status(200).json(searchResult);
        } catch (error) {
            // Handle any errors that occurred during the process
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        // Handle non-POST requests
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
