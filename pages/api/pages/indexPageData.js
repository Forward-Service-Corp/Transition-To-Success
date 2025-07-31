import {connectToDatabase} from "../../../lib/dbConnect";
import {ObjectId} from "mongodb";

// This file loads in the information for the logged-in user, and is used in various places throughout the site

// eslint-disable-next-line import/no-anonymous-default-export
export default async(req, res) => {

    // connects to Mongo DB to be able to do queries
    const {db} = await connectToDatabase()

    //stores the userID of the user in query, to make searching the database easier
    const query = req.query.userID == 'guest' ? {name: 'Guest'} : {_id: ObjectId(req.query.userId)}

    //stores the user object from the database in user
    const user = await db.collection("users").findOne(query)
    
    
    //Find all dreams in the collection "dreams" in the database that have the userid of our user on it.
    const dreamsCursor = await db.collection("dreams").find(query)
    const dreams = await dreamsCursor.toArray()
    await dreamsCursor.close()

    //Find all surveys in the collection "lifeAreaSurveys" in the database that have the userid of our user on it.
    const surveysCursor = await db.collection("lifeAreaSurveys").find(query)
    const surveys = await surveysCursor.toArray()
    await surveysCursor.close()

    //Find all referrals in the collection "referrals" in the database that have the userid of our user on it.
    const referralsCursor = await db.collection("referrals").find(query).sort("domain")
    const refs = await referralsCursor.toArray()
    await referralsCursor.close()

    //Find all referrals in the collection "customReferrals" in the database that have the user_id of our user on it.
    const customCursor = await db.collection("customReferrals").find(query).sort("domain")
    const customRefs = await customCursor.toArray()
    await customCursor.close()

    //Combine the results of referrals and customReferrals into one array
    const referrals = await refs.concat(customRefs)

    //Find all tasks in the collection "todos" in the database that have the user_id of our user on it.
    const tasksCursor = await db.collection("todos").find(query)
    const tasks = await tasksCursor.toArray()
    await tasksCursor.close()

    //Find all notes in the collection "notes" in the database that have the user_id of our user on it.
    const notesCursor = await db.collection("notes").find(query)
    const notes = await notesCursor.toArray()
    await notesCursor.close()

    //Find all referrals in the collection "referrals" in the database that have the user_id of our client on it.
    const clientReferralsCursor = await db.collection("referrals").find({ userId: req.query.clientId })
    const clientRefs = await clientReferralsCursor.toArray()
    await clientReferralsCursor.close()

    //Find all referrals in the collection "customReferrals" in the database that have the user_id of our client on it.
    const customClientCursor = await db.collection("customReferrals").find({ userId: req.query.clientId })
    const customClientRefs = await customClientCursor.toArray()
    await customClientCursor.close()

    //Combine the results of clientReferrals and clientCustomReferrals into one array
    const clientReferrals = await clientRefs.concat(customClientRefs)   


    //return all of the data we retrieved in a JSON
    res.json({user, dreams, surveys, referrals, tasks, notes, clientReferrals})

}
