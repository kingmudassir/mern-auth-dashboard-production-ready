function Badge({ status }) {
  const map = {
    active: { bg: 'rgba(34,197,94,0.1)', text: '#16a34a', label: 'Active' },
    pending: { bg: 'rgba(201,168,76,0.15)', text: '#92700a', label: 'Pending' },
    banned: { bg: 'rgba(232,98,42,0.1)', text: '#C4531F', label: 'Banned' },
    open: { bg: 'rgba(232,98,42,0.1)', text: '#C4531F', label: 'Open' },
    resolved: { bg: 'rgba(34,197,94,0.1)', text: '#16a34a', label: 'Resolved' },
    flagged: { bg: 'rgba(239,68,68,0.1)', text: '#dc2626', label: 'Flagged' },
  };
  const s = map[status] ?? map.active;
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.7rem] font-semibold"
      style={{ background: s.bg, color: s.text, fontFamily: "'DM Sans', sans-serif" }}
    >
      {s.label}
    </span>
  );
}

export default Badge;
