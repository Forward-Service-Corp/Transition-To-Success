import {connectToDatabase} from "../../lib/dbConnect";
import {getServerSession} from "next-auth/next";
import {authOptions} from "./auth/[...nextauth]";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({error: 'Method not allowed'});
    }

    try {
        const session = await getServerSession(req, res, authOptions);
        
        if (!session || !session.user) {
            return res.status(401).json({error: 'No valid session found'});
        }

        const {db} = await connectToDatabase();
        
        // For database sessions, we need to delete the session from the sessions collection
        // The MongoDB adapter stores sessions with userId field
        const result = await db.collection("sessions").deleteMany({
            userId: session.user._id
        });

        res.status(200).json({
            success: true, 
            message: 'Session invalidated',
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error('Error invalidating session:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};
