const CONDITION_CONFIG = {
  new: { label: 'New', bg: 'rgba(5,150,105,0.08)', text: '#059669' },
  used: { label: 'Used', bg: 'rgba(108,60,225,0.08)', text: '#6C3CE1' },
  certified: { label: 'Certified', bg: 'rgba(37,99,235,0.08)', text: '#2563EB' },
};

const ConditionBadge = ({ condition }) => {
  const cfg = CONDITION_CONFIG[condition?.toLowerCase()] ?? CONDITION_CONFIG.used;

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-[0.65rem] font-semibold"
      style={{
        background: cfg.bg,
        color: cfg.text,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {cfg.label}
    </span>
  );
};

export default ConditionBadge;
