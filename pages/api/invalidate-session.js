import {connectToDatabase} from "../../lib/dbConnect";
import {getToken} from "next-auth/jwt";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({error: 'Method not allowed'});
    }

    try {
        const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET});
        
        if (!token || !token.sub) {
            return res.status(401).json({error: 'No valid token found'});
        }

        const {db} = await connectToDatabase();
        
        // Create indexes for better performance (only runs once)
        await db.collection("blacklisted_tokens").createIndex(
            { "tokenId": 1 }, 
            { background: true }
        );
        await db.collection("blacklisted_tokens").createIndex(
            { "expiresAt": 1 }, 
            { background: true, expireAfterSeconds: 0 }
        );
        
        // Add token to blacklist collection
        await db.collection("blacklisted_tokens").insertOne({
            tokenId: token.sub,
            userId: token.user?.id || token.email,
            blacklistedAt: new Date(),
            // Add expiration to clean up old blacklisted tokens
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
        });

        res.status(200).json({success: true, message: 'Session invalidated'});
    } catch (error) {
        console.error('Error invalidating session:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};
