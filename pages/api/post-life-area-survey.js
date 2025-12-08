import { connectToDatabase } from '../../lib/dbConnect'
import { ObjectId } from 'mongodb'

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  const survey = {
    dream: req.body.dream,
    dreamId: req.body.dreamId,
    county: req.body.county,
    coach: req.body.coach,
    priority: req.body.priority,
    food: req.body.food,
    money: req.body.money,
    substances: req.body.substances,
    mentalHealth: req.body.mentalHealth,
    safety: req.body.safety,
    healthInsurance: req.body.healthInsurance,
    transportation: req.body.transportation,
    disabilities: req.body.disabilities,
    lifeSkills: req.body.lifeSkills,
    employment: req.body.employment,
    legal: req.body.legal,
    childcare: req.body.childcare,
    adultEducation: req.body.adultEducation,
    parentingSkills: req.body.parentingSkills,
    childrensEducation: req.body.childrensEducation,
    communityInvolvement: req.body.communityInvolvement,
    familyFriendsSupport: req.body.familyFriendsSupport,
    budgeting: req.body.budgeting,
    racismBigotry: req.body.racismBigotry,
    internetAccess: req.body.internetAccess,
    housing: req.body.housing,
    userId: ObjectId(req.body.userId),
    user: req.body.user,
    datestamp: new Date(),
    surprise: req.body.surprise,
    concern: req.body.concern,
    family: req.body.family,
    health: req.body.health,
    income: req.body.income,
    isYouthSurvey: false
  }

  const surveyData = {
    dream: req.body.dream,
    dreamId: req.body.dreamId,
    county: req.body.county,
    coach: req.body.coach,
    priority: req.body.priority,
    food: req.body.food[1],
    money: req.body.money,
    substances: req.body.substances[1],
    mentalHealth: req.body.mentalHealth[1],
    safety: req.body.safety[1],
    healthInsurance: req.body.healthInsurance[1],
    transportation: req.body.transportation[1],
    disabilities: req.body.disabilities[1],
    lifeSkills: req.body.lifeSkills[1],
    employment: req.body.employment[1],
    legal: req.body.legal[1],
    childcare: req.body.childcare[1],
    adultEducation: req.body.adultEducation[1],
    parentingSkills: req.body.parentingSkills[1],
    childrensEducation: req.body.childrensEducation[1],
    communityInvolvement: req.body.communityInvolvement[1],
    familyFriendsSupport: req.body.familyFriendsSupport[1],
    budgeting: req.body.budgeting[1],
    racismBigotry: req.body.racismBigotry[1],
    internetAccess: req.body.internetAccess[1],
    housing: req.body.housing[1],
    userId: ObjectId(req.body.userId),
    user: req.body.user,
    datestamp: new Date(),
    surprise: req.body.surprise,
    concern: req.body.concern,
    family: req.body.family,
    health: req.body.health,
    income: req.body.income,
    isYouthSurvey: false
  }

  const { db } = await connectToDatabase()
  const LAS = await db.collection('lifeAreaSurveys').insertOne(survey)

  const surveyInsert = await db.collection('ttsReporting').insertOne(surveyData)

  const dreamUpdate = await db.collection('dreams').updateOne(
    { _id: ObjectId(req.body.dreamId) },
    {
      $set: { survey }
    }
  )

  res.json(LAS, surveyInsert, dreamUpdate)
}
