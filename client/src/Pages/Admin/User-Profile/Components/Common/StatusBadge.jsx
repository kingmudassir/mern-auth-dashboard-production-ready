function StatusBadge({ status, options }) {
  const s = options.find((o) => o.value === status) ?? STATUS_OPTIONS[0];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[0.7rem] font-semibold"
      style={{ background: s.bg, color: s.color, fontFamily: "'DM Sans', sans-serif" }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: s.color }}
        aria-hidden="true"
      />
      {s.label}
    </span>
  );
}

export default StatusBadge;
