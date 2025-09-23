import {connectToDatabase} from "../../lib/dbConnect";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({error: 'Method not allowed'});
    }

    try {
        const {db} = await connectToDatabase();
        
        // Clean up expired sessions (NextAuth database sessions have an expires field)
        const result = await db.collection("sessions").deleteMany({
            expires: { $lt: new Date() }
        });

        res.status(200).json({
            success: true, 
            message: `Cleaned up ${result.deletedCount} expired sessions`
        });
    } catch (error) {
        console.error('Error cleaning up expired sessions:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};
