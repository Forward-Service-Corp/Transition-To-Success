import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../lib/dbConnect";
import { ObjectId } from "mongodb";
import { ReferralDocument, type ReferralResponse } from "../../types/referral";
import type { NewReferralResponse } from "../../types/apiresponses";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (
  req: NextApiRequest,
  res: NextApiResponse<NewReferralResponse>,
) => {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: "Method not allowed", success: false });
  }

  const date = new Date();

  const record = {
    ...req.body,
    userId: new ObjectId(req.body.userId),
    createdDate: date,
  };

  try {
    const { db } = await connectToDatabase();
    const result = await db.collection("referrals").insertOne(record);

    const referral = await db
      .collection<ReferralDocument>("referrals")
      .findOne({ _id: result.insertedId });

    if (!referral)
      return res.status(500).json({
        success: false,
        error: "Error saving referral. Refresh the page and try again",
      });

    const newResponse = {
      ...referral,
      _id: referral._id.toString(),
    };

    return res.json({ success: true, referral: newResponse });
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      return res.status(500).json({
        success: false,
        error: "Error saving referral. " + error.message,
      });
    }
  }
};
