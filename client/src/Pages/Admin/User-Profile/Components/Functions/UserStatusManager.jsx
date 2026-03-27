import { Check } from 'lucide-react';
import SectionCard from '../Common/SectionCard';
import SectionTitle from '../Common/SectionTitle';

const UserStatusManager = ({ currentStatus, STATUS_OPTIONS, setModal, isUpdatingStatus }) => {
  const handleStatusClick = (statusValue) => {
    // 1. Don't do anything if clicking the already active status
    if (statusValue === currentStatus) return;

    // 2. Logic to map the status value to your specific modal action types
    let modalType = statusValue;
    if (statusValue === 'banned') modalType = 'ban';
    if (statusValue === 'active') modalType = 'activate';

    setModal({ type: modalType });
  };

  return (
    <SectionCard>
      <SectionTitle sub="Change this user's account standing">Account Status</SectionTitle>

      <div className="flex flex-col gap-2">
        {STATUS_OPTIONS.map((s) => {
          const isActive = currentStatus === s.value;

          return (
            <button
              key={s.value}
              type="button"
              onClick={() => handleStatusClick(s.value)}
              disabled={isUpdatingStatus}
              className="flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-150 disabled:opacity-50"
              style={{
                border: isActive ? `1.5px solid ${s.color}` : '1.5px solid #E8E3DC',
                background: isActive ? s.bg : '#FAFAF9',
                cursor: isActive ? 'default' : 'pointer',
              }}
              aria-pressed={isActive}
            >
              <span
                className="text-[0.82rem] font-semibold"
                style={{
                  color: isActive ? s.color : '#8A8390',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {s.label}
              </span>

              {isActive && (
                <Check
                  size={14}
                  strokeWidth={2.5}
                  style={{ color: s.color }}
                  aria-label="Current status"
                />
              )}
            </button>
          );
        })}
      </div>
    </SectionCard>
  );
};

export default UserStatusManager;
