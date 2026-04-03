import { Trash2 } from 'lucide-react';

/**
 * DeleteModal Component
 * @param {Object} ad - The car advertisement data
 * @param {Function} onConfirm - Function to call when user clicks Delete
 * @param {Function} onCancel - Function to call when user clicks Cancel or clicks away
 */
const DeleteModal = ({ ad, onConfirm, onCancel }) => {
  // Prevent clicks inside the modal from closing it
  const handleContentClick = (e) => e.stopPropagation();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{
        background: 'rgba(26, 21, 35, 0.55)',
        backdropFilter: 'blur(4px)',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onCancel} // Close on backdrop click
    >
      <div
        className="bg-white rounded-2xl p-7 w-full max-w-sm"
        style={{
          border: '1.5px solid #E8E3DC',
          boxShadow: '0 20px 60px rgba(26, 21, 35, 0.18)',
        }}
        onClick={handleContentClick}
      >
        {/* Warning Icon Container */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
          style={{ background: 'rgba(239, 68, 68, 0.1)' }}
          aria-hidden="true"
        >
          <Trash2 size={18} strokeWidth={2} style={{ color: '#dc2626' }} />
        </div>

        {/* Text Content */}
        <h3
          id="modal-title"
          className="text-[1rem] font-extrabold mb-1 tracking-[-0.025em]"
          style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
        >
          Delete this listing?
        </h3>

        <p
          className="text-[0.82rem] font-semibold mb-1"
          style={{ color: '#1A1523', fontFamily: "'DM Sans', sans-serif" }}
        >
          {ad.year} {ad.make} {ad.model}
        </p>

        <p
          className="text-[0.78rem] leading-relaxed mb-5"
          style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
        >
          This will permanently remove the listing. Buyers won't be able to find it. This cannot be
          undone.
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 text-[0.82rem] font-medium py-2.5 rounded-xl border transition-colors hover:bg-gray-50"
            style={{
              color: '#8A8390',
              borderColor: '#E8E3DC',
              background: 'transparent',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 text-[0.82rem] font-semibold text-white py-2.5 rounded-xl transition-opacity hover:opacity-90"
            style={{
              background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
