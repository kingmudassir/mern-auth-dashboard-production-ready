const WeeklyActivityCard = ({
  title = 'Weekly Activity',
  subtitle = 'New listings & signups this week',
  data = [],
  legends = [],
  stats = [],
  ChartComponent,
}) => {
  return (
    <div className="card">
      {/* Header */}
      <div className="card-header">
        <div>
          <p className="card-title">{title}</p>
          <p className="card-sub">{subtitle}</p>
        </div>

        {/* Legends */}
        <div className="flex items-center gap-3">
          {legends.map((l, i) => (
            <span key={i} className="legend-dot" style={{ '--c': l.color }}>
              {l.label}
            </span>
          ))}
        </div>
      </div>

      {/* Chart */}
      {ChartComponent && <ChartComponent data={data} />}

      {/* Bottom Stats */}
      <div className="flex justify-between mt-4 pt-4" style={{ borderTop: '1px solid #F2EEE9' }}>
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: `${color}14` }}
            >
              {Icon && <Icon size={13} style={{ color }} />}
            </div>

            <div>
              <p
                className="text-[0.78rem] font-bold text-[#1A1523]"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {value}
              </p>
              <p
                className="text-[0.65rem] text-[#8A8390]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyActivityCard;
