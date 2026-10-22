import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../lib/dbConnect";
import {
  type SingleServiceDocument,
  type SingleServiceResponse,
} from "../../types/service";
import { asArray } from "../../utils/AsArray";
import { labelMap } from "../../lib/serviceLabelsMap";

export type getReferralOptionsResponse = {
  referrals: SingleServiceResponse[];
  domains: string | string[];
  ok: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<getReferralOptionsResponse>,
) {
  // console.log("Made it to the API Route");
  const counties = asArray(req.query.county);
  const domains = asArray(req.query.domain);
  const mappedDomains = domains.map((d) => labelMap[d] ?? d);
  // console.log(mappedDomains);

  const q = {
    name: { $exists: true },
    counties: {
      $in: counties,
    },
    domains: {
      $in: mappedDomains,
    },
  };

  const { carenetwork } = await connectToDatabase();
  const cursor = await carenetwork
    .collection<SingleServiceDocument>("services")
    .find(q);
  const records = await cursor.toArray();
  // console.log(records);

  const flatRecords = records.map((rec) => ({
    ...rec,
    _id: rec._id.toString(),
  }));

  await cursor.close();

  res.json({ ok: true, referrals: flatRecords, domains: domains });
}
