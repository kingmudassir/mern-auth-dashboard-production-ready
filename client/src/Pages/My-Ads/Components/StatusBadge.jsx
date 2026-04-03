import React from 'react';
import { CheckCircle2, AlertCircle, Clock, XCircle } from 'lucide-react';

/**
 * Configuration for different status states.
 * Exported so you can use these keys (active, pending, etc.)
 * in your parent components for type-checking or logic.
 */
export const STATUS_META = {
  active: {
    label: 'Active',
    Icon: CheckCircle2,
    color: '#16a34a',
    bg: 'rgba(34,197,94,0.09)',
    border: 'rgba(34,197,94,0.22)',
  },
  pending: {
    label: 'Under Review',
    Icon: AlertCircle,
    color: '#a16207',
    bg: 'rgba(234,179,8,0.09)',
    border: 'rgba(234,179,8,0.25)',
  },
  expired: {
    label: 'Expired',
    Icon: Clock,
    color: '#8A8390',
    bg: 'rgba(138,131,144,0.09)',
    border: 'rgba(138,131,144,0.22)',
  },
  rejected: {
    label: 'Rejected',
    Icon: XCircle,
    color: '#dc2626',
    bg: 'rgba(239,68,68,0.09)',
    border: 'rgba(239,68,68,0.22)',
  },
};

const StatusBadge = ({ status }) => {
  const m = STATUS_META[status];

  // Fallback if an invalid status is passed
  if (!m) return null;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-[0.3rem] rounded-full text-[0.67rem] font-bold whitespace-nowrap"
      style={{
        background: m.bg,
        color: m.color,
        border: `1px solid ${m.border}`,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <m.Icon size={10} strokeWidth={2.5} aria-hidden="true" />
      {m.label}
    </span>
  );
};

export default StatusBadge;
