function ActionBtn({ label, icon: Icon, onClick, loading, variant = 'default', disabled }) {
  const styles = {
    default: { color: '#1A1523', border: '#E8E3DC', bg: '#FFFFFF', hover: '#F7F4F0' },
    violet: {
      color: '#6C3CE1',
      border: 'rgba(108,60,225,0.28)',
      bg: 'rgba(108,60,225,0.05)',
      hover: 'rgba(108,60,225,0.1)',
    },
    danger: {
      color: '#C4531F',
      border: 'rgba(232,98,42,0.28)',
      bg: 'rgba(232,98,42,0.05)',
      hover: 'rgba(232,98,42,0.1)',
    },
    red: {
      color: '#dc2626',
      border: 'rgba(239,68,68,0.28)',
      bg: 'rgba(239,68,68,0.05)',
      hover: 'rgba(239,68,68,0.1)',
    },
  };
  const s = styles[variant];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading || disabled}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[0.8rem] font-medium transition-[background-color,border-color] duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        color: s.color,
        border: `1.5px solid ${s.border}`,
        background: s.bg,
        fontFamily: "'DM Sans', sans-serif",
      }}
      onMouseEnter={(e) => {
        if (!loading && !disabled) e.currentTarget.style.background = s.hover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = s.bg;
      }}
      aria-label={label}
    >
      {loading ? (
        <span className="spinner-xs" aria-hidden="true" />
      ) : (
        <Icon size={13} strokeWidth={2} aria-hidden="true" />
      )}
      {label}
    </button>
  );
}

export default ActionBtn;
