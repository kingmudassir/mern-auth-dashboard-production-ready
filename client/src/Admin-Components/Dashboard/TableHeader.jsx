function TableHeader({ cols }) {
  return (
    <thead>
      <tr className="border-b border-[#E8E3DC]">
        {cols.map((c) => (
          <th
            key={c}
            className="text-left text-[0.68rem] font-semibold text-[#8A8390] uppercase tracking-wider px-4 py-3"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {c}
          </th>
        ))}
      </tr>
    </thead>
  );
}
export default TableHeader;
