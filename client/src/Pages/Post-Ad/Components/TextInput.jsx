function TextInput({ error, ...props }) {
  return (
    <input
      className="pa-input"
      style={{ borderColor: error ? 'rgba(232,98,42,0.5)' : undefined }}
      aria-invalid={!!error}
      {...props}
    />
  );
}
export default TextInput;
