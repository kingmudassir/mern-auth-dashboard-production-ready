import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCards = ({ stats = [] }) => {
  return (
    <div className="stat-grid mb-6">
      {stats.map((s, i) => {
        const Icon = s.icon;

        return (
          <div key={s.id || i} className="stat-card" style={{ animationDelay: `${i * 60}ms` }}>
            {/* Top Row */}
            <div className="flex items-start justify-between mb-4">
              {/* Icon */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: s.bg }}
              >
                {Icon && <Icon size={16} strokeWidth={2} style={{ color: s.accent }} />}
              </div>

              {/* Trend */}
              <span
                className="flex items-center gap-1 text-[0.72rem] font-semibold"
                style={{
                  color: s.trend === 'up' ? '#059669' : s.trend === 'down' ? '#DC2626' : '#6B7280', // gray for neutral
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {s.trend === 'up' && <TrendingUp size={12} strokeWidth={2} />}
                {s.trend === 'down' && <TrendingDown size={12} strokeWidth={2} />}
                {/* neutral → no icon */}
                {s.change}
              </span>
            </div>

            {/* Content */}
            <p className="stat-value">{s.value}</p>
            <p className="stat-label">{s.label}</p>
            <p className="stat-sub">{s.sub}</p>
          </div>
        );
      })}
    </div>
  );
};

export default StatCards;
