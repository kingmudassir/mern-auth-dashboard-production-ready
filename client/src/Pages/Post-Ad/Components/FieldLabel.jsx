function FieldLabel({ children, required }) {
  return (
    <label
      className="block text-[0.7rem] font-semibold uppercase tracking-wider mb-1.5"
      style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
    >
      {children}
      {required && <span style={{ color: '#E8622A' }}> *</span>}
    </label>
  );
}
export default FieldLabel;
