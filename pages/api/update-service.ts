import { connectToDatabase } from "../../lib/dbConnect";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { canUserManageServices } from "../../lib/servicePermissions";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  SingleServiceDocument,
  type LocationType,
  type SingleServiceResponse,
} from "../../types/service";
import type { ApiErrorResponse } from "../../types/apiresponses";
import {
  hasAllSameLocations,
  stringArrayEquals,
} from "../../lib/serverSideHelpers";

type UpdateServiceResponse =
  | {
      success: boolean;
      service: SingleServiceResponse;
    }
  | ApiErrorResponse;

type FieldsType = keyof SingleServiceResponse;

type ServiceChangeType = {
  field: FieldsType;
  oldValue: string | Date | boolean | LocationType[] | string[];
  newValue: string | Date | boolean | LocationType[] | string[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UpdateServiceResponse>,
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

    const { serviceId, ...updateData } = req.body;

    if (!serviceId) {
      return res.status(400).json({ error: "serviceId is required" });
    }

    if (!ObjectId.isValid(serviceId)) {
      return res.status(400).json({ error: "Invalid serviceId format" });
    }

    // Check if service exists
    const existingService = await carenetwork
      .collection("services")
      .findOne({ _id: new ObjectId(serviceId) });

    if (!existingService) {
      return res.status(404).json({ error: "Service not found" });
    }

    // Track what changed for audit log
    const changes: ServiceChangeType[] = [];
    const textFields: FieldsType[] = ["description", "name", "need_to_bring"];

    if (updateData.need_to_bring) {
      console.log("updating need_to_bring: ", updateData.need_to_bring);
    }

    textFields.forEach((field) => {
      if (
        updateData[field] !== undefined &&
        updateData[field] !== existingService[field]
      ) {
        changes.push({
          field,
          oldValue: existingService[field] || "",
          newValue: updateData[field] || "",
        });
      }
    });

    if (
      !hasAllSameLocations(
        updateData["locations"],
        existingService["locations"],
      )
    ) {
      changes.push({
        field: "locations",
        oldValue: existingService.locations || [],
        newValue: updateData.locations || [],
      });
    }

    if (!stringArrayEquals(updateData.domains, existingService.domains)) {
      changes.push({
        field: "domains",
        oldValue: existingService.domains || [],
        newValue: updateData.domains || [],
      });
    }
    if (!stringArrayEquals(updateData.counties, existingService.counties)) {
      changes.push({
        field: "counties",
        oldValue: existingService.counties || [],
        newValue: updateData.counties || [],
      });
    }

    // Prepare update object (only include fields that are provided)
    const updateFields: Partial<SingleServiceDocument> = {
      lastModified: new Date().toISOString(),
    };

    // Add provided fields to update
    changes.forEach((change) => {
      if (updateData[change.field] !== undefined) {
        updateFields[change.field] = updateData[change.field];
      }
    });

    // Update the service
    const result = await carenetwork
      .collection<SingleServiceDocument>("services")
      .findOneAndUpdate(
        { _id: new ObjectId(serviceId) },
        {
          $set: updateFields,
        },
      );

    if (!result) {
      return res.status(404).json({ error: "Service not found" });
    }

    // Log the modification if there were changes
    if (changes.length > 0) {
      const modificationSummary = changes
        .map(
          (change) =>
            `${change.field}: "${change.oldValue}" → "${change.newValue}"`,
        )
        .join(", ");

      await carenetwork.collection("serviceModifications").insertOne({
        serviceId: new ObjectId(serviceId),
        serviceName: existingService.name,
        modifiedBy: {
          userId: user._id,
          email: user.email,
          name: user.name,
        },
        action: "updated",
        changes: changes,
        summary: modificationSummary,
        timestamp: new Date(),
      });
    }

    // Fetch updated service
    const updatedService = await carenetwork
      .collection<SingleServiceDocument>("services")
      .findOne({ _id: new ObjectId(serviceId) });

    if (!updatedService) {
      return res
        .status(400)
        .json({ error: "Service updated, but retrieval failed." });
    }

    const updatedResponse = {
      ...updatedService,
      _id: updatedService._id.toString(),
    };

    res.json({
      success: true,
      service: updatedResponse,
    });
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
