import { labelMap } from "../lib/serviceLabelsMap";
import UserReferralItem from "./userReferralItem";
import CustomReferralForm from "./customReferralForm";
import { useRouter } from "next/router";
import { useMOMD } from "../lib/context/MOMDContext";
import ServiceSelectorByDomain from "./referralSelectsSelect";
import type { SingleServiceResponse } from "../types/service";
import { asString } from "../utils/AsArray";

type ReferralSelectsProps = {
  domains: string[];
  services: SingleServiceResponse[];
};

function ServiceSelectors({ domains, services }: ReferralSelectsProps) {
  const router = useRouter();
  const { getUserReferrals, setUserReferrals, userReferrals, saving, user } =
    useMOMD();
  const clientId = asString(router.query.clientId);

  return (
    <div className={"flex-1"}>
      {domains.map((domain: string, i: number) => {
        return (
          <div
            key={i}
            className={" my-4 border-b-[1px] dark:border-b-gray-800 pb-4"}
          >
            <div className={"text-sm mb-2"}>
              <p className={"text-orange-600 text-lg"}>{labelMap[domain]}</p>
            </div>

            <div className={"flex"}>
              <div className={"w-full"}>
                <div
                  className={`bg-green-500 px-3 py-2 text-sm rounded ${saving === domain ? "visible" : "hidden"} dark:bg-purple-800 text-white`}
                >
                  Saving your referral. One moment please.
                </div>
                <ServiceSelectorByDomain services={services} domain={domain} />

                <div>
                  {userReferrals &&
                    userReferrals
                      .filter((item) => item.domain === domain)
                      .map((referral) => {
                        return (
                          <UserReferralItem
                            key={referral._id}
                            getUserReferrals={getUserReferrals}
                            referral={referral}
                          />
                        );
                      })}
                </div>
              </div>
            </div>
            <CustomReferralForm domain={domain} i={i} clientId={clientId} />
          </div>
        );
      })}
    </div>
  );
}

export default ServiceSelectors;
