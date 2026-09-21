import type { ObjectId } from "mongodb";

export type UserDocument = {
  _id: ObjectId;
  first_name: string;
  last_name: string;
  image: string;
  email: string;
  level: string;
  phone: string;
  street: string;
  state: string;
  zip: string;
  homeCounty: string;
  county: string[];
  programs: string[];
  isYouth: boolean;
  name: string;
  timestamp: string | Date;
  lastLogin: string | Date;
};

export type UserResponse = Omit<UserDocument, "_id"> & {
  _id: string;
};
