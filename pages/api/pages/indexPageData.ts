import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/dbConnect";
import { ObjectId } from "mongodb";
import type { ApiErrorResponse } from "../../../types/apiresponses";
import type { IndexDataResponse } from "../../../types";
import { UserDocument, type UserResponse } from "../../../types/user";
import { DreamDocument, type DreamResponse } from "../../../types/dream";
import type { SurveyDocument, SurveyResponse } from "../../../types/survey";
import type {
  ReferralDocument,
  ReferralResponse,
} from "../../../types/referral";
import type { TaskDocument, TaskResponse } from "../../../types/task";
import type { NoteDocument, NoteResponse } from "../../../types/note";

// This file loads in the information for the logged-in user, and is used in various places throughout the site

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IndexDataResponse | ApiErrorResponse>,
) {
  try {
    // Validate required parameters

    const { userId, clientId, surveyId } = req.query;
    if (!userId) {
      console.error("indexPageData: Missing userId parameter");
      return res.status(400).json({ error: "Missing userId parameter" });
    }

    if (clientId && typeof clientId !== "string") {
      return res.status(400).json({ error: "clientId must be a string" });
    }
    if (surveyId && typeof surveyId !== "string") {
      return res.status(400).json({ error: "surveyId must be a string" });
    }
    if (userId && typeof userId !== "string") {
      return res.status(400).json({ error: "userId must be a string" });
    }

    if (!ObjectId.isValid(userId)) {
      console.error("indexPageData: Invalid userId format:", userId);
      return res.status(400).json({ error: "Invalid userId format" });
    }
    if (clientId && !ObjectId.isValid(clientId)) {
      console.error("indexPageData: Invalid clientId format:", clientId);
      return res.status(400).json({ error: "Invalid userId format" });
    }
    if (surveyId && !ObjectId.isValid(surveyId)) {
      console.error("indexPageData: Invalid surveyId format:", surveyId);
      return res.status(400).json({ error: "Invalid userId format" });
    }

    // connects to Mongo DB to be able to do queries
    const { db } = await connectToDatabase();
    const userDB = db.collection<UserDocument>("users");
    const dreamDB = db.collection<DreamDocument>("dreams");
    const surveyDB = db.collection<SurveyDocument>("lifeAreaSurveys");
    const referralDB = db.collection<ReferralDocument>("referrals");
    const customRefDB = db.collection<ReferralDocument>("customReferrals");
    const taskDB = db.collection<TaskDocument>("todos");
    const notesDB = db.collection<NoteDocument>("notes");

    //stores the user object from the database in user
    const userDoc = await userDB.findOne({ _id: new ObjectId(userId) });

    if (!userDoc) {
      console.error("indexPageData: User not found:", userId);
      return res.status(404).json({ error: "User not found" });
    }
    const user: UserResponse = { ...userDoc, _id: userDoc._id.toString() };

    //stores the userID of the user in query, to make searching the database easier
    const query = { userId: new ObjectId(userId) };

    //Find all dreams in the collection "dreams" in the database that have the userid of our user on it.
    const dreamsCursor = dreamDB.find(query);
    const dreamDocs = await dreamsCursor.toArray();
    const dreams: DreamResponse[] = dreamDocs.map((doc) => ({
      ...doc,
      _id: doc._id.toString(),
    }));

    await dreamsCursor.close();

    //Find all surveys in the collection "lifeAreaSurveys" in the database that have the userid of our user on it.
    const surveysCursor = surveyDB.find(query);
    const surveyDocs = await surveysCursor.toArray();
    const surveys: SurveyResponse[] = surveyDocs.map((doc) => ({
      ...doc,
      _id: doc._id.toString(),
    }));

    await surveysCursor.close();

    //Find all referrals in the collection "referrals" in the database that have the userid of our user on it.
    const referralsCursor = referralDB.find(query).sort("domain");
    const refs = await referralsCursor.toArray();
    await referralsCursor.close();

    //Find all referrals in the collection "customReferrals" in the database that have the user_id of our user on it.
    const customCursor = customRefDB.find(query).sort("domain");
    const customRefs = await customCursor.toArray();
    await customCursor.close();

    //Combine the results of referrals and customReferrals into one array
    const referralDocs = refs.concat(customRefs);
    const referrals: ReferralResponse[] = referralDocs.map((doc) => ({
      ...doc,
      _id: doc._id.toString(),
    }));

    //Find all tasks in the collection "todos" in the database that have the user_id of our user on it.
    const tasksCursor = taskDB.find(query);
    const taskDocs = await tasksCursor.toArray();
    const tasks: TaskResponse[] = taskDocs.map((doc) => ({
      ...doc,
      _id: doc._id.toString(),
    }));

    await tasksCursor.close();

    //Find all notes in the collection "notes" in the database that have the user_id of our user on it.
    const notesCursor = notesDB.find(query);
    const noteDocs = await notesCursor.toArray();
    const notes: NoteResponse[] = noteDocs.map((doc) => ({
      ...doc,
      _id: doc._id.toString(),
    }));

    await notesCursor.close();

    let q;
    if (surveyId === undefined) {
      q = {
        userId: new ObjectId(clientId),
      };
    } else {
      q = {
        userId: new ObjectId(clientId),
        surveyId: surveyId,
      };
    }

    let clientDoc: UserDocument | null = null;
    if (clientId) {
      clientDoc = await userDB.findOne({ _id: new ObjectId(clientId) });
    }
    if (!clientDoc && clientId) {
      return res
        .status(404)
        .json({ error: "ClientId was provided, but the client was not found" });
    }
    const client: UserResponse | null =
      clientId && clientDoc
        ? { ...clientDoc, _id: clientDoc._id.toString() }
        : null;

    //Find all referrals in the collection "referrals" in the database that have the user_id of our client on it.
    const clientReferralsCursor = referralDB.find(q);
    const clientRefs = await clientReferralsCursor.toArray();
    await clientReferralsCursor.close();
    //console.log(client)

    //Find all referrals in the collection "customReferrals" in the database that have the user_id of our client on it.
    const customClientCursor = customRefDB.find(q);
    const customClientRefs = await customClientCursor.toArray();
    await customClientCursor.close();

    //Combine the results of clientReferrals and clientCustomReferrals into one array
    const clientReferralDocs = clientRefs.concat(customClientRefs);
    const clientReferrals = clientReferralDocs.map((doc) => ({
      ...doc,
      _id: doc._id.toString(),
    }));

    //console.log(clientReferrals)

    //return all of the data we retrieved in a JSON
    res.json({
      user,
      dreams,
      surveys,
      referrals,
      tasks,
      notes,
      clientReferrals,
      client,
    });
  } catch (error) {
    console.error("indexPageData: Error:", error);
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ error: "Internal server error", message: error.message });
    }
    return res.status(500).json({ error: "Internal server errror" });
  }
}
