import { connectToDatabase } from "../../lib/dbConnect";
import { ObjectId } from "mongodb";
import type {
  ServiceModificationDocument,
  ServiceModificationType,
} from "../../types/serviceModification";
import type { NextApiRequest, NextApiResponse } from "next";
import { asString } from "../../utils/AsArray";

type getServiceModificationsResponse = {
  modifications?: ServiceModificationType[];
  error?: string;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default async (
  req: NextApiRequest,
  res: NextApiResponse<getServiceModificationsResponse>,
) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { serviceId } = req.query;

    if (!serviceId) {
      return res.status(400).json({ error: "serviceId is required" });
    }

    if (!ObjectId.isValid(asString(serviceId))) {
      return res.status(400).json({ error: "Invalid serviceId format" });
    }

    const { carenetwork } = await connectToDatabase();
    const servMods = carenetwork.collection<ServiceModificationDocument>(
      "serviceModifications",
    );

    // Get all modifications for this service, sorted by most recent first
    const modifications = await servMods
      .find({ serviceId: new ObjectId(asString(serviceId)) })
      .sort({ timestamp: -1 })
      .toArray();

    if (modifications) {
      const modificationResponse = modifications.map((m) => ({
        ...m,
        _id: m._id.toString(),
        serviceId: m.serviceId.toString(),
        modifiedBy: { ...m.modifiedBy, userId: m.modifiedBy.userId.toString() },
      }));
      res.json({ modifications: modificationResponse });
    }
  } catch (error) {
    console.error("Error fetching service modifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
