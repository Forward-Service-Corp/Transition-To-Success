import {connectToDatabase} from "../../lib/dbConnect";

// eslint-disable-next-line import/no-anonymous-default-export
export default async(req, res) => {
    let q
    if(Array.isArray(req.body.county) && Array.isArray(req.body.domain)){
        q = {
            name: {$exists: true},
            county: {
                $in: req.body.county
            },
            service:  {
                $in: req.body.domain
            }
        }
    }else if(!Array.isArray(req.body.county) && Array.isArray(req.body.domain)){
        q = {
            name: {$exists: true},
            county:  req.body.county,
            service:  {
                $in: req.body.domain
            }
        }
    }else if(Array.isArray(req.body.county) && !Array.isArray(req.body.domain)){
        q = {
            name: {$exists: true},
            county: {
                $in: req.body.county
            },
            service: req.body.domain
        }
    }else{
        q = {
            name: {$exists: true},
            county: req.body.county,
            service: req.body.domain
        }
    }


    const {db} = await connectToDatabase()
    const cursor = await db.collection("services").find(q)
    const records = await cursor.toArray()
    await cursor.close()

    res.json({referrals: records, counties: req.body.county, domain: req.body.domain})

}
