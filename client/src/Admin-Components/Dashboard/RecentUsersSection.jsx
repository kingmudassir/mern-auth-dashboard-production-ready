import { Clock, Flag, AlertTriangle, Shield, ArrowUpRight } from 'lucide-react';
import Badge from './Badge';

function RecentUsersSection({ recentUsers, isLoading, status }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Recent users */}
      <div className="lg:col-span-2 admin-table-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3
            className="text-[0.9rem] font-bold text-[#1A1523]"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Recent Users
          </h3>
          <button
            className="text-[0.75rem] font-medium text-[#6C3CE1] flex items-center gap-1 hover:underline"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            View all <ArrowUpRight size={12} strokeWidth={2.2} />
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {isLoading ? (
            <p
              className="text-[0.8rem] text-[#8A8390]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Loading...
            </p>
          ) : recentUsers.length === 0 ? (
            <p
              className="text-[0.8rem] text-[#8A8390]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              No users yet.
            </p>
          ) : (
            recentUsers.map((u) => (
              <div
                key={u._id}
                className="flex items-center justify-between py-2.5 border-b border-[#F2EEE9] last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-[0.72rem] font-bold text-[#6C3CE1] flex-shrink-0"
                    style={{ background: 'rgba(108,60,225,0.1)', fontFamily: "'Syne', sans-serif" }}
                  >
                    {u.name
                      .split(' ')
                      .map((w) => w[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div>
                    <p
                      className="text-[0.82rem] font-semibold text-[#1A1523]"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {u.name}
                    </p>
                    <p
                      className="text-[0.72rem] text-[#8A8390]"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {u.email} ·{' '}
                      {new Date(u.createdAt).toLocaleDateString('en-PK', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <Badge status={status(u)} />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="admin-table-card rounded-2xl p-5 flex flex-col gap-3">
        <h3
          className="text-[0.9rem] font-bold text-[#1A1523] mb-1"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Quick Actions
        </h3>
        {[
          { label: 'Review Pending Listings', count: 47, color: '#C9A84C', icon: Clock },
          { label: 'Review Open Reports', count: 12, color: '#ef4444', icon: AlertTriangle },
          { label: 'Flagged Listings', count: 8, color: '#E8622A', icon: Flag },
          { label: 'New Admin Requests', count: 2, color: '#6C3CE1', icon: Shield },
        ].map(({ label, count, color, icon: Icon }) => (
          <button
            key={label}
            type="button"
            className="flex items-center justify-between p-3 rounded-xl border border-[#E8E3DC] bg-[#FAFAF9] hover:border-[#C4B8B0] hover:bg-white transition-all duration-150 text-left group"
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: `${color}15` }}
              >
                <Icon size={13} strokeWidth={2} style={{ color }} />
              </div>
              <span
                className="text-[0.78rem] font-medium text-[#1A1523]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {label}
              </span>
            </div>
            <span
              className="text-[0.72rem] font-bold px-2 py-0.5 rounded-full"
              style={{ background: `${color}15`, color, fontFamily: "'DM Sans', sans-serif" }}
            >
              {count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
export default RecentUsersSection;
