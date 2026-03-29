import { ArrowRight } from 'lucide-react';

const SubmitSection = ({ loading }) => {
  return (
    <div
      className="rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      style={{
        background: 'linear-gradient(135deg, #1A1523 0%, #231930 100%)',
        border: '1.5px solid rgba(255,255,255,0.06)',
      }}
    >
      <div>
        <p
          className="text-[0.95rem] font-extrabold text-white tracking-[-0.02em]"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Ready to post your ad?
        </p>
        <p
          className="text-[0.75rem] mt-0.5"
          style={{
            color: 'rgba(255,255,255,0.45)',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Your listing will be reviewed and go live shortly.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="pa-submit-btn flex items-center gap-2.5 text-white text-[0.9rem] font-semibold px-7 py-3.5 rounded-xl shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
        aria-label="Post your ad"
      >
        {loading ? (
          <>
            <span className="pa-spinner" aria-hidden="true" />
            Posting…
          </>
        ) : (
          <>
            Post Ad
            <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
          </>
        )}
      </button>
    </div>
  );
};

export default SubmitSection;
