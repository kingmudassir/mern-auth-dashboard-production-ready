import { TrendingDown, TrendingUp } from 'lucide-react';

function StatCard({ label, value, sub, icon: Icon, trend, color }) {
  const up = trend > 0;

  return (
    <div className="admin-stat-card rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}18` }}
        >
          <Icon size={18} strokeWidth={1.9} style={{ color }} aria-hidden="true" />
        </div>

        {trend === null ? null : trend === 0 ? (
          <span
            className="text-[0.72rem] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            — 0%
          </span>
        ) : (
          <span
            className={`flex items-center gap-0.5 text-[0.72rem] font-semibold px-2 py-0.5 rounded-full ${
              up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
            }`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {up ? (
              <TrendingUp size={11} strokeWidth={2} />
            ) : (
              <TrendingDown size={11} strokeWidth={2} />
            )}
            {Math.abs(trend)}%
          </span>
        )}
      </div>

      <div>
        <p
          className="text-[1.7rem] font-extrabold text-[#1A1523] leading-none tracking-[-0.04em]"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          {value}
        </p>
        <p
          className="text-[0.78rem] text-[#8A8390] mt-1"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {label}
        </p>
      </div>

      {sub && (
        <p
          className="text-[0.72rem] text-[#B0AABA]"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

export default StatCard;
