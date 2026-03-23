import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MoreHorizontal } from 'lucide-react';

function ActionMenu({ actions }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      if (btnRef.current && !btnRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleOpen = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + window.scrollY + 4, //Moves menu down
        left: rect.right + window.scrollX - 140, //Moves menu left
      });
    }
    setOpen((p) => !p);
  };

  return (
    <div ref={btnRef} className="relative">
      <button
        type="button"
        onClick={handleOpen}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-[#8A8390] hover:bg-[#F2EEE9] hover:text-[#1A1523] transition-colors duration-150"
        aria-label="Actions"
      >
        <MoreHorizontal size={15} strokeWidth={2} />
      </button>

      {open &&
        createPortal(
          <div
            className="fixed z-9999 bg-white border border-[#E8E3DC] rounded-xl shadow-[0_8px_24px_rgba(26,21,35,0.1)] py-1"
            style={{ top: pos.top, left: pos.left, minWidth: '140px' }}
          >
            {actions.map(({ label, icon: Icon, danger, onClick }) => (
              <button
                key={label}
                type="button"
                onClick={() => {
                  setOpen(false);
                  onClick?.();
                }}
                className={`flex items-center gap-2.5 w-full px-3.5 py-2 text-[0.8rem] font-medium transition-colors duration-100 ${
                  danger
                    ? 'text-[#E8622A] hover:bg-[rgba(232,98,42,0.06)]'
                    : 'text-[#1A1523] hover:bg-[#F7F4F0]'
                }`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {Icon && <Icon size={13} strokeWidth={2} aria-hidden="true" />}
                {label}
              </button>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}

export default ActionMenu;
