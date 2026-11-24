import type { ObjectId } from "mongodb";

export type ServiceModificationType = {
  _id: string;
  serviceId: string;
  serviceName: string;
  modifiedBy: {
    userId: string;
    email: string;
    name: string;
  };
  action: string;
  changes: {
    field: string;
    oldValue: unknown;
    newValue: unknown;
  }[];
  summary: string;
  timestamp: Date;
};

export type ServiceModificationDocument = Omit<
  ServiceModificationType,
  "_id" | "serviceId" | "modifiedBy"
> & {
  _id: ObjectId;
  serviceId: ObjectId;
  modifiedBy: {
    userId: ObjectId;
    email: string;
    name: string;
  };
};
