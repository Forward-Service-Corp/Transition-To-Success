import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/dbConnect";
import { ObjectId } from "mongodb";
import {
  SingleServiceDocument,
  type SingleServiceResponse,
} from "../../../types/service";
import type { ApiErrorResponse } from "../../../types/apiresponses";
import { UserDocument, type UserResponse } from "../../../types/user";
import { blankLocation } from "../../../lib/serverSideHelpers";

export type DirectoryResponse = {
  user: UserResponse | null;
  directory: SingleServiceResponse[];
};

const directoryPage = async (
  req: NextApiRequest,
  res: NextApiResponse<DirectoryResponse | ApiErrorResponse>,
) => {
  try {
    const { db, carenetwork } = await connectToDatabase();
    const userDB = db.collection<UserDocument>("users");
    const careDB = carenetwork.collection<SingleServiceDocument>("services");

    // userId is optional for directory page (can be accessed without login)
    let user = null;

    const { userId } = req.query;
    if (userId) {
      if (typeof userId !== "string") {
        return res.status(400).json({
          error: "userId must be a string",
        });
      }
      if (req.query.userId) {
        if (!ObjectId.isValid(userId)) {
          console.error(
            "directoryPageData: Invalid userId format:",
            req.query.userId,
          );
          return res.status(400).json({ error: "Invalid userId format" });
        }

        const query = { _id: new ObjectId(userId) };
        const userDoc = await userDB.findOne(query);
        if (userDoc) {
          user = { ...userDoc, _id: userDoc._id.toString() };
        }
      }
    }

    const directoryCursor = careDB.find().limit(100).sort({ name: 1 });
    const directoryDocs = await directoryCursor.toArray();
    await directoryCursor.close();
    const directory = directoryDocs.map((doc) => {
      const primary_location =
        doc.locations.find((loc) => loc.primary_location == true) ||
        blankLocation();
      return {
        ...doc,
        _id: doc._id.toString(),
        primary_location,
      };
    });

    res.json({ user, directory });
  } catch (error) {
    console.error("directoryPageData: Error:", error);
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ error: "Internal server error", message: error.message });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default directoryPage;
