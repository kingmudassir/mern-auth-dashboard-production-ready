import { Calendar, Car, Clock, Flag } from 'lucide-react';
import FieldLabel from '../Common/FieldLabel';
import SectionCard from '../Common/SectionCard';
import StatusBadge from '../Common/StatusBadge';

const UserProfileCard = ({ user, initials, getUserStatus, STATUS_OPTIONS, formatDate }) => {
  if (!user) return null;

  const userStats = [
    { icon: Calendar, label: 'Joined', value: formatDate(user.createdAt) },
    {
      icon: Clock,
      label: 'Last login',
      value: user.lastLoginAt ? formatDate(user.lastLoginAt) : 'N/A',
    },
    { icon: Car, label: 'Listings', value: `${user.listings ?? 0} total` },
    { icon: Flag, label: 'Reports against', value: `${user.reportCount ?? 0} reports` },
  ];

  return (
    <SectionCard>
      {/* Avatar + Name + Role */}
      <div className="flex flex-col items-center text-center gap-3">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-[1.5rem] font-extrabold"
          style={{
            background: 'rgba(108,60,225,0.1)',
            color: '#6C3CE1',
            fontFamily: "'Syne', sans-serif",
          }}
          aria-label={`Avatar for ${user.name}`}
        >
          {user.avatar ? (
            <img src={user.avatar} alt="" className="w-full h-full object-cover rounded-2xl" />
          ) : (
            initials(user.name)
          )}
        </div>

        <div>
          <h1
            className="text-[1.15rem] font-extrabold tracking-[-0.03em] leading-tight"
            style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
          >
            {user.name}
          </h1>
          <p
            className="text-[0.78rem] mt-0.5"
            style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
          >
            {user.email}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-center">
          <StatusBadge status={getUserStatus(user)} options={STATUS_OPTIONS} />
          <span
            className="text-[0.7rem] font-semibold px-2.5 py-0.5 rounded-full"
            style={{
              background: 'rgba(108,60,225,0.1)',
              color: '#6C3CE1',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {user.role}
          </span>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mt-5 pt-4 flex flex-col gap-2.5" style={{ borderTop: '1px solid #F2EEE9' }}>
        {userStats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-2.5">
            <Icon
              size={13}
              strokeWidth={1.9}
              style={{ color: '#C4BDD0', flexShrink: 0 }}
              aria-hidden="true"
            />
            <span
              className="text-[0.75rem]"
              style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
            >
              {label}
            </span>
            <span
              className="text-[0.75rem] font-semibold ml-auto"
              style={{ color: '#1A1523', fontFamily: "'DM Sans', sans-serif" }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* User ID */}
      <div className="mt-4 pt-3" style={{ borderTop: '1px solid #F2EEE9' }}>
        <FieldLabel>User ID</FieldLabel>
        <p className="text-[0.72rem] font-mono break-all" style={{ color: '#8A8390' }}>
          {user._id}
        </p>
      </div>
    </SectionCard>
  );
};

export default UserProfileCard;
