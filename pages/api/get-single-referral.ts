import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../lib/dbConnect";
import { ObjectId } from "mongodb";
import type { ApiErrorResponse } from "../../types/apiresponses";
import type {
  LocationType,
  SingleServiceDocument,
  SingleServiceResponse,
} from "../../types/service";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SingleServiceResponse | ApiErrorResponse>,
) {
  const { carenetwork } = await connectToDatabase();
  const services = carenetwork.collection<SingleServiceDocument>("services");

  const { referralId } = req.query;
  if (referralId) {
    if (typeof referralId !== "string") {
      return res.status(400).json({
        error: "referralId must be a string",
      });
    }
    if (referralId) {
      if (!ObjectId.isValid(referralId)) {
        return res.status(400).json({ error: "Invalid referralId format" });
      }

      const referral = await services.findOne({
        _id: new ObjectId(referralId),
      });

      if (!referral) {
        return res.status(404).json({ error: "Referral not found" });
      }

      const primary_location: LocationType = referral.locations.find(
        (loc) => loc.primary_location == true,
      ) || {
        address: { city: "", state: "", zip: "", street: "" },
        primary_location: true,
      };

      const response: SingleServiceResponse = {
        ...referral,
        _id: referral._id.toString(),
        primary_location: { ...primary_location },
      };

      return res.json(response);
    }
  }
  console.error("Didn't receive referralID");
  return res.status(400).json({ error: "No referralId provided" });
}
