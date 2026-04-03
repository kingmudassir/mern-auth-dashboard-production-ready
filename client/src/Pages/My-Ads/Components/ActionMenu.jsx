import { useState } from 'react';
import { MoreHorizontal, Eye, Edit2, CheckCircle2, TrendingUp, Trash2 } from 'lucide-react';

const ActionMenu = ({ ad, onDelete, onPatch }) => {
  const [open, setOpen] = useState(false);

  // Helper to handle status updates and close menu
  const handleStatusUpdate = (newStatus) => {
    onPatch(ad.id, newStatus);
    setOpen(false);
  };

  return (
    <div className="relative" style={{ zIndex: open ? 30 : 1 }}>
      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors duration-150"
        style={{
          background: open ? '#F2EEE9' : 'transparent',
          border: '1.5px solid #E8E3DC',
          cursor: 'pointer',
          color: '#8A8390',
        }}
        aria-label="Ad options"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <MoreHorizontal size={15} strokeWidth={2} aria-hidden="true" />
      </button>

      {open && (
        <>
          {/* Backdrop to close menu when clicking outside */}
          <div
            className="fixed inset-0"
            style={{ zIndex: 20 }}
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Dropdown Menu */}
          <div
            className="absolute right-0 top-full mt-1.5 w-44 rounded-2xl overflow-hidden"
            style={{
              background: '#FFFFFF',
              border: '1.5px solid #E8E3DC',
              boxShadow: '0 8px 32px rgba(26,21,35,0.13)',
              zIndex: 30,
            }}
            role="menu"
          >
            {/* View Listing */}
            <a
              href={`/cars/${ad.id}`}
              role="menuitem"
              className="flex items-center gap-2.5 px-4 py-2.5 text-[0.8rem] font-medium no-underline transition-colors duration-150"
              style={{ color: '#1A1523', fontFamily: "'DM Sans', sans-serif" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(108,60,225,0.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <Eye size={13} strokeWidth={1.8} style={{ color: '#8A8390' }} aria-hidden="true" />
              View listing
            </a>

            {/* Edit Ad */}
            <a
              href={`/edit-ad/${ad.id}`}
              role="menuitem"
              className="flex items-center gap-2.5 px-4 py-2.5 text-[0.8rem] font-medium no-underline transition-colors duration-150"
              style={{ color: '#1A1523', fontFamily: "'DM Sans', sans-serif" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(108,60,225,0.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <Edit2 size={13} strokeWidth={1.8} style={{ color: '#8A8390' }} aria-hidden="true" />
              Edit ad
            </a>

            {/* Contextual Action: Mark as Sold */}
            {ad.status === 'active' && (
              <button
                type="button"
                role="menuitem"
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[0.8rem] font-medium text-left transition-colors duration-150"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#a16207',
                  fontFamily: "'DM Sans', sans-serif",
                }}
                onClick={() => handleStatusUpdate('expired')}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(234,179,8,0.06)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
              >
                <CheckCircle2 size={13} strokeWidth={1.8} aria-hidden="true" />
                Mark as sold
              </button>
            )}

            {/* Contextual Action: Repost */}
            {(ad.status === 'expired' || ad.status === 'rejected') && (
              <button
                type="button"
                role="menuitem"
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[0.8rem] font-medium text-left transition-colors duration-150"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#16a34a',
                  fontFamily: "'DM Sans', sans-serif",
                }}
                onClick={() => handleStatusUpdate('pending')}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(34,197,94,0.06)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
              >
                <TrendingUp size={13} strokeWidth={1.8} aria-hidden="true" />
                Repost ad
              </button>
            )}

            {/* Divider */}
            <div
              style={{ height: '1px', background: '#F2EEE9', margin: '2px 0' }}
              aria-hidden="true"
            />

            {/* Delete Action */}
            <button
              type="button"
              role="menuitem"
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[0.8rem] font-medium text-left transition-colors duration-150"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#dc2626',
                fontFamily: "'DM Sans', sans-serif",
              }}
              onClick={() => {
                onDelete(ad.id);
                setOpen(false);
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239,68,68,0.06)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
            >
              <Trash2 size={13} strokeWidth={1.8} aria-hidden="true" />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ActionMenu;
