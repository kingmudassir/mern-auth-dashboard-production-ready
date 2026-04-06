import React from 'react';

export const STATUS_CONFIG = {
  active: { label: 'Active', dot: '#059669', bg: 'rgba(5,150,105,0.08)', text: '#059669' },
  pending: { label: 'Pending', dot: '#D97706', bg: 'rgba(217,119,6,0.08)', text: '#D97706' },
  rejected: { label: 'Rejected', dot: '#DC2626', bg: 'rgba(220,38,38,0.08)', text: '#DC2626' },
  expired: { label: 'Expired', dot: '#8A8390', bg: 'rgba(138,131,144,0.1)', text: '#8A8390' },
  sold: { label: 'Sold', dot: '#6C3CE1', bg: 'rgba(108,60,225,0.08)', text: '#6C3CE1' },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status?.toLowerCase()] ?? {
    label: status || 'Unknown',
    dot: '#8A8390',
    bg: 'rgba(138,131,144,0.1)',
    text: '#8A8390',
  };

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[0.68rem] font-semibold whitespace-nowrap"
      style={{
        background: cfg.bg,
        color: cfg.text,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: cfg.dot }} />
      {cfg.label}
    </span>
  );
};

export default StatusBadge;
