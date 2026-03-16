// ── Input ────────────────────────────────────────────────────────
export function Input({ icon: Icon, error, suffix, ...props }) {
  return (
    <div
      className={`
        relative flex items-center
        border rounded-xl h-11 bg-[#FAFAF9]
        transition-[border-color,box-shadow,background-color] duration-200
        ${
          error
            ? 'border-[rgba(232,98,42,0.5)] focus-within:border-[#E8622A] focus-within:shadow-[0_0_0_3px_rgba(232,98,42,0.1)]'
            : 'border-[#E8E3DC] focus-within:border-[rgba(108,60,225,0.4)] focus-within:shadow-[0_0_0_3px_rgba(108,60,225,0.08)] focus-within:bg-white'
        }
      `}
    >
      {Icon && (
        <Icon
          size={15}
          strokeWidth={1.9}
          className="absolute left-3.5 text-[#B0AABA] pointer-events-none"
          aria-hidden="true"
        />
      )}
      <input
        className="
          flex-1 h-full bg-transparent outline-none border-none
          text-[0.875rem] text-[#1A1523] placeholder-[#C4BDD0]
          pl-10 pr-4
        "
        style={{ fontFamily: "'DM Sans', sans-serif" }}
        {...props}
      />
      {suffix}
    </div>
  );
}
