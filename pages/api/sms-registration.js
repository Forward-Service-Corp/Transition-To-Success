import { connectToDatabase } from "../../lib/mongodb";

const handler = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).end();
    }

    const { email, name, homeCounty, county, programs, phoneNumber } = req.body;

    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    const userExists = await usersCollection.findOne({ email });

    if (userExists) {
        return res.status(400).json({ error: "User already exists" });
    }

    const newUser = {
        email,
        name,
        homeCounty,
        county,
        programs,
        phoneNumber,
        createdAt: new Date(),
    };

    await usersCollection.insertOne(newUser);

    res.status(201).json({ success: true });
};

export default handler;
