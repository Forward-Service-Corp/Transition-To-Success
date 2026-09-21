import type { ObjectId } from "mongodb";
import type { SurveyDocument, SurveyResponse } from "./survey";

export type DreamDocument = {
  _id: ObjectId;
  dream: string;
  dreamNeed: string;
  dreamHelp: string;
  userId: string | ObjectId;
  status: string;
  timestamp: string | Date;
  survey: SurveyDocument | SurveyResponse;
};

export type DreamResponse = Omit<DreamDocument, "_id"> & {
  _id: string;
};
