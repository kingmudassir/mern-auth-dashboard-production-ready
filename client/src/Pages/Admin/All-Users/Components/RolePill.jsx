function RolePill({ role }) {
  return (
    <span
      className="text-[0.68rem] font-semibold px-2 py-0.5 rounded-full"
      style={{
        background: role === 'moderator' ? 'rgba(201,168,76,0.15)' : 'rgba(108,60,225,0.08)',
        color: role === 'moderator' ? '#92700a' : '#6C3CE1',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {role}
    </span>
  );
}
export default RolePill;
