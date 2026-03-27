const SectionHeader = ({ title, subtitle, isLoading }) => {
  return (
    <div className="mb-5">
      <h1
        className="text-[1.35rem] font-extrabold tracking-[-0.035em]"
        style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
      >
        {title}
      </h1>
      <p
        className="text-[0.8rem] mt-0.5"
        style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
      >
        {isLoading ? 'Loading...' : subtitle}
      </p>
    </div>
  );
};

export default SectionHeader;
