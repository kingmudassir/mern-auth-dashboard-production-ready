function PanelHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h2
          className="text-[1.25rem] font-extrabold text-[#1A1523] tracking-[-0.03em]"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className="text-[0.78rem] text-[#8A8390] mt-0.5"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export default PanelHeader;
