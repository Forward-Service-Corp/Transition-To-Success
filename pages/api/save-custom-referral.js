import { connectToDatabase } from "../../lib/dbConnect";
import { ObjectId } from "mongodb";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*"); // Or your specific origin
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
    return res.status(200).end();
  }

  if (req.method === "POST") {
    const today = new Date();
    const record = {
      surveyId: req.body.surveyId,
      userId: ObjectId(req.body.userId),
      dream: req.body.dream,
      domain: req.body.domain,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      hours: req.body.hours,
      requirements: req.body.requirements,
      url: req.body.url,
      contact: req.body.contact,
      needs: req.body.needs,
      isCustom: true,
      createdDate: date,
    };

    const { db } = await connectToDatabase();
    const user = await db.collection("customReferrals").insertOne(record);

    res.json(user);
  }

  return res.status(405).json({ error: "Method not allowed" });
};
