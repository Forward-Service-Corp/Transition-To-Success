import {connectToDatabase} from "../../lib/dbConnect";
import {ObjectId} from "mongodb";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
    const {db} = await connectToDatabase()
    const roleEntry = {
        role: req.query.role,
        date: new Date()
    };

    // Auto-set canManageServices for admins
    const updateFields = {
        level: req.query.role
    };

    // If role is admin, automatically enable service management
    if (req.query.role === 'admin') {
        updateFields.canManageServices = true;
    } else if (req.query.role !== 'coach') {
        // If changing from admin/coach to another role, disable service management
        updateFields.canManageServices = false;
    }
    // If changing to coach, keep existing canManageServices value (don't auto-disable)

    const record = await db
        .collection("users")
        .updateOne(
            { _id: ObjectId(req.query.userId) },
            {
                $set: updateFields,
                $push: {
                    roles: roleEntry
                }
            }
        )
    const result = await db
        .collection("users")
        .findOne({ _id: ObjectId(req.query.userId)})
    res.json(result)
}
