import type { DreamResponse } from "./dream";
import type { NoteResponse } from "./note";
import type { ReferralResponse } from "./referral";
import type { SurveyResponse } from "./survey";
import type { TaskResponse } from "./task";
import type { UserResponse } from "./user";

export type IndexDataResponse = {
  user: UserResponse;
  dreams: DreamResponse[];
  surveys: SurveyResponse[];
  referrals: ReferralResponse[];
  tasks: TaskResponse[];
  notes: NoteResponse[];
  clientReferrals: ReferralResponse[];
  client?: UserResponse | null;
};
