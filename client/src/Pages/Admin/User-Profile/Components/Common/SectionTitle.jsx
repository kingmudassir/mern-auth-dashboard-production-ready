function SectionTitle({ children, sub }) {
  return (
    <div className="mb-5">
      <h2
        className="text-[0.95rem] font-bold tracking-[-0.02em]"
        style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
      >
        {children}
      </h2>
      {sub && (
        <p
          className="text-[0.75rem] mt-0.5"
          style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

export default SectionTitle;
