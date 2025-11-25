import {connectToDatabase} from "../../lib/dbConnect";
import {ObjectId} from "mongodb";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
    const survey = {
        dream: req.body.dream,
        dreamId: req.body.dreamId,
        county: req.body.county,
        coach: req.body.coach,
        priority: req.body.priority,
        food: req.body.food,
        housing: req.body.housing,
        safety: req.body.safety,
        friends: req.body.friends,
        myFamily: req.body.myFamily,
        school: req.body.school,
        work: req.body.work,
        money: req.body.money,
        transportation: req.body.transportation,
        familyCare: req.body.familyCare,
        mentalHealth: req.body.mentalHealth,
        substances: req.body.substances,
        disabilities: req.body.disabilities,
        lifeSkills: req.body.lifeSkills,
        healthCare: req.body.healthCare,
        manageMoney: req.body.manageMoney,
        legal: req.body.legal,
        internetAccess: req.body.internetAccess,
        education: req.body.education,
        parenting: req.body.parenting,
        childrensEducation: req.body.childrensEducation,
        userId: ObjectId(req.body.userId),
        datestamp: new Date(),
        surprise: req.body.surprise,
        concern: req.body.concern,
        family: req.body.family,
        health: req.body.health,
        income: req.body.income,
        isYouthSurvey: true
    }

    const surveyData = {
        dream: req.body.dream,
        dreamId: req.body.dreamId,
        county: req.body.county,
        coach: req.body.coach,
        priority: req.body.priority,
        food: req.body.food[0],
        housing: req.body.housing[0],
        safety: req.body.safety[0],
        friends: req.body.friends[0],
        myFamily: req.body.myFamily[0],
        school: req.body.school[0],
        work: req.body.work[0],
        money: req.body.money,
        transportation: req.body.transportation[0],
        familyCare: req.body.familyCare[0],
        mentalHealth: req.body.mentalHealth[0],
        substances: req.body.substances[0],
        disabilities: req.body.disabilities[0],
        lifeSkills: req.body.lifeSkills[0],
        healthCare: req.body.healthCare[0]  ,
        manageMoney: req.body.manageMoney[0],
        legal: req.body.legal[0],
        internetAccess: req.body.internetAccess[0],
        education: req.body.education[0],
        parenting: req.body.parenting[0]    ,
        childrensEducation: req.body.childrensEducation[0],
        userId: ObjectId(req.body.userId),
        surprise: req.body.surprise,
        concern: req.body.concern,
        family: req.body.family,
        health: req.body.health,
        income: req.body.income,
        isYouthSurvey: true
    }

    const {db} = await connectToDatabase()
    const LAS = await db
        .collection("lifeAreaSurveys")
        .insertOne(survey)

    const surveyInsert = await db
        .collection("ttsReporting")
        .insertOne(surveyData)

    const dreamUpdate = await db
        .collection("dreams")
        .updateOne(
            {_id: ObjectId(req.body.dreamId)},
            {
                $set: {survey}
            }
        )

    res.json(LAS, surveyInsert, dreamUpdate)

}
