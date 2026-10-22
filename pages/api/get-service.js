import {connectToDatabase} from "../../lib/dbConnect";

// eslint-disable-next-line import/no-anonymous-default-export
export default async(req, res) => {
    let q
    if(Array.isArray(req.query.county) && Array.isArray(req.query.domain)){
        q = {
            name: {$exists: true},
            county: {
                $in: req.query.county
            },
            service:  {
                $in: req.query.domain
            }
        }
    }else if(!Array.isArray(req.query.county) && Array.isArray(req.query.domain)){
        q = {
            name: {$exists: true},
            county:  req.query.county,
            service:  {
                $in: req.query.domain
            }
        }
    }else if(Array.isArray(req.query.county) && !Array.isArray(req.query.domain)){
        q = {
            name: {$exists: true},
            county: {
                $in: req.query.county
            },
            service: req.query.domain
        }
    }else{
        q = {
            name: {$exists: true},
            county: req.query.county,
            service: req.query.domain
        }
    }

    const {db} = await connectToDatabase()
    const cursor = await db.collection("services").find(q)
    const records = await cursor.toArray()
    await cursor.close()

    res.json({referrals: records, counties: req.query.county, domain: req.query.domain})

}
