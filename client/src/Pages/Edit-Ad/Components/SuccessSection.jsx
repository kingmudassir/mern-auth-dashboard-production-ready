import { useNavigate } from 'react-router-dom';

function SuccessSection({ fields, onDismiss }) {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#F7F4F0' }}
    >
      <div
        className="w-full max-w-md rounded-3xl p-10 text-center"
        style={{
          background: '#FFFFFF',
          border: '1.5px solid #E8E3DC',
          boxShadow: '0 12px 40px rgba(26,21,35,0.08)',
        }}
      >
        {/* Amber Warning/Clock Icon */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: 'rgba(217,119,6,0.1)' }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#D97706"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        {/* Heading */}
        <h2
          className="text-[1.5rem] font-extrabold tracking-[-0.04em] mb-2"
          style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
        >
          Changes Submitted
        </h2>

        {/* Car name */}
        <p
          className="text-[0.88rem] font-semibold mb-3"
          style={{ color: '#6C3CE1', fontFamily: "'DM Sans', sans-serif" }}
        >
          {[fields.year, fields.make, fields.model].filter(Boolean).join(' ')}
        </p>

        {/* Explanation */}
        <p
          className="text-[0.82rem] leading-relaxed mb-6"
          style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
        >
          Your updates are now <strong style={{ color: '#D97706' }}>under review</strong>. Our team
          will verify the changes against our guidelines — usually within a few hours. You can track
          the status in <strong style={{ color: '#1A1523' }}>My Ads</strong>.
        </p>

        {/* Status indicator */}
        <div
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl mb-6"
          style={{ background: 'rgba(217,119,6,0.07)', border: '1px solid rgba(217,119,6,0.2)' }}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: '#D97706' }} />
          <span
            className="text-[0.78rem] font-semibold"
            style={{ color: '#D97706', fontFamily: "'DM Sans', sans-serif" }}
          >
            Pending re-approval
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => navigate('/profile/my-ads')}
            className="w-full py-3 rounded-xl text-[0.88rem] font-bold text-white transition-opacity hover:opacity-90"
            style={{
              background: 'linear-gradient(135deg, #6C3CE1, #8B5CF6)',
              fontFamily: "'DM Sans', sans-serif",
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Go to My Ads
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="w-full py-3 rounded-xl text-[0.88rem] font-medium border transition-colors"
            style={{
              color: '#8A8390',
              borderColor: '#E8E3DC',
              background: 'transparent',
              fontFamily: "'DM Sans', sans-serif",
              cursor: 'pointer',
            }}
          >
            Edit this ad again
          </button>
        </div>
      </div>
    </div>
  );
}

export default SuccessSection;
