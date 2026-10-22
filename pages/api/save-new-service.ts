import { connectToDatabase } from "../../lib/dbConnect";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { canUserManageServices } from "../../lib/servicePermissions";
import {
  SingleServiceDocument,
  type SingleServiceResponse,
} from "../../types/service";
import type { ApiErrorResponse } from "../../types/apiresponses";
import type { NextApiRequest, NextApiResponse } from "next";

type NewServiceResponse =
  | {
      success: boolean;
      service: SingleServiceResponse;
    }
  | ApiErrorResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<NewServiceResponse>,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { db, carenetwork } = await connectToDatabase();

    // Get full user object to check permissions
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(session.user._id) });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Check permissions
    if (!canUserManageServices(user)) {
      return res
        .status(403)
        .json({ error: "You do not have permission to manage services" });
    }

    const record = { ...req.body, createdAt: new Date() };
    if (!record.name) {
      return { error: "New Records Must include a name" };
    }

    const result = await carenetwork.collection("services").insertOne(record);

    console.log("Before serviceModifications");
    // Log the creation
    await carenetwork.collection("serviceModifications").insertOne({
      serviceId: result.insertedId,
      serviceName: record.name,
      modifiedBy: {
        userId: user._id,
        email: user.email,
        name: user.name,
      },
      action: "created",
      changes: [],
      summary: `Service "${record.name}" created`,
      timestamp: new Date(),
    });
    console.log("After Service Modifications");

    //fetch updated service
    const newService = await carenetwork
      .collection<SingleServiceDocument>("services")
      .findOne({ _id: result.insertedId });
    if (!newService) return { error: "Error fetching updated service" };

    const newResponse = {
      ...newService,
      _id: newService?._id.toString(),
    };

    res.json({ success: true, service: newResponse });
  } catch (error) {
    console.error("Error saving new service:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
