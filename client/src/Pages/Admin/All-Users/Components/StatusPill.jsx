function StatusPill({ status, statusStyles }) {
  const s = statusStyles[status] ?? statusStyles.active;
  return (
    <span
      className="text-[0.68rem] font-semibold px-2 py-0.5 rounded-full"
      style={{ background: s.bg, color: s.color, fontFamily: "'DM Sans', sans-serif" }}
    >
      {s.label}
    </span>
  );
}
export default StatusPill;
