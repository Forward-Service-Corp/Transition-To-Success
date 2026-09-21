import type { ObjectId } from "mongodb";

export type ReferralDocument = {
  _id: ObjectId;
  surveyId: string | ObjectId;
  userId: string | ObjectId;
  dream: string;
  domain: string;
  name: string;
  email?: string | null;
  contactEmail?: string | null;
  phone?: string | null;
  contactPhone?: string | null;
  hours?: string | null;
  requirements?: string | null;
  url?: string | null;
  contact?: string | null;
  needs?: string | null;
  archived: "true" | "false" | boolean | null;
  createdDate?: string | Date | null;
  updatedDate?: string | Date | null;
  isCustom?: boolean;
  priority?: string;
};

export type ReferralResponse = Omit<ReferralDocument, "_id"> & {
  _id: string;
};
