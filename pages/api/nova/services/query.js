import { connectToDatabase } from "../../lib/dbConnect";

// /api/services/search?q=food&county=Milwaukee
export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { q = "", county = "" } = req.query;

    try {
        const { db } = await connectToDatabase();

        const cursor = db.collection("services").find({
            service: { $regex: q, $options: "i" },
            county: { $regex: county, $options: "i" },
        });

        const records = await cursor.toArray();
        res.status(200).json(records);
    } catch (error) {
        console.error("❌ Service search error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}