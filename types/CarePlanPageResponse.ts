import type { NoteResponse } from "./note";
import type { ReferralResponse } from "./referral";
import type { TaskResponse } from "./task";
import type { UserResponse } from "./user";

export type CarePlanPageResponse = {
  user: UserResponse;
  referrals: ReferralResponse[];
  notes: NoteResponse[];
  todos: TaskResponse[];
};
