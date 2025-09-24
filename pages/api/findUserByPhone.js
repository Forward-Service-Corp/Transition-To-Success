import {connectToDatabase} from "../../lib/dbConnect";
import { generatePhoneSearchPatterns } from "../../lib/phoneUtils";

// eslint-disable-next-line import/no-anonymous-default-export
export default async(req, res) => {
    const {db} = await connectToDatabase();

    const phoneNumber = req.query.phone;

    // Generate all possible phone formats to search for (fuzzy search)
    const searchPatterns = generatePhoneSearchPatterns(phoneNumber);
    const searchQueries = searchPatterns.map(pattern => ({ phone: pattern }));

    // Search for user with any of the phone number formats
    const user = await db
        .collection("users")
        .findOne({ $or: searchQueries });

    res.json(user);
}
