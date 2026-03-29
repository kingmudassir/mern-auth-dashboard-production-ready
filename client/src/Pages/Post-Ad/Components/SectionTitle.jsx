function SectionTitle({ step, children, sub }) {
  return (
    <div className="flex items-start gap-3 mb-6">
      <span
        className="w-7 h-7 rounded-xl flex items-center justify-center text-[0.7rem] font-bold text-white flex-shrink-0 mt-0.5"
        style={{
          background: 'linear-gradient(135deg, #6C3CE1, #5A2FCA)',
          fontFamily: "'DM Sans', sans-serif",
        }}
        aria-hidden="true"
      >
        {step}
      </span>
      <div>
        <h2
          className="text-[1rem] font-extrabold tracking-[-0.025em] text-[#1A1523]"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          {children}
        </h2>
        {sub && (
          <p
            className="text-[0.75rem] text-[#8A8390] mt-0.5"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}
export default SectionTitle;
