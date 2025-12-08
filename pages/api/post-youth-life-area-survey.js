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
        food: req.body.food[1],
        housing: req.body.housing[1],
        safety: req.body.safety[1],
        friends: req.body.friends[1],
        myFamily: req.body.myFamily[1],
        school: req.body.school[1],
        work: req.body.work[1],
        money: req.body.money,
        transportation: req.body.transportation[1],
        familyCare: req.body.familyCare[1],
        mentalHealth: req.body.mentalHealth[1],
        substances: req.body.substances[1],
        disabilities: req.body.disabilities[1],
        lifeSkills: req.body.lifeSkills[1],
        healthCare: req.body.healthCare[1]  ,
        manageMoney: req.body.manageMoney[1],
        legal: req.body.legal[1],
        internetAccess: req.body.internetAccess[1],
        education: req.body.education[1],
        parenting: req.body.parenting[1]    ,
        childrensEducation: req.body.childrensEducation[1],
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
