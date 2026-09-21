import { labelMap } from "../lib/serviceLabelsMap";

export function AccountToService(account) {
  const result = {
    counties: account?.fsc_countiesserved_Formatted?.split("; ") || [],
    county: account?.fsc_countiesserved_Formatted || "",
    services:
      unMapMultipleServiceDomains(
        account?.fsc_carenetworkdomain_Formatted?.split(";"),
      ) || [],
    service: account?.fsc_carenetworkdomain_Formatted || "",
    city: account?.address1_city || "",
    contactName: account?.address1_primarycontactname || "",
    contactEmail: account?.emailaddress1 || "",
    hours: account?.fsc_hours || "",
    name: account?.name || "",
    needs: account?.fsc_referral_process || "",
    phone: account?.telephone1 || "",
    requirements: account?.description || "",
    state: account?.address1_stateorprovince || "",
    street: account?.address1_line1 || "",
    url: account?.websiteurl || "",
    zip: account?.address1_postalcode || "",
    _id: account?.accountid || "",
  };

  //console.log(result.service);
  return result;
}

export function MultipleAccountsToServices(accounts) {
  return accounts.map((account) => AccountToService(account));
}

export function unMapServiceDomain(service) {
  const domain = Object.keys(labelMap).find((key) => labelMap[key] == service);
  return domain;
}

export function unMapMultipleServiceDomains(services) {
  return services.map((serv) => unMapServiceDomain(serv));
}
