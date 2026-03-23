function ListingBadge({ status }) {
  const map = {
    active: { bg: 'rgba(34,197,94,0.1)', color: '#16a34a', label: 'Active' },
    pending: { bg: 'rgba(201,168,76,0.15)', color: '#92700a', label: 'Pending' },
    flagged: { bg: 'rgba(239,68,68,0.1)', color: '#dc2626', label: 'Flagged' },
  };
  const s = map[status] ?? map.active;
  return (
    <span
      className="inline-flex px-2 py-0.5 rounded-full text-[0.68rem] font-semibold"
      style={{ background: s.bg, color: s.color, fontFamily: "'DM Sans', sans-serif" }}
    >
      {s.label}
    </span>
  );
}
export default ListingBadge;
