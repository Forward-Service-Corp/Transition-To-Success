import type { ObjectId } from "mongodb";

export type NoteDocument = {
  _id: ObjectId;
  referralId: string | ObjectId;
  taskId: string | ObjectId;
  userId: string | ObjectId;
  note: string;
  timestamp: string | Date;
  surveyId: string | ObjectId;
};

export type NoteResponse = Omit<NoteDocument, "_id"> & {
  _id: string;
};
