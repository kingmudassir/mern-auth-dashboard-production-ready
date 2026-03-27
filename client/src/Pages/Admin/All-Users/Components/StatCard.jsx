function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3.5 rounded-2xl"
      style={{ background: '#FFFFFF', border: '1.5px solid #E8E3DC' }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: accent.bg }}
      >
        <Icon size={15} strokeWidth={2} style={{ color: accent.color }} />
      </div>
      <div>
        <p
          className="text-[1.05rem] font-extrabold tracking-[-0.03em]"
          style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
        >
          {value}
        </p>
        <p
          className="text-[0.72rem]"
          style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
        >
          {label}
        </p>
      </div>
    </div>
  );
}

export default StatCard;
