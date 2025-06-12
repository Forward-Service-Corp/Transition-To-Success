import ProfileSectionStyle from "./ProfileSectionStyle";
import ProfileCoachSingle from "./profileCoachSingle";

function ProfileCoaches({user}) {
    let coach
    if(user?.coach !== null && user?.coach !== undefined) {
         coach = user.coach;
    }

    return (
        <ProfileSectionStyle title={`Coaches`}>
            <div className={`mt-4 text-sm`}>
                {user?.coach === undefined || user?.coach.length === 0 ? <span className={"mb-6 block"}>You have no coaches</span> : null}
            </div>
            <div className={"grid grid-cols-4 gap-4"}>
                {coach && coach.filter(c => c.terminationDate === undefined && c.removalDate === undefined).map(coach => (
                    <ProfileCoachSingle key={coach.key} coach={coach} />
                ))}
            </div>

        </ProfileSectionStyle>
    );
}

export default ProfileCoaches;
