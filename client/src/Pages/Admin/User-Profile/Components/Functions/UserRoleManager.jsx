import React from 'react';
import { Check } from 'lucide-react';
import SectionCard from '../Common/SectionCard';
import SectionTitle from '../Common/SectionTitle';

const UserRoleManager = ({ currentRole, onRoleChange, isUpdatingRole }) => {
  const roles = [
    { value: 'user', label: 'User' },
    { value: 'moderator', label: 'Moderator' },
  ];

  return (
    <SectionCard>
      <SectionTitle sub="Change what this user can do">Role</SectionTitle>
      <div className="flex flex-col gap-2">
        {roles.map(({ value, label }) => {
          const isActive = currentRole === value;

          return (
            <button
              key={value}
              type="button"
              onClick={() => !isActive && onRoleChange(value)}
              disabled={isUpdatingRole}
              className="flex items-center justify-between px-4 py-2.5 rounded-xl border transition-all duration-150 disabled:opacity-50"
              style={{
                border: isActive ? '1.5px solid #6C3CE1' : '1.5px solid #E8E3DC',
                background: isActive ? 'rgba(108,60,225,0.06)' : '#FAFAF9',
                cursor: isActive ? 'default' : 'pointer',
              }}
              aria-pressed={isActive}
            >
              <span
                className="text-[0.82rem] font-semibold"
                style={{
                  color: isActive ? '#6C3CE1' : '#8A8390',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {label}
              </span>
              {isActive && (
                <Check
                  size={14}
                  strokeWidth={2.5}
                  style={{ color: '#6C3CE1' }}
                  aria-label="Current role"
                />
              )}
            </button>
          );
        })}
      </div>
    </SectionCard>
  );
};

export default UserRoleManager;
