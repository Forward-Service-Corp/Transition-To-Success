import type { ObjectId } from "mongodb";

type LifeAreaScore = [number, string];

export type SurveyDocument = {
  _id: ObjectId;
  dream: string;
  dreamId: string | ObjectId;
  county: string[];
  coach: CoachType[];
  priority: string[];
  food: LifeAreaScore;
  money: LifeAreaScore;
  substances: LifeAreaScore;
  mentalHealth: LifeAreaScore;
  safety: LifeAreaScore;
  healthInsurance: LifeAreaScore;
  transportation: LifeAreaScore;
  disabilities: LifeAreaScore;
  lifeSkills: LifeAreaScore;
  employment: LifeAreaScore;
  legal: LifeAreaScore;
  childcare: LifeAreaScore;
  adultEducation: LifeAreaScore;
  parentingSkills: LifeAreaScore;
  childrensEducation: LifeAreaScore;
  communityInvolvement: LifeAreaScore;
  familyFriendsSupport: LifeAreaScore;
  budgeting: LifeAreaScore;
  racismBigotry: LifeAreaScore;
  internetAccess: LifeAreaScore;
  housing: LifeAreaScore;
  userId: string | ObjectId;
  datestamp: string | Date;
  surprise: string;
  concern: string;
  family: string;
  health: string;
  income: string;
  isYouthSurvey: boolean;
};

export type SurveyResponse = Omit<SurveyDocument, "_id"> & {
  _id: string;
};
