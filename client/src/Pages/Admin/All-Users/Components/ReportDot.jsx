import { Flag } from 'lucide-react';

function ReportDot({ count }) {
  const color = count >= 8 ? '#C4531F' : count >= 4 ? '#92700a' : '#8A8390';
  const bg =
    count >= 8
      ? 'rgba(232,98,42,0.1)'
      : count >= 4
        ? 'rgba(201,168,76,0.15)'
        : 'rgba(138,131,144,0.1)';
  return (
    <span
      className="inline-flex items-center gap-1 text-[0.72rem] font-semibold px-2 py-0.5 rounded-full"
      style={{ background: bg, color, fontFamily: "'DM Sans', sans-serif" }}
    >
      <Flag size={9} strokeWidth={2.5} />
      {count}
    </span>
  );
}

export default ReportDot;
