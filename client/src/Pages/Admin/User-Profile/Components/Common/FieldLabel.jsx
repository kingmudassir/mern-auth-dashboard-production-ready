function FieldLabel({ children }) {
  return (
    <p
      className="text-[0.68rem] font-semibold uppercase tracking-wider mb-1"
      style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
    >
      {children}
    </p>
  );
}

export default FieldLabel;
