import {connectToDatabase} from "../../lib/dbConnect";
import {ObjectId} from "mongodb";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({error: 'Method not allowed'});
    }

    try {
        const {serviceId} = req.query;

        if (!serviceId) {
            return res.status(400).json({error: 'serviceId is required'});
        }

        if (!ObjectId.isValid(serviceId)) {
            return res.status(400).json({error: 'Invalid serviceId format'});
        }

        const {db} = await connectToDatabase();
        
        // Get all modifications for this service, sorted by most recent first
        const modifications = await db
            .collection("serviceModifications")
            .find({serviceId: new ObjectId(serviceId)})
            .sort({timestamp: -1})
            .toArray();

        res.json({modifications});
    } catch (error) {
        console.error('Error fetching service modifications:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};
