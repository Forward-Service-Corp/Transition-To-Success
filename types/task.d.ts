import type { ObjectId } from "mongodb";

export type TaskDocument = {
  _id: ObjectId;
  referralId: ObjectId | string;
  userId: ObjectId | string;
  task: string;
  timestamp: string | Date;
  surveyId: string | ObjectId;
  completed: "true" | "false" | boolean;
  modifiedBy: string;
};

export type TaskResponse = Omit<TaskDocument, "_id"> & {
  _id: string;
};
