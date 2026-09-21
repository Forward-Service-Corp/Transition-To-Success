import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../lib/dbConnect";
import {
  SingleServiceDocument,
  type SingleServiceResponse,
} from "../../types/service";
import type { ApiErrorResponse } from "../../types/apiresponses";

type SearchResponse =
  | {
      records: SingleServiceResponse[];
      success: boolean;
    }
  | ApiErrorResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchResponse>,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { keyword, domains, counties } = req.body;

    const mongoQuery: {
      name?: { $regex: string; $options: "i" };
      domains?: { $in: string[] };
      counties?: { $in: string[] };
    } = {};

    if (keyword) {
      mongoQuery.name = { $regex: keyword, $options: "i" };
    }
    if (domains?.length > 0) {
      mongoQuery.domains = { $in: domains };
    }
    if (counties?.length > 0) {
      mongoQuery.counties = { $in: counties };
    }

    const { carenetwork } = await connectToDatabase();
    const cursor = await carenetwork
      .collection<SingleServiceDocument>("services")
      .find(mongoQuery)
      .limit(1000)
      .sort({ name: 1 });
    const records = await cursor.toArray();
    await cursor.close();

    const response: SingleServiceResponse[] = records.map((service) => ({
      ...service,
      _id: service._id.toString(),
      primary_location: service.locations.find(
        (loc) => loc.primary_location == true,
      ) || {
        address: {
          city: "",
          state: "",
          zip: "",
          street: "",
        },
        primary_location: true,
      },
    }));

    console.log(response);
    return res.json({
      records: response,
      success: true,
    });
  } catch (error) {
    console.error("Error updating service: ", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
}
