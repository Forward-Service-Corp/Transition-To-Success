import {
  type ReferralDocument,
  type AddReferralInput,
  type ReferralResponse,
} from "../../types/referral";

type addReferralReturnType =
  | {
      referral: ReferralResponse;
      success: true;
    }
  | {
      error: string;
      success: false;
    };

export async function addReferralToDb(
  data: AddReferralInput,
): Promise<addReferralReturnType> {
  const response = await fetch("/api/save-referral", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}
