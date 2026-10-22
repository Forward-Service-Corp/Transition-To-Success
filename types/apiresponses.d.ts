export type ApiErrorResponse = {
  error: string;
  message?: string;
};

export type NewReferralResponse =
  | {
      referral: ReferralResponse;
      success: true;
    }
  | {
      error: string;
      success: false;
    };
