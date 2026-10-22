import { labelMap } from "../lib/serviceLabelsMap";
import ReferralSelectsButton from "./referralSelectsButton";
import type { SingleServiceResponse } from "../types/service";
import Select from "react-select";
import { useMOMD } from "../lib/context/MOMDContext";

type ServiceSelectorByDomainProps = {
  domain: string;
  services: SingleServiceResponse[];
};

function ServiceSelectorByDomain({
  domain,
  services,
}: ServiceSelectorByDomainProps) {
  const {
    saving,
    selectedServices,
    setSelectedService,
    user,
    setCurrentService,
  } = useMOMD();

  const filteredServices = services.filter(
    (service) => service.domains.indexOf(labelMap[domain]) !== -1,
  );

  const options = filteredServices.map((service) => ({
    label: service.name,
    value: service,
  }));

  return (
    <>
      <Select
        options={options}
        onChange={(option) => {
          setSelectedService(domain, option?.value ?? null);
          setCurrentService(option?.value ?? null);
        }}
        value={
          selectedServices[domain]
            ? {
                label: selectedServices[domain].name,
                value: selectedServices[domain],
              }
            : null
        }
      />
      <div className={"w-full text-right"}>
        <ReferralSelectsButton
          visible={filteredServices.length > 0}
          domain={domain}
          user={user}
        />
      </div>

      <span className={`${filteredServices.length > 0 ? "hidden" : "visible"}`}>
        There are no referrals available for your county and life area
        combination.
      </span>
    </>
  );
}

export default ServiceSelectorByDomain;
