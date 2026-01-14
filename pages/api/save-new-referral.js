import {connectToDatabase} from "../../lib/dbConnect";
import {ObjectId} from "mongodb";
import {getServerSession} from "next-auth/next";
import {authOptions} from "./auth/[...nextauth]";
import {canUserManageServices} from "../../lib/servicePermissions";

// eslint-disable-next-line import/no-anonymous-default-export
export default async(req, res) => {
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

        const record = {
            name: req.body.name,
            city: req.body.city,
            state: req.body.state,
            street: req.body.street,
            zip: req.body.zip,
            county: req.body.county,
            service: req.body.service,
            url: req.body.url,
            requirements: req.body.requirements,
            contactName: req.body.contactName,
            hours: req.body.hours,
            phone: req.body.phone,
            contactEmail: req.body.contactEmail,
            contactPhone: req.body.contactPhone,
            needs: req.body.needs,
            createdDate: new Date()
        }

        const result = await db
            .collection("services")
            .insertOne(record)

        // Log the creation
        await db.collection("serviceModifications").insertOne({
            serviceId: result.insertedId,
            serviceName: record.name,
            modifiedBy: {
                userId: user._id,
                email: user.email,
                name: user.name
            },
            action: 'created',
            changes: [],
            summary: `Service "${record.name}" created`,
            timestamp: new Date()
        });

        res.json({
            success: true,
            insertedId: result.insertedId,
            ...result
        })
    } catch (error) {
        console.error('Error saving new service:', error);
        res.status(500).json({error: 'Internal server error'});
    }
}
