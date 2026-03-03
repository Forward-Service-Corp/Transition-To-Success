import { connectToDatabase } from '../../lib/dbConnect'
import { ObjectId } from 'mongodb'

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*"); // Or your specific origin
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
    return res.status(200).end();
  }

    if (req.method === "POST") {

      try {

        
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
    food: req.body.food?.[0] ?? null,
    money: req.body.money?.[0] ?? null,
    substances: req.body.substances?.[0] ?? null,
    mentalHealth: req.body.mentalHealth?.[0] ?? null,
    safety: req.body.safety?.[0] ?? null,
    healthInsurance: req.body.healthInsurance?.[0] ?? null,
    transportation: req.body.transportation?.[0] ?? null,
    disabilities: req.body.disabilities?.[0] ?? null,
    lifeSkills: req.body.lifeSkills?.[0] ?? null,
    employment: req.body.employment?.[0] ?? null,
    legal: req.body.legal?.[0] ?? null,
    childcare: req.body.childcare?.[0] ?? null,
    adultEducation: req.body.adultEducation?.[0] ?? null,
    parentingSkills: req.body.parentingSkills?.[0] ?? null,
    childrensEducation: req.body.childrensEducation?.[0] ?? null,
    communityInvolvement: req.body.communityInvolvement?.[0] ?? null,
    familyFriendsSupport: req.body.familyFriendsSupport?.[0] ?? null,
    budgeting: req.body.budgeting?.[0] ?? null,
    racismBigotry: req.body.racismBigotry?.[0] ?? null,
    internetAccess: req.body.internetAccess?.[0] ?? null,
    housing: req.body.housing?.[0] ?? null,
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
  
  return res.json(LAS, surveyInsert, dreamUpdate)
} catch(error){
  console.error(error)
  return res.status(500).json({error: error.message})
}
}
}
