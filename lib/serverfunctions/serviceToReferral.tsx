import type { AddReferralInput } from "../../types/referral";
import type { SingleServiceResponse } from "../../types/service";

type serviceToReferralProps = {
  service: SingleServiceResponse;
  userId: string;
  surveyId: string;
  dreamName: string;
  domain: string;
  locationIndex: number;
};

export default function serviceToReferral({
  service,
  locationIndex,
  userId,
  dreamName,
  domain,
  surveyId,
}: serviceToReferralProps): AddReferralInput {
  return {
    archived: false,
    domain: domain,
    dream: dreamName,
    name: service.name,
    surveyId: surveyId,
    userId: userId,
    contact: service.locations[locationIndex].contactName,
    contactEmail: service.locations[locationIndex].contactEmail,
    contactPhone: service.locations[locationIndex].contactPhone,
    email: service.locations[locationIndex].contactEmail,
    phone: service.locations[locationIndex].contactPhone,
    hours: service.locations[locationIndex].hours,
    isCustom: false,
    needs: service.need_to_bring,
    requirements: service.description,
    url: service.locations[locationIndex].url,
  };
}
