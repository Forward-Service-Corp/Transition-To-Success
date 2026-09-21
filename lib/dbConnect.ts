import {MongoClient, type Db} from "mongodb";

const uri = process.env.MONGODB_URI || ""
const dbName = process.env.MONGODB_DB || ""
const care_db = process.env.CARE_DB || ""
if (!uri) {
    throw new Error(
        "Please define URI"
    )
}
if (!dbName) {
    throw new Error(
        "Please define db name"
    )
}
if (!care_db) {
    throw new Error(
        "Please define db name"
    )
}

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null
let cachedCARE: Db | null = null


export async function connectToDatabase() {
    if (cachedClient && cachedDb && cachedCARE) {
        return {client: cachedClient, db: cachedDb, carenetwork: cachedCARE}
    }
    const client = await MongoClient.connect(uri, {
        maxIdleTimeMS: 0,
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 0
    })

    const db = client.db(dbName)
    const carenetwork = client.db(care_db)

    cachedClient = client
    cachedDb = db
    cachedCARE = carenetwork

    return {client, db, carenetwork}
}