import type { ObjectId } from "mongodb";

export type LocationType = {
  address: AddressType;
  url?: string;
  contactPhone?: string;
  contactName?: string;
  contactEmail?: string;
  hours?: string;
  notes?: string;
  primary_location: boolean;
};

export type SingleServiceDocument = {
  _id: ObjectId;
  name: string;
  counties: string[];
  locations: LocationType[];
  domains: string[];
  oldIds?: string[];
  primary_location: LocationType;
  need_to_bring?: string;
  description?: string;
  lastModified?: string;
};

export type SingleServiceResponse = Omit<SingleServiceDocument, "_id"> & {
  _id: string;
};

export type AddressType = {
  street?: string;
  city: string;
  state?: string;
  zip?: string;
};
