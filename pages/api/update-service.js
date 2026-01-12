import {connectToDatabase} from "../../lib/dbConnect";
import {ObjectId} from "mongodb";
import {getServerSession} from "next-auth/next";
import {authOptions} from "./auth/[...nextauth]";
import {canUserManageServices} from "../../lib/servicePermissions";

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
        
        // Get full user object to check permissions
        const user = await db.collection("users").findOne({_id: new ObjectId(session.user._id)});
        
        if (!user) {
            return res.status(401).json({error: 'User not found'});
        }

        // Check permissions
        if (!canUserManageServices(user)) {
            return res.status(403).json({error: 'You do not have permission to manage services'});
        }

        const {serviceId, ...updateData} = req.body;

        if (!serviceId) {
            return res.status(400).json({error: 'serviceId is required'});
        }

        if (!ObjectId.isValid(serviceId)) {
            return res.status(400).json({error: 'Invalid serviceId format'});
        }

        // Check if service exists
        const existingService = await db.collection("services").findOne({_id: new ObjectId(serviceId)});
        
        if (!existingService) {
            return res.status(404).json({error: 'Service not found'});
        }

        // Prepare update object (only include fields that are provided)
        const updateFields = {
            lastModified: new Date()
        };

        // Add provided fields to update
        const allowedFields = ['name', 'city', 'state', 'street', 'zip', 'county', 'service', 'url', 
                              'requirements', 'contactName', 'hours', 'phone', 'contactEmail', 
                              'contactPhone', 'needs'];
        
        allowedFields.forEach(field => {
            if (updateData[field] !== undefined) {
                updateFields[field] = updateData[field];
            }
        });

        // Update the service
        const result = await db.collection("services").updateOne(
            {_id: new ObjectId(serviceId)},
            {
                $set: updateFields
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({error: 'Service not found'});
        }

        // Fetch updated service
        const updatedService = await db.collection("services").findOne({_id: new ObjectId(serviceId)});

        res.json({
            success: true,
            service: updatedService
        });
    } catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};
