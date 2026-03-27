import { ArrowLeft } from 'lucide-react';

const BackHeader = ({ onBack }) => {
  return (
    <button
      type="button"
      onClick={onBack}
      className="flex items-center gap-2 text-[0.8rem] font-medium transition-colors duration-150"
      style={{
        color: '#8A8390',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontFamily: "'DM Sans', sans-serif",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = '#1A1523';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = '#8A8390';
      }}
      aria-label="Go back"
    >
      <ArrowLeft size={14} strokeWidth={2} />
      Back to Users
    </button>
  );
};

export default BackHeader;
