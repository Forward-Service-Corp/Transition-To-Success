import {connectToDatabase} from "../../lib/dbConnect";
import {ObjectId} from "mongodb";
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
            return res.status(401).json({error: 'Unauthorized'});
        }

        const {db} = await connectToDatabase();
        
        // Check if requester is admin
        const requester = await db.collection("users").findOne({_id: new ObjectId(session.user._id)});
        if (!requester || requester.level !== 'admin') {
            return res.status(403).json({error: 'Only admins can toggle service management permissions'});
        }

        const {userId, enabled} = req.body;

        if (!userId) {
            return res.status(400).json({error: 'userId is required'});
        }

        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({error: 'Invalid userId format'});
        }

        // Get the user being toggled
        const targetUser = await db.collection("users").findOne({_id: new ObjectId(userId)});
        
        if (!targetUser) {
            return res.status(404).json({error: 'User not found'});
        }

        // Only allow toggling for coaches and admins
        if (targetUser.level !== 'coach' && targetUser.level !== 'admin') {
            return res.status(400).json({error: 'Service management can only be enabled for coaches and admins'});
        }

        // Update the user's canManageServices field
        const result = await db.collection("users").updateOne(
            {_id: new ObjectId(userId)},
            {
                $set: {
                    canManageServices: enabled === true || enabled === 'true'
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({error: 'User not found'});
        }

        // Fetch updated user
        const updatedUser = await db.collection("users").findOne({_id: new ObjectId(userId)});

        res.json({
            success: true,
            user: updatedUser
        });
    } catch (error) {
        console.error('Error toggling service management:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};
