import {connectToDatabase} from "../../lib/dbConnect";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({error: 'Method not allowed'});
    }

    try {
        const {db} = await connectToDatabase();
        
        // Remove expired blacklisted tokens
        const result = await db.collection("blacklisted_tokens").deleteMany({
            expiresAt: { $lt: new Date() }
        });

        res.status(200).json({
            success: true, 
            message: `Cleaned up ${result.deletedCount} expired tokens`
        });
    } catch (error) {
        console.error('Error cleaning up blacklisted tokens:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};
