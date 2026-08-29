export function HouseholdView({ household, members, onLeave, leaving }) {
  return (
    <div>
      <h2>{household.name}</h2>
      <p>
        Invite code: <strong>{household.inviteCode}</strong>
      </p>

      <h3>Members</h3>
      <ul>
        {members.map((member) => (
          <li key={member._id}>
            {member.name} ({member.email})
            {member._id === household.createdBy && " - Admin"}
          </li>
        ))}
      </ul>

      <button onClick={onLeave} disabled={leaving}>
        {leaving ? "Leaving..." : "Leave household"}
      </button>
    </div>
  );
}
