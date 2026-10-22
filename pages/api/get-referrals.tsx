import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../lib/dbConnect";
import { ObjectId } from "mongodb";
import type { ApiErrorResponse } from "../../types/apiresponses";
import { ReferralDocument, type ReferralResponse } from "../../types/referral";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (
  req: NextApiRequest,
  res: NextApiResponse<ReferralResponse[] | ApiErrorResponse>,
) => {
  try {
    // Validate required parameters
    if (!req.query.userId) {
      console.error("get-referrals: Missing userId parameter");
      return res.status(400).json({ error: "Missing userId parameter" });
    }

    const { userId, surveyId } = req.query;

    if (typeof userId !== "string") {
      return res.status(400).json({
        error: "userId must be a string",
      });
    }
    if (surveyId && typeof surveyId !== "string") {
      return res.status(400).json({
        error: "surveyId must be a string",
      });
    }

    if (!ObjectId.isValid(userId)) {
      console.error("get-referrals: Invalid userId format:", req.query.userId);
      return res.status(400).json({ error: "Invalid userId format" });
    }

    let q;
    if (surveyId === undefined) {
      q = {
        userId: new ObjectId(userId),
      };
    } else {
      q = {
        userId: new ObjectId(userId),
        surveyId: surveyId,
      };
    }

    const { db } = await connectToDatabase();
    const referrals = db.collection<ReferralDocument>("referrals");
    const custom = db.collection<ReferralDocument>("customReferrals");

    const cursor = referrals.find(q);
    const records = await cursor.toArray();
    await cursor.close();

    const customCursor = custom.find(q);
    const customRecords = await customCursor.toArray();
    await customCursor.close();

    const allRecords = records.concat(customRecords);

    res.json(allRecords.map((rec) => ({ ...rec, _id: rec._id.toString() })));
  } catch (error: unknown) {
    console.error("get-referrals: Error:", error);
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ error: "Internal server error", message: error.message });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};
