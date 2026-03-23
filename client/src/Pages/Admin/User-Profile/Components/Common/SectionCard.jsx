function SectionCard({ children, danger = false }) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: danger ? '#FFFAF9' : '#FFFFFF',
        border: `1.5px solid ${danger ? 'rgba(232,98,42,0.2)' : '#E8E3DC'}`,
        boxShadow: '0 1px 4px rgba(26,21,35,0.04)',
      }}
    >
      {children}
    </div>
  );
}
export default SectionCard;
