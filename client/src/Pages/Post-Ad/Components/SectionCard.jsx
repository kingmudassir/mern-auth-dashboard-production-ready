function SectionCard({ children, id }) {
  return (
    <div id={id} className="pa-card rounded-2xl p-6 md:p-8">
      {children}
    </div>
  );
}
export default SectionCard;
