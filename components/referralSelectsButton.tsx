import { useRouter } from "next/router";
import type { UserResponse } from "../types/user";
import { useMOMD } from "../lib/context/MOMDContext";
import serviceToReferral from "../lib/serverfunctions/serviceToReferral";

type SaveAsReferralButtonProps = {
  domain: string;
  user: UserResponse;
  visible: boolean;
};

function SaveAsReferralButton({
  domain,
  user,
  visible,
}: SaveAsReferralButtonProps) {
  const router = useRouter();
  const clientId = router.query.clientId;
  const {
    addReferral,
    setSaving,
    setUserReferrals,
    currentService,
    setCurrentService,
    userReferrals,
    refData,
  } = useMOMD();

  async function saveReferral() {
    if (!currentService) return;
    await addReferral();
  }

  async function getUserReferrals() {
    const id = clientId === undefined ? user._id : clientId;
    await fetch("/api/get-referrals?userId=" + id)
      .then((res) => res.json())
      .then((res) => {
        setUserReferrals(res);
      });
  }

  const alreadySelected =
    currentService &&
    userReferrals.some((referral) => referral.name === currentService.name);

  return (
    <button
      disabled={refData?.domain !== domain}
      className={`${visible ? "visible" : "hidden"}  my-3 py-2 px-6 text-white text-xs bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 dark:disabled:bg-gray-800 rounded-lg shadow-xl dark:font-extralight dark:text-white dark:hover:bg-indigo-600`}
      onClick={() => {
        if (!alreadySelected) {
          // save referral
          saveReferral().then(() => {
            getUserReferrals().then(() => {
              setSaving(false);
            });
          });
          setCurrentService(null);
          // end save referral
        } else {
          alert(
            "You have already selected this referral. Please choose another referral.",
          );
          setCurrentService(null);
        }
      }}
    >
      + Save
    </button>
  );
}

export default SaveAsReferralButton;
