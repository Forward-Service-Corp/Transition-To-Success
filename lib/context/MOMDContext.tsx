import { createContext, useContext, useState, type ReactNode } from "react";
import type { SingleServiceResponse } from "../../types/service";
import type { AddReferralInput, ReferralResponse } from "../../types/referral";
import type { UserResponse } from "../../types/user";
import type { SurveyResponse } from "../../types/survey";
import { addReferralToDb } from "../../utils/serverActions/addReferral";
import type { NewReferralResponse } from "../../types/apiresponses";

export type MOMDContextType = {
  currentService: SingleServiceResponse | null;
  setCurrentService: (service: SingleServiceResponse | null) => void;
  userReferrals: ReferralResponse[];
  setUserReferrals: (referrals: ReferralResponse[]) => void;
  saving: string | false;
  setSaving: (value: string | false) => void;
  user: UserResponse;
  getUserReferrals: () => Promise<void>;
  addReferral: () => Promise<NewReferralResponse>;
  updateRefData: (data: Partial<AddReferralInput>) => void;
  refData: AddReferralInput;
  selectedServices: Record<string, SingleServiceResponse | null>;
  setSelectedService: (
    domain: string,
    service: SingleServiceResponse | null,
  ) => void;
  getSelectedService: (domain: string) => SingleServiceResponse | null;
};

type MOMDProviderProps = {
  children: ReactNode;
  initialReferrals: ReferralResponse[];
  user: UserResponse;
  survey: SurveyResponse;
};

const MOMDContext = createContext<MOMDContextType | null>(null);

export const MOMDProvider = ({
  children,
  initialReferrals,
  user,
  survey,
}: MOMDProviderProps) => {
  const [currentService, setCurrentService] =
    useState<SingleServiceResponse | null>(null);

  const [userReferrals, setUserReferrals] = useState(initialReferrals);

  const [saving, setSaving] = useState<string | false>(false);

  const [error, setError] = useState("");

  const [refData, setRefData] = useState<AddReferralInput>({
    archived: "false",
    domain: "",
    dream: survey.dream,
    name: "",
    surveyId: survey._id,
    userId: user._id,
  });

  const [selectedServices, setselectedServices] = useState<
    Record<string, SingleServiceResponse | null>
  >({});

  const setSelectedService = (
    domain: string,
    service: SingleServiceResponse | null,
  ) => {
    setselectedServices((prev) => ({
      ...prev,
      [domain]: service,
    }));
    updateRefData({ domain, name: service?.name || "" });
  };

  const getSelectedService = (domain: string) =>
    selectedServices[domain] || null;

  const addReferral = async (): Promise<NewReferralResponse> => {
    if (!refData.domain) {
      setError("Domain is required");
      return { success: false, error: "Domain is required" };
    }

    if (!refData.name) {
      setError("Name is required");
      return { success: false, error: "Name is required" };
    }
    setError("");
    setSaving(refData.domain);

    const result = await addReferralToDb(refData);

    if (!result.success) {
      setSaving(false);
      return result;
    }
    setSaving(false);
    return result;
  };

  const getUserReferrals = async (): Promise<void> => {
    await fetch("/api/get-referrals?userId=" + survey.userId)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setUserReferrals(res);
      });
  };

  const updateRefData = (data: Partial<AddReferralInput>) => {
    const newData = { ...refData, ...data };
    setRefData(newData);
    console.log(newData);
  };

  const ctx: MOMDContextType = {
    currentService,
    setCurrentService,
    userReferrals,
    setUserReferrals,
    saving,
    setSaving,
    user,
    getUserReferrals,
    addReferral,
    updateRefData,
    refData,
    getSelectedService,
    setSelectedService,
    selectedServices,
  };

  return <MOMDContext.Provider value={ctx}>{children}</MOMDContext.Provider>;
};

export const useMOMD = () => {
  const context = useContext(MOMDContext);
  if (!context) {
    throw new Error("useMOMD must be used within a MOMDProvider");
  }
  return context;
};
