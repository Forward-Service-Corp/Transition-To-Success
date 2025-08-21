import {connectToDatabase} from "../../lib/dbConnect";
import {ObjectId} from "mongodb";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {

    const {db} = await connectToDatabase()
    const LAS = await db
        .collection("lifeAreaSurveys")
        .updateOne({_id: ObjectId(req.body.surveyId)},
            {
                $set: {
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
                    userId: req.body.userId,
                    user: req.body.user,
                    surprise: req.body.surprise,
                    concern: req.body.concern,
                    family: req.body.family,
                    health: req.body.health,
                    income: req.body.income
                }
            }
            )

    res.json(LAS)

}
